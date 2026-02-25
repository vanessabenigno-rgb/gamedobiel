import { Progress } from "@/components/ui/progress";

interface DayProgressProps {
  completed: number;
  total: number;
}

export function DayProgress({ completed, total }: DayProgressProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-sm">📊 Progresso do dia</span>
        <span className="text-sm font-bold text-primary">{completed}/{total}</span>
      </div>
      <Progress value={percent} className="h-3" />
      <p className="text-xs text-muted-foreground mt-1 text-center">{percent}% concluído</p>
    </div>
  );
}
