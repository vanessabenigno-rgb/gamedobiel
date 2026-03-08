import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerHeader } from "@/components/game/PlayerHeader";
import { CountdownTimer } from "@/components/game/CountdownTimer";
import { TaskCard } from "@/components/game/TaskCard";
import { DayProgress } from "@/components/game/DayProgress";
import { WeeklyMission } from "@/components/game/WeeklyMission";
import { AchievementBadges } from "@/components/game/AchievementBadges";
import { Button } from "@/components/ui/button";
import { Shield, ShoppingBag } from "lucide-react";
import {
  useDailyTasks,
  usePlayerData,
  useMonthlyPoints,
  useEnsureDailyTasks,
} from "@/hooks/useGameData";
import { useNotificationPermission, sendNotification } from "@/hooks/useNotifications";

const Index = () => {
  const navigate = useNavigate();
  const { data: dailyTasks, isLoading: loadingTasks } = useDailyTasks();
  const { data: player } = usePlayerData();
  const { data: monthlyPoints } = useMonthlyPoints();
  const ensureTasks = useEnsureDailyTasks();
  const notifiedRef = useRef<Set<string>>(new Set());
  const { permission, requestPermission } = useNotificationPermission();

  useEffect(() => {
    ensureTasks.mutate();
  }, []);

  // Request notification permission on first visit
  useEffect(() => {
    if (permission === "default") {
      const timer = setTimeout(() => requestPermission(), 3000);
      return () => clearTimeout(timer);
    }
  }, [permission, requestPermission]);

  // Motivational notifications based on time
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();

      const key = `${h}:${m < 30 ? "0" : "30"}`;
      if (notifiedRef.current.has(key)) return;

      const pending = dailyTasks?.filter((t) => t.status === "pending").length || 0;

      if (h === 8 && m < 5) {
        sendNotification("🌅 Missões do dia liberadas!", "Bora começar o dia!");
        notifiedRef.current.add(key);
      } else if (h === 17 && m < 5) {
        sendNotification("📊 Como está o progresso hoje?", "Dá uma olhada nas tarefas!");
        notifiedRef.current.add(key);
      } else if (h === 20 && m >= 25 && m <= 35) {
        sendNotification(
          "⏰ Última chamada antes das 21h!",
          pending > 0
            ? `Ainda faltam ${pending} tarefas! Corre que ainda dá tempo!`
            : "Corre que ainda dá tempo!"
        );
        notifiedRef.current.add(key);
      } else if (h === 18 && m < 5) {
        if (pending > 0) {
          sendNotification("💪 Ei, ainda dá tempo!", `Você tem ${pending} tarefas pendentes.`);
          notifiedRef.current.add(key);
        }
      } else if (h >= 19 && h < 21 && m < 5 && pending > 0) {
        sendNotification(
          "🚨 Prazo se aproximando!",
          `Faltam ${pending} tarefas e menos de ${21 - h}h para o prazo!`
        );
        notifiedRef.current.add(key);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [dailyTasks]);

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

        {/* Weekly Mission */}
        <WeeklyMission />

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

        {/* Achievements */}
        <AchievementBadges />
      </div>

      {/* FABs */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Button
          onClick={() => navigate("/loja")}
          size="icon"
          className="w-14 h-14 rounded-full bg-game-warning shadow-xl"
        >
          <ShoppingBag className="w-6 h-6" />
        </Button>
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
