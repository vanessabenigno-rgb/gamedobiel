import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Coins, Gift } from "lucide-react";
import { useRewards, useRequestRedemption } from "@/hooks/useRewards";
import { usePlayerData } from "@/hooks/useGameData";
import { toast } from "sonner";

export default function RewardShop() {
  const navigate = useNavigate();
  const { data: rewards, isLoading } = useRewards();
  const { data: player } = usePlayerData();
  const requestRedemption = useRequestRedemption();

  const totalPoints = player?.total_points || 0;

  const handleRedeem = (rewardId: string, pointsRequired: number, name: string) => {
    if (totalPoints < pointsRequired) {
      toast.error("XP insuficiente!");
      return;
    }
    requestRedemption.mutate(
      { rewardId, pointsSpent: pointsRequired },
      {
        onSuccess: () => toast.success(`Resgate de "${name}" solicitado! Aguarde aprovação.`),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display font-bold text-sm tracking-wider flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-neon-yellow" />
            LOJA DE RECOMPENSAS
          </h1>
        </div>

        <Card className="gradient-primary neon-glow-purple border-0">
          <CardContent className="flex items-center gap-3 py-4">
            <Coins className="w-6 h-6 text-neon-yellow" />
            <div>
              <p className="text-xs text-primary-foreground/80 font-display tracking-wider">SEUS XP</p>
              <p className="text-2xl font-display font-extrabold text-primary-foreground">{totalPoints}</p>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground font-display text-xs tracking-wider">CARREGANDO...</div>
        ) : (
          <div className="space-y-3">
            {rewards?.map((r) => {
              const canAfford = totalPoints >= r.points_required;
              return (
                <Card key={r.id} className={`glass-card border ${canAfford ? "border-neon-cyan/20" : "border-border/30 opacity-50"}`}>
                  <CardContent className="flex items-center gap-3 py-4">
                    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                      <Gift className={`w-5 h-5 ${canAfford ? "text-neon-cyan" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{r.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-display font-bold text-neon-purple tracking-wider">{r.points_required} XP</span>
                        <span className="text-[9px] bg-muted/50 px-2 py-0.5 rounded-full font-display tracking-wider">
                          {r.type === "individual" ? "INDIVIDUAL" : "COLETIVA"}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRedeem(r.id, r.points_required, r.name)}
                      disabled={!canAfford || requestRedemption.isPending}
                      className="rounded-xl font-display font-bold text-[10px] tracking-wider gradient-primary neon-glow-purple"
                    >
                      RESGATAR
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
