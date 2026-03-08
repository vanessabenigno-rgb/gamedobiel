import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useActiveWeeklyMission } from "@/hooks/useMissions";
import { Target, Trophy } from "lucide-react";

export function WeeklyMission() {
  const { data: mission } = useActiveWeeklyMission();

  if (!mission) return null;

  const percent = Math.round((mission.current_progress / mission.goal) * 100);

  return (
    <Card className={`border ${mission.completed ? "border-neon-green/40 neon-glow-green" : "border-neon-purple/30 neon-glow-purple"} bg-card/80 backdrop-blur-sm`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className={`w-5 h-5 ${mission.completed ? "text-neon-green" : "text-neon-purple"}`} />
          <h3 className="font-display font-bold text-xs tracking-wider">MISSÃO DA SEMANA</h3>
          {mission.completed && (
            <span className="ml-auto flex items-center gap-1 text-neon-green font-display font-bold text-[10px] tracking-wider">
              <Trophy className="w-3 h-3" /> CONCLUÍDA
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
        <Progress value={Math.min(100, percent)} className="h-2 mb-1" />
        <p className="text-[10px] text-muted-foreground text-right font-display tracking-wider">
          {mission.current_progress}/{mission.goal} dias
        </p>
      </CardContent>
    </Card>
  );
}
