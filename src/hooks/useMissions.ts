import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useActiveWeeklyMission() {
  return useQuery({
    queryKey: ["weekly_mission"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_missions")
        .select("*")
        .eq("active", true)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateMissionProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, progress, completed }: { id: string; progress: number; completed: boolean }) => {
      const { error } = await supabase
        .from("weekly_missions")
        .update({ current_progress: progress, completed })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly_mission"] });
    },
  });
}
