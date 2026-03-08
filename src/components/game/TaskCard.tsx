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
    bg: "border-l-neon-pink bg-neon-pink/5",
    icon: CircleDot,
    iconColor: "text-neon-pink",
    label: "PENDENTE",
    glow: "neon-glow-pink",
  },
  waiting: {
    bg: "border-l-neon-yellow bg-neon-yellow/5",
    icon: Clock,
    iconColor: "text-neon-yellow",
    label: "AGUARDANDO",
    glow: "",
  },
  approved: {
    bg: "border-l-neon-green bg-neon-green/5",
    icon: Check,
    iconColor: "text-neon-green",
    label: "APROVADO",
    glow: "neon-glow-green",
  },
};

// Map emoji to Lucide icons
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
    <div className={`flex items-center gap-3 p-4 rounded-xl border-l-4 border border-border/50 ${config.bg} ${config.glow} animate-slide-up`}>
      <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
        <TaskIcon className={`w-5 h-5 ${config.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate">{name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <StatusIcon className={`w-3 h-3 ${config.iconColor}`} />
          <span className={`text-[10px] font-display font-bold tracking-wider ${config.iconColor}`}>{config.label}</span>
          <span className="text-[10px] text-neon-purple font-display font-bold ml-auto">+{points} XP</span>
        </div>
      </div>
      {status === "pending" && (
        <Button
          size="sm"
          onClick={() => completeTask.mutate(id)}
          disabled={completeTask.isPending}
          className="gradient-primary text-primary-foreground font-display font-bold text-[10px] tracking-wider rounded-xl px-4 shadow-md neon-glow-purple"
        >
          CONCLUÍ!
        </Button>
      )}
    </div>
  );
}
