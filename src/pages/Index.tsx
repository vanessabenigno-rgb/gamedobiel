import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerHeader } from "@/components/game/PlayerHeader";
import { CountdownTimer } from "@/components/game/CountdownTimer";
import { TaskCard } from "@/components/game/TaskCard";
import { DayProgress } from "@/components/game/DayProgress";
import { WeeklyMission } from "@/components/game/WeeklyMission";
import { AchievementBadges } from "@/components/game/AchievementBadges";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShoppingCart, Crosshair } from "lucide-react";
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

  useEffect(() => { ensureTasks.mutate(); }, []);

  useEffect(() => {
    if (permission === "default") {
      const timer = setTimeout(() => requestPermission(), 3000);
      return () => clearTimeout(timer);
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const key = `${h}:${m < 30 ? "0" : "30"}`;
      if (notifiedRef.current.has(key)) return;
      const pending = dailyTasks?.filter((t) => t.status === "pending").length || 0;

      if (h === 8 && m < 5) { sendNotification("🌅 Missões do dia liberadas!", "Bora começar o dia!"); notifiedRef.current.add(key); }
      else if (h === 17 && m < 5) { sendNotification("📊 Como está o progresso?", "Dá uma olhada nas tarefas!"); notifiedRef.current.add(key); }
      else if (h === 20 && m >= 25 && m <= 35) { sendNotification("⏰ Última chamada!", pending > 0 ? `Faltam ${pending} tarefas!` : "Corre!"); notifiedRef.current.add(key); }
      else if (h === 18 && m < 5 && pending > 0) { sendNotification("💪 Ainda dá tempo!", `${pending} tarefas pendentes.`); notifiedRef.current.add(key); }
      else if (h >= 19 && h < 21 && m < 5 && pending > 0) { sendNotification("🚨 Prazo chegando!", `${pending} tarefas, menos de ${21 - h}h!`); notifiedRef.current.add(key); }
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
        <PlayerHeader
          avatar={player?.avatar || "🦸"}
          totalPoints={player?.total_points || 0}
          monthlyPoints={monthlyPoints || 0}
          streak={player?.current_streak || 0}
        />
        <CountdownTimer />
        <DayProgress completed={approvedCount} total={totalCount} />
        <WeeklyMission />

        <div>
          <h2 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-primary" />
            Tarefas de Hoje
          </h2>
          {loadingTasks ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Carregando...</div>
          ) : (
            <div className="space-y-2">
              {dailyTasks?.map((dt) => (
                <TaskCard key={dt.id} id={dt.id} name={dt.tasks?.name || ""} emoji={dt.tasks?.emoji || "📋"} points={dt.tasks?.points || 0} status={dt.status} />
              ))}
            </div>
          )}
        </div>

        <AchievementBadges />
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Button onClick={() => navigate("/loja")} size="icon" className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 shadow-lg">
          <ShoppingCart className="w-5 h-5" />
        </Button>
        <Button onClick={() => navigate("/mae")} size="icon" className="w-12 h-12 rounded-full gradient-primary shadow-lg animate-pulse-glow">
          <ShieldCheck className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
