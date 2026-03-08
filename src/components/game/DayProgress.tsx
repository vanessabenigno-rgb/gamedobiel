import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

interface DayProgressProps {
  completed: number;
  total: number;
}

export function DayProgress({ completed, total }: DayProgressProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-display font-bold text-xs tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-neon-cyan" />
          PROGRESSO DO DIA
        </span>
        <span className="text-sm font-display font-bold text-neon-cyan">{completed}/{total}</span>
      </div>
      <Progress value={percent} className="h-3" />
      <p className="text-[10px] text-muted-foreground mt-1.5 text-center font-display tracking-wider">{percent}% CONCLUÍDO</p>
    </div>
  );
}
