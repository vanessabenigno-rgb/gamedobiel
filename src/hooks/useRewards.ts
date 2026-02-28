import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRewards() {
  return useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .eq("active", true)
        .order("points_required");
      if (error) throw error;
      return data;
    },
  });
}

export function useRedemptions() {
  return useQuery({
    queryKey: ["redemptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("redemptions")
        .select("*, rewards(*)")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePendingRedemptions() {
  return useQuery({
    queryKey: ["pending_redemptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("redemptions")
        .select("*, rewards(*)")
        .eq("status", "pendente")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useRequestRedemption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ rewardId, pointsSpent }: { rewardId: string; pointsSpent: number }) => {
      const { error } = await supabase
        .from("redemptions")
        .insert({ reward_id: rewardId, points_spent: pointsSpent });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["redemptions"] });
      queryClient.invalidateQueries({ queryKey: ["pending_redemptions"] });
    },
  });
}

export function useApproveRedemption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ redemptionId, pointsSpent }: { redemptionId: string; pointsSpent: number }) => {
      // Update redemption status
      const { error: redError } = await supabase
        .from("redemptions")
        .update({ status: "aprovado" })
        .eq("id", redemptionId);
      if (redError) throw redError;

      // Deduct points from player
      const { data: player } = await supabase
        .from("player_data")
        .select("id, total_points")
        .limit(1)
        .single();
      if (player) {
        await supabase
          .from("player_data")
          .update({ total_points: Math.max(0, player.total_points - pointsSpent) })
          .eq("id", player.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["redemptions"] });
      queryClient.invalidateQueries({ queryKey: ["pending_redemptions"] });
      queryClient.invalidateQueries({ queryKey: ["player_data"] });
    },
  });
}
