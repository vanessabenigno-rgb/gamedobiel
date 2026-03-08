import { useAchievements } from "@/hooks/useAchievements";
import { Lock, Flame, Zap, BookOpen, Medal } from "lucide-react";

const badgeIcons: Record<string, typeof Flame> = {
  streak_3: Flame,
  streak_7: Zap,
  school_week: BookOpen,
  monthly_10: Medal,
};

export function AchievementBadges() {
  const { data: achievements } = useAchievements();

  if (!achievements || achievements.length === 0) return null;

  return (
    <div>
      <h2 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
        <Medal className="w-4 h-4 text-game-warning" />
        Conquistas
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {achievements.map((a) => {
          const Icon = badgeIcons[a.criteria] || Medal;
          return (
            <div
              key={a.id}
              className={`flex items-center gap-2.5 p-3 rounded-xl border transition-colors ${
                a.unlocked
                  ? "bg-primary/5 border-primary/20"
                  : "bg-card border-border opacity-50"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.unlocked ? "bg-primary/10" : "bg-muted"}`}>
                {a.unlocked ? (
                  <Icon className="w-4 h-4 text-primary" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-semibold text-[11px]">{a.name}</p>
                <p className="text-[10px] text-muted-foreground">{a.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
