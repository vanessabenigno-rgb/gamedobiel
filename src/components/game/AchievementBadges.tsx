import { useAchievements } from "@/hooks/useAchievements";
import { Lock } from "lucide-react";

export function AchievementBadges() {
  const { data: achievements } = useAchievements();

  if (!achievements || achievements.length === 0) return null;

  const badgeEmojis: Record<string, string> = {
    streak_3: "🔥",
    streak_7: "⚡",
    school_week: "📚",
    monthly_10: "🏆",
  };

  return (
    <div>
      <h2 className="font-extrabold text-lg mb-3">🏅 Minhas Conquistas</h2>
      <div className="grid grid-cols-2 gap-2">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`flex items-center gap-2 p-3 rounded-xl border ${
              a.unlocked
                ? "bg-primary/10 border-primary/30"
                : "bg-muted/50 border-border opacity-60"
            }`}
          >
            <span className="text-2xl">
              {a.unlocked ? badgeEmojis[a.criteria] || "🏅" : <Lock className="w-5 h-5 text-muted-foreground" />}
            </span>
            <div>
              <p className="font-bold text-xs">{a.name}</p>
              <p className="text-[10px] text-muted-foreground">{a.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
