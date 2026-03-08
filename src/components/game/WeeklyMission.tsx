import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useActiveWeeklyMission } from "@/hooks/useMissions";
import { Target, Trophy } from "lucide-react";

export function WeeklyMission() {
  const { data: mission } = useActiveWeeklyMission();

  if (!mission) return null;

  const percent = Math.round((mission.current_progress / mission.goal) * 100);

  return (
    <Card className={`border ${mission.completed ? "border-primary/30 bg-primary/5" : "border-border"}`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className={`w-4 h-4 ${mission.completed ? "text-primary" : "text-muted-foreground"}`} />
          <h3 className="font-semibold text-sm">Missão da Semana</h3>
          {mission.completed && (
            <span className="ml-auto flex items-center gap-1 text-primary text-xs font-semibold">
              <Trophy className="w-3 h-3" /> Concluída
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
        <Progress value={Math.min(100, percent)} className="h-1.5 mb-1" />
        <p className="text-[11px] text-muted-foreground text-right">
          {mission.current_progress}/{mission.goal} dias
        </p>
      </CardContent>
    </Card>
  );
}
