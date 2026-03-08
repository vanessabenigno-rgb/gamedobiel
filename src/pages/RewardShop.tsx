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
    if (totalPoints < pointsRequired) { toast.error("XP insuficiente!"); return; }
    requestRedemption.mutate({ rewardId, pointsSpent: pointsRequired }, {
      onSuccess: () => toast.success(`Resgate de "${name}" solicitado! Aguarde aprovação.`),
    });
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display font-bold text-sm flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" /> Loja de Recompensas
          </h1>
        </div>

        <Card className="gradient-primary border-0">
          <CardContent className="flex items-center gap-3 py-4">
            <Coins className="w-5 h-5 text-primary-foreground/80" />
            <div>
              <p className="text-xs text-primary-foreground/70">Seus XP</p>
              <p className="text-2xl font-display font-bold text-primary-foreground">{totalPoints}</p>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Carregando...</div>
        ) : (
          <div className="space-y-2">
            {rewards?.map((r) => {
              const canAfford = totalPoints >= r.points_required;
              return (
                <Card key={r.id} className={`border ${canAfford ? "border-border" : "border-border/50 opacity-50"}`}>
                  <CardContent className="flex items-center gap-3 py-3.5">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                      <Gift className="w-4 h-4 text-foreground/70" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{r.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-primary">{r.points_required} XP</span>
                        <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-md text-muted-foreground">
                          {r.type === "individual" ? "Individual" : "Coletiva"}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleRedeem(r.id, r.points_required, r.name)} disabled={!canAfford || requestRedemption.isPending} className="rounded-lg font-semibold text-xs gradient-primary h-8 px-3">
                      Resgatar
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
