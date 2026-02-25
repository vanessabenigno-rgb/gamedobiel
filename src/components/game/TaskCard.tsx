import { Button } from "@/components/ui/button";
import { Check, Clock, CircleDot } from "lucide-react";
import { useCompleteTask } from "@/hooks/useGameData";

interface TaskCardProps {
  id: string;
  name: string;
  emoji: string;
  points: number;
  status: string;
}

const statusConfig = {
  pending: {
    bg: "border-l-destructive bg-destructive/5",
    icon: CircleDot,
    iconColor: "text-destructive",
    label: "Pendente",
  },
  waiting: {
    bg: "border-l-game-warning bg-game-warning/5",
    icon: Clock,
    iconColor: "text-game-warning",
    label: "Aguardando",
  },
  approved: {
    bg: "border-l-accent bg-accent/5",
    icon: Check,
    iconColor: "text-accent",
    label: "Aprovado ✓",
  },
};

export function TaskCard({ id, name, emoji, points, status }: TaskCardProps) {
  const completeTask = useCompleteTask();
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border-l-4 ${config.bg} shadow-sm animate-slide-up`}>
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate">{name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
          <span className={`text-xs font-semibold ${config.iconColor}`}>{config.label}</span>
          <span className="text-xs text-muted-foreground ml-auto">+{points} pts</span>
        </div>
      </div>
      {status === "pending" && (
        <Button
          size="sm"
          onClick={() => completeTask.mutate(id)}
          disabled={completeTask.isPending}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl px-4 shadow-md"
        >
          Concluí! ✅
        </Button>
      )}
    </div>
  );
}
