import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useActiveWeeklyMission } from "@/hooks/useMissions";

export function WeeklyMission() {
  const { data: mission } = useActiveWeeklyMission();

  if (!mission) return null;

  const percent = Math.round((mission.current_progress / mission.goal) * 100);

  return (
    <Card className={`border-2 ${mission.completed ? "border-game-success bg-game-success/10" : "border-primary/30"}`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🎯</span>
          <h3 className="font-bold text-sm">Missão da Semana</h3>
          {mission.completed && <span className="ml-auto text-game-success font-bold text-xs">✅ Concluída!</span>}
        </div>
        <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
        <Progress value={Math.min(100, percent)} className="h-2 mb-1" />
        <p className="text-xs text-muted-foreground text-right">
          {mission.current_progress}/{mission.goal} dias
        </p>
      </CardContent>
    </Card>
  );
}
