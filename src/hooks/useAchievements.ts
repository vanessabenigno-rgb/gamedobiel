import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAchievements() {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("unlocked", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCheckAchievements() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (streak: number) => {
      const { data: achievements } = await supabase
        .from("achievements")
        .select("*")
        .eq("unlocked", false);

      if (!achievements) return;

      for (const a of achievements) {
        let shouldUnlock = false;
        if (a.criteria === "streak_3" && streak >= 3) shouldUnlock = true;
        if (a.criteria === "streak_7" && streak >= 7) shouldUnlock = true;

        if (shouldUnlock) {
          await supabase
            .from("achievements")
            .update({ unlocked: true, unlocked_at: new Date().toISOString() })
            .eq("id", a.id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
  });
}
