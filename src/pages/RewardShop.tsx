import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag } from "lucide-react";
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
      toast.error("Pontos insuficientes!");
      return;
    }
    requestRedemption.mutate(
      { rewardId, pointsSpent: pointsRequired },
      {
        onSuccess: () => toast.success(`Resgate de "${name}" solicitado! Aguarde aprovação da mãe.`),
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
          <h1 className="font-extrabold text-xl">🏪 Loja de Recompensas</h1>
        </div>

        <Card className="gradient-primary text-primary-foreground">
          <CardContent className="flex items-center gap-3 py-4">
            <ShoppingBag className="w-6 h-6" />
            <div>
              <p className="text-sm opacity-90">Seus pontos</p>
              <p className="text-2xl font-extrabold">{totalPoints} pts</p>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando...</div>
        ) : (
          <div className="space-y-3">
            {rewards?.map((r) => {
              const canAfford = totalPoints >= r.points_required;
              return (
                <Card key={r.id} className={`${!canAfford ? "opacity-60" : ""}`}>
                  <CardContent className="flex items-center gap-3 py-4">
                    <div className="flex-1">
                      <p className="font-bold text-sm">{r.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-primary">{r.points_required} pts</span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">
                          {r.type === "individual" ? "Individual" : "Coletiva"}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRedeem(r.id, r.points_required, r.name)}
                      disabled={!canAfford || requestRedemption.isPending}
                      className="rounded-xl font-bold gradient-primary"
                    >
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
