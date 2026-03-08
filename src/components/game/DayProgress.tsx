import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

interface DayProgressProps {
  completed: number;
  total: number;
}

export function DayProgress({ completed, total }: DayProgressProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Progresso do dia
        </span>
        <span className="text-sm font-bold text-primary">{completed}/{total}</span>
      </div>
      <Progress value={percent} className="h-2" />
      <p className="text-[11px] text-muted-foreground mt-1.5 text-center">{percent}% concluído</p>
    </div>
  );
}
