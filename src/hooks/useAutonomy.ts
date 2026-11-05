import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fortalezaToday, taskAppliesOn } from "@/lib/autonomy";

const KEYS = ["settings", "activities", "initiatives", "school", "checkins", "usage", "reminders", "daily_tasks", "range"];
export function useInvalidateAll() {
  const qc = useQueryClient();
  return () => KEYS.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
}

export function useSettings() {
  return useQuery({ queryKey: ["settings"], queryFn: async () => {
    const { data, error } = await supabase.from("screen_time_settings").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return data;
  }});
}

export function useActivities(all = false) {
  return useQuery({ queryKey: ["activities", all], queryFn: async () => {
    let q = supabase.from("initiative_activities").select("*").order("sort_order");
    if (!all) q = q.eq("active", true);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  }});
}

/** All records in a date range (inclusive). */
export function useRange(from: string, to: string) {
  return useQuery({ queryKey: ["range", from, to], queryFn: async () => {
    const [ini, school, checkins, usage, reminders, daily] = await Promise.all([
      supabase.from("initiative_logs").select("*, initiative_activities(name, emoji)").gte("log_date", from).lte("log_date", to).order("created_at", { ascending: false }),
      supabase.from("school_logs").select("*").gte("log_date", from).lte("log_date", to),
      supabase.from("daily_checkins").select("*").gte("log_date", from).lte("log_date", to),
      supabase.from("screen_time_usage").select("*").gte("log_date", from).lte("log_date", to),
      supabase.from("reminders").select("*").gte("log_date", from).lte("log_date", to),
      supabase.from("daily_tasks").select("*, tasks(*)").gte("date", from).lte("date", to),
    ]);
    for (const r of [ini, school, checkins, usage, reminders, daily]) if (r.error) throw r.error;
    return {
      initiatives: ini.data!, school: school.data!, checkins: checkins.data!,
      usage: usage.data!, reminders: reminders.data!, daily: daily.data!,
    };
  }});
}

export function useEnsureToday() {
  const inv = useInvalidateAll();
  return useMutation({
    mutationFn: async () => {
      const d = fortalezaToday();
      const { data: existing } = await supabase.from("daily_tasks").select("task_id").eq("date", d);
      const { data: tasks } = await supabase.from("tasks").select("*");
      if (!tasks) return;
      const have = new Set((existing || []).map((e) => e.task_id));
      const inserts = tasks
        .filter((t) => t.weekdays !== "once" && taskAppliesOn(t.weekdays, d) && !have.has(t.id))
        .map((t) => ({ task_id: t.id, date: d, status: "pending" }));
      if (inserts.length) await supabase.from("daily_tasks").insert(inserts);
    },
    onSuccess: inv,
  });
}

export function useMutate<T>(fn: (v: T) => Promise<{ error: unknown } | void>) {
  const inv = useInvalidateAll();
  return useMutation({
    mutationFn: async (v: T) => {
      const r = await fn(v);
      if (r && r.error) throw r.error;
    },
    onSuccess: inv,
  });
}
