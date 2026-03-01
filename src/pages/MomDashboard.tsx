import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Check, Gift } from "lucide-react";
import {
  usePendingApprovals,
  useApproveTask,
  useVerifyPin,
  useMonthlyPoints,
  useWeeklyData,
  usePlayerData,
} from "@/hooks/useGameData";
import { usePendingRedemptions } from "@/hooks/useRewards";
import { RedemptionCard } from "@/components/game/RedemptionCard";
import { CreateTaskDialog } from "@/components/game/CreateTaskDialog";
import { MONTHLY_GOAL, getRewardTier } from "@/lib/game-constants";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

export default function MomDashboard() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const verifyPin = useVerifyPin();
  const { data: pending } = usePendingApprovals();
  const approveTask = useApproveTask();
  const { data: monthlyPoints } = useMonthlyPoints();
  const { data: weeklyData } = useWeeklyData();
  const { data: player } = usePlayerData();
  const { data: pendingRedemptions } = usePendingRedemptions();

  const handlePinComplete = (value: string) => {
    setPin(value);
    if (value.length === 4) {
      verifyPin.mutate(value, {
        onSuccess: (valid) => {
          if (valid) {
            setAuthenticated(true);
            setPinError(false);
          } else {
            setPinError(true);
            setPin("");
          }
        },
      });
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle className="text-2xl">🔒 Área da Mãe</CardTitle>
            <p className="text-muted-foreground text-sm">Digite o PIN de 4 dígitos</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <InputOTP maxLength={4} value={pin} onChange={handlePinComplete}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            {pinError && (
              <p className="text-destructive text-sm font-semibold">PIN incorreto!</p>
            )}
            <Button variant="ghost" onClick={() => navigate("/")} className="mt-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const monthPercent = monthlyPoints ? Math.round((monthlyPoints / MONTHLY_GOAL) * 100) : 0;
  const reward = getRewardTier(monthlyPoints || 0);

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-extrabold text-xl">👩 Painel da Mãe</h1>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <CreateTaskDialog />
          <Button
            onClick={() => navigate("/mae/recompensas")}
            variant="outline"
            className="font-bold"
          >
            <Gift className="w-4 h-4 mr-2" /> Gerenciar Recompensas
          </Button>
        </div>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">⏳ Aguardando Aprovação ({pending?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pending && pending.length > 0 ? (
              pending.map((dt) => (
                <div
                  key={dt.id}
                  className="flex items-center gap-3 p-3 bg-game-warning/10 rounded-xl border-l-4 border-l-game-warning"
                >
                  <span className="text-xl">{dt.tasks?.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{dt.tasks?.name}</p>
                    <p className="text-xs text-muted-foreground">{dt.date} • +{dt.tasks?.points} pts</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => approveTask.mutate(dt.id)}
                    disabled={approveTask.isPending}
                    className="gradient-success text-accent-foreground rounded-xl font-bold"
                  >
                    <Check className="w-4 h-4 mr-1" /> Aprovar
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground text-sm py-4">
                Nenhuma tarefa aguardando 👍
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pending Redemptions */}
        {pendingRedemptions && pendingRedemptions.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">🎁 Resgates Pendentes ({pendingRedemptions.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingRedemptions.map((r) => (
                <RedemptionCard
                  key={r.id}
                  id={r.id}
                  rewardName={r.rewards?.name || "Recompensa"}
                  pointsSpent={r.points_spent}
                  date={r.date}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Monthly Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">📅 Meta Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-2">
              <span>{monthlyPoints || 0} / {MONTHLY_GOAL} pts</span>
              <span className="font-bold text-primary">{reward.label}</span>
            </div>
            <Progress value={Math.min(100, monthPercent)} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1">{monthPercent}% da meta</p>
          </CardContent>
        </Card>

        {/* Weekly Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">📊 Desempenho Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyData && (
              <ChartContainer
                config={{ points: { label: "Pontos", color: "hsl(var(--primary))" } }}
                className="h-48"
              >
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="points" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Streak */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">🔥 Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around text-center">
              <div>
                <p className="text-3xl font-extrabold text-primary">{player?.current_streak || 0}</p>
                <p className="text-xs text-muted-foreground">Atual</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-accent">{player?.best_streak || 0}</p>
                <p className="text-xs text-muted-foreground">Melhor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
