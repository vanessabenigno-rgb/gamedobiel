import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const today = () => format(new Date(), "yyyy-MM-dd");

export function useProfile() {
  const { user } = useAuth();
  return useQuery({ queryKey: ["profile", user?.id], enabled: !!user, queryFn: async () => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
    if (error) throw error;
    return data;
  }});
}

export function useScreenTime() {
  const { data: profile } = useProfile();
  return useQuery({ queryKey: ["screen-time", profile?.id, today()], enabled: !!profile, queryFn: async () => {
    const [settingsResult, ledgerResult] = await Promise.all([
      supabase.from("screen_time_settings").select("*").eq("family_id", profile!.family_id).single(),
      supabase.from("screen_time_ledger").select("*").eq("child_id", profile!.id).eq("event_date", today()).order("created_at", { ascending: false }),
    ]);
    if (settingsResult.error) throw settingsResult.error;
    if (ledgerResult.error) throw ledgerResult.error;
    const extra = ledgerResult.data.filter((e) => e.event_type !== "uso").reduce((sum, e) => sum + e.minutes, 0);
    const used = Math.abs(ledgerResult.data.filter((e) => e.event_type === "uso").reduce((sum, e) => sum + e.minutes, 0));
    return { settings: settingsResult.data, events: ledgerResult.data, extra, used, available: Math.max(0, settingsResult.data.guaranteed_minutes + extra - used) };
  }});
}

export function useActivities() {
  return useQuery({ queryKey: ["activities"], queryFn: async () => {
    const { data, error } = await supabase.from("initiative_activities").select("*").eq("active", true).order("sort_order");
    if (error) throw error;
    return data;
  }});
}

export function useInitiatives(pendingOnly = false) {
  return useQuery({ queryKey: ["initiatives", pendingOnly], queryFn: async () => {
    let query = supabase.from("initiative_logs").select("*, initiative_activities(name, emoji)").order("created_at", { ascending: false });
    if (pendingOnly) query = query.eq("status", "pendente");
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }});
}

export function useSubmitInitiative() {
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  return useMutation({ mutationFn: async ({ activityId, description, minutes }: { activityId: string; description?: string; minutes: number }) => {
    if (!profile) throw new Error("Perfil não carregado");
    const { error } = await supabase.from("initiative_logs").insert({ family_id: profile.family_id, child_id: profile.id, activity_id: activityId, description, proposed_minutes: minutes });
    if (error) throw error;
  }, onSuccess: () => qc.invalidateQueries({ queryKey: ["initiatives"] }) });
}

export function useReviewInitiative() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async ({ id, decision, minutes }: { id: string; decision: "aprovado" | "recusado" | "correcao"; minutes?: number }) => {
    const { error } = await supabase.rpc("review_initiative", { initiative_id: id, decision, approved: minutes });
    if (error) throw error;
  }, onSuccess: async () => {
    await Promise.all([qc.invalidateQueries({ queryKey: ["initiatives"] }), qc.invalidateQueries({ queryKey: ["screen-time"] })]);
  }});
}
