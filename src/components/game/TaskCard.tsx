import { Button } from "@/components/ui/button";
import { Check, Clock, CircleDot, Droplets, BookOpen, Bed, Sparkles, UtensilsCrossed, GlassWater, Bath, Brush } from "lucide-react";
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
    bg: "bg-card border-border hover:border-primary/30",
    icon: CircleDot,
    iconColor: "text-muted-foreground",
    label: "Pendente",
    dot: "bg-muted-foreground",
  },
  waiting: {
    bg: "bg-card border-game-warning/20",
    icon: Clock,
    iconColor: "text-game-warning",
    label: "Aguardando",
    dot: "bg-game-warning",
  },
  approved: {
    bg: "bg-primary/5 border-primary/20",
    icon: Check,
    iconColor: "text-primary",
    label: "Aprovado",
    dot: "bg-primary",
  },
};

const emojiToIcon: Record<string, typeof Droplets> = {
  "🚿": Droplets,
  "🛁": Bath,
  "🪥": Brush,
  "🛏️": Bed,
  "📚": BookOpen,
  "🍽️": UtensilsCrossed,
  "🗄️": UtensilsCrossed,
  "🧴": GlassWater,
};

export function TaskCard({ id, name, emoji, points, status }: TaskCardProps) {
  const completeTask = useCompleteTask();
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = config.icon;
  const TaskIcon = emojiToIcon[emoji] || Sparkles;

  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${config.bg} animate-slide-up`}>
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <TaskIcon className="w-4 h-4 text-foreground/70" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          <span className="text-[11px] text-muted-foreground">{config.label}</span>
          <span className="text-[11px] font-semibold text-primary ml-auto">+{points} XP</span>
        </div>
      </div>
      {status === "pending" && (
        <Button
          size="sm"
          onClick={() => completeTask.mutate(id)}
          disabled={completeTask.isPending}
          className="gradient-primary text-primary-foreground font-semibold text-xs rounded-lg px-3 h-8"
        >
          Concluí!
        </Button>
      )}
    </div>
  );
}
