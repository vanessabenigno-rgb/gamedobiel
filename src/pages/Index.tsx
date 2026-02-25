import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerHeader } from "@/components/game/PlayerHeader";
import { CountdownTimer } from "@/components/game/CountdownTimer";
import { TaskCard } from "@/components/game/TaskCard";
import { DayProgress } from "@/components/game/DayProgress";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import {
  useDailyTasks,
  usePlayerData,
  useMonthlyPoints,
  useEnsureDailyTasks,
} from "@/hooks/useGameData";

const Index = () => {
  const navigate = useNavigate();
  const { data: dailyTasks, isLoading: loadingTasks } = useDailyTasks();
  const { data: player } = usePlayerData();
  const { data: monthlyPoints } = useMonthlyPoints();
  const ensureTasks = useEnsureDailyTasks();

  useEffect(() => {
    ensureTasks.mutate();
  }, []);

  const approvedCount = dailyTasks?.filter((t) => t.status === "approved").length || 0;
  const totalCount = dailyTasks?.length || 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <PlayerHeader
          avatar={player?.avatar || "🦸"}
          totalPoints={player?.total_points || 0}
          monthlyPoints={monthlyPoints || 0}
          streak={player?.current_streak || 0}
        />

        {/* Countdown */}
        <CountdownTimer />

        {/* Day Progress */}
        <DayProgress completed={approvedCount} total={totalCount} />

        {/* Tasks */}
        <div>
          <h2 className="font-extrabold text-lg mb-3">🎯 Tarefas de Hoje</h2>
          {loadingTasks ? (
            <div className="text-center py-8 text-muted-foreground">Carregando...</div>
          ) : (
            <div className="space-y-3">
              {dailyTasks?.map((dt) => (
                <TaskCard
                  key={dt.id}
                  id={dt.id}
                  name={dt.tasks?.name || ""}
                  emoji={dt.tasks?.emoji || "📋"}
                  points={dt.tasks?.points || 0}
                  status={dt.status}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAB for mom */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => navigate("/mae")}
          size="icon"
          className="w-14 h-14 rounded-full gradient-primary shadow-xl animate-pulse-glow"
        >
          <Shield className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
