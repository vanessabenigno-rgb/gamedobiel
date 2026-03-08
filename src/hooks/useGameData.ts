import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from "date-fns";
import { isWeekday } from "@/lib/game-constants";

const today = () => format(new Date(), "yyyy-MM-dd");

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useDailyTasks(date?: string) {
  const dateStr = date || today();
  return useQuery({
    queryKey: ["daily_tasks", dateStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_tasks")
        .select("*, tasks(*)")
        .eq("date", dateStr);
      if (error) throw error;
      return data;
    },
  });
}

export function usePlayerData() {
  return useQuery({
    queryKey: ["player_data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_data")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useMonthlyPoints() {
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd");
  return useQuery({
    queryKey: ["monthly_points", monthStart],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_tasks")
        .select("*, tasks(points)")
        .eq("status", "approved")
        .gte("date", monthStart)
        .lte("date", monthEnd);
      if (error) throw error;
      return data.reduce((sum, dt) => sum + (dt.tasks?.points || 0), 0);
    },
  });
}

export function useWeeklyData() {
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  return useQuery({
    queryKey: ["weekly_data", weekStart],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_tasks")
        .select("*, tasks(points)")
        .eq("status", "approved")
        .gte("date", weekStart)
        .lte("date", weekEnd);
      if (error) throw error;

      const days = eachDayOfInterval({
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 }),
      });

      return days.map((day) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const dayLabel = format(day, "EEE").slice(0, 3);
        const points = data
          .filter((dt) => dt.date === dateStr)
          .reduce((sum, dt) => sum + (dt.tasks?.points || 0), 0);
        return { day: dayLabel, points, date: dateStr };
      });
    },
  });
}

export function usePendingApprovals() {
  return useQuery({
    queryKey: ["pending_approvals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_tasks")
        .select("*, tasks(*)")
        .eq("status", "waiting")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useEnsureDailyTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const dateStr = today();
      const now = new Date();

      // Check if daily tasks already exist
      const { data: existing } = await supabase
        .from("daily_tasks")
        .select("id")
        .eq("date", dateStr)
        .limit(1);

      if (existing && existing.length > 0) return;

      // Get all tasks
      const { data: tasks } = await supabase
        .from("tasks")
        .select("*");

      if (!tasks) return;

      // Filter tasks for today
      const todayTasks = tasks.filter((t) => {
        if (t.weekdays === "all") return true;
        if (t.weekdays === "weekdays") return isWeekday(now);
        return true;
      });

      // Insert daily tasks
      const inserts = todayTasks.map((t) => ({
        task_id: t.id,
        date: dateStr,
        status: "pending" as const,
      }));

      if (inserts.length > 0) {
        await supabase.from("daily_tasks").insert(inserts);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_tasks"] });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dailyTaskId: string) => {
      const { error } = await supabase
        .from("daily_tasks")
        .update({
          status: "waiting",
          completed_at: new Date().toISOString(),
        })
        .eq("id", dailyTaskId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_tasks"] });
      queryClient.invalidateQueries({ queryKey: ["pending_approvals"] });
    },
  });
}

export function useApproveTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dailyTaskId: string) => {
      // Get task points before approving
      const { data: dailyTask } = await supabase
        .from("daily_tasks")
        .select("*, tasks(points)")
        .eq("id", dailyTaskId)
        .single();

      const { error } = await supabase
        .from("daily_tasks")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
        })
        .eq("id", dailyTaskId);
      if (error) throw error;

      // Add points to player_data
      const taskPoints = dailyTask?.tasks?.points || 0;
      if (taskPoints > 0) {
        const { data: player } = await supabase
          .from("player_data")
          .select("id, total_points")
          .limit(1)
          .single();
        if (player) {
          await supabase
            .from("player_data")
            .update({ total_points: player.total_points + taskPoints })
            .eq("id", player.id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_tasks"] });
      queryClient.invalidateQueries({ queryKey: ["pending_approvals"] });
      queryClient.invalidateQueries({ queryKey: ["monthly_points"] });
      queryClient.invalidateQueries({ queryKey: ["weekly_data"] });
      queryClient.invalidateQueries({ queryKey: ["player_data"] });
    },
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (avatar: string) => {
      const { data: player } = await supabase
        .from("player_data")
        .select("id")
        .limit(1)
        .single();
      if (!player) return;
      await supabase
        .from("player_data")
        .update({ avatar })
        .eq("id", player.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player_data"] });
    },
  });
}

export function useVerifyPin() {
  return useMutation({
    mutationFn: async (pin: string) => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "mom_pin")
        .single();
      if (error) throw error;
      return data.value === pin;
    },
  });
}
