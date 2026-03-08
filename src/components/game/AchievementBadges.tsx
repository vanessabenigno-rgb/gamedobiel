import { useAchievements } from "@/hooks/useAchievements";
import { Lock, Flame, Zap, BookOpen, Medal } from "lucide-react";

const badgeIcons: Record<string, typeof Flame> = {
  streak_3: Flame,
  streak_7: Zap,
  school_week: BookOpen,
  monthly_10: Medal,
};

const badgeColors: Record<string, string> = {
  streak_3: "text-neon-yellow",
  streak_7: "text-neon-cyan",
  school_week: "text-neon-green",
  monthly_10: "text-neon-pink",
};

export function AchievementBadges() {
  const { data: achievements } = useAchievements();

  if (!achievements || achievements.length === 0) return null;

  return (
    <div>
      <h2 className="font-display font-bold text-sm tracking-wider mb-3 flex items-center gap-2">
        <Medal className="w-5 h-5 text-neon-yellow" />
        CONQUISTAS
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {achievements.map((a) => {
          const Icon = badgeIcons[a.criteria] || Medal;
          const color = badgeColors[a.criteria] || "text-neon-purple";
          return (
            <div
              key={a.id}
              className={`flex items-center gap-2 p-3 rounded-xl border ${
                a.unlocked
                  ? `border-primary/30 glass-card ${a.criteria === "streak_7" ? "neon-glow-cyan" : "neon-glow-purple"}`
                  : "bg-muted/30 border-border/50 opacity-50"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.unlocked ? "bg-muted/50" : "bg-muted/30"}`}>
                {a.unlocked ? (
                  <Icon className={`w-4 h-4 ${color}`} />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-bold text-[11px]">{a.name}</p>
                <p className="text-[9px] text-muted-foreground">{a.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
