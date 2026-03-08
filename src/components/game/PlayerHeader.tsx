import { getLevel, getLevelProgress, getRandomPhrase } from "@/lib/game-constants";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { AVATARS } from "@/lib/game-constants";
import { useUpdateAvatar } from "@/hooks/useGameData";
import { TrendingUp, Flame } from "lucide-react";

interface PlayerHeaderProps {
  avatar: string;
  totalPoints: number;
  monthlyPoints: number;
  streak: number;
}

export function PlayerHeader({ avatar, totalPoints, monthlyPoints, streak }: PlayerHeaderProps) {
  const [showAvatars, setShowAvatars] = useState(false);
  const [phrase] = useState(getRandomPhrase);
  const level = getLevel(totalPoints);
  const levelProgress = getLevelProgress(totalPoints);
  const updateAvatar = useUpdateAvatar();

  return (
    <div className="rounded-2xl p-5 bg-card border border-border animate-slide-up">
      <p className="text-xs text-muted-foreground mb-3 text-center">{phrase}</p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowAvatars(!showAvatars)}
          className="text-4xl bg-muted rounded-xl w-16 h-16 flex items-center justify-center hover:scale-105 transition-transform"
        >
          {avatar}
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{level.emoji}</span>
            <span className="font-display font-bold text-sm">{level.name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span>{totalPoints} XP total</span>
            <span className="text-border">·</span>
            <span>{monthlyPoints} este mês</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={levelProgress} className="h-1.5 flex-1" />
            <span className="text-[10px] font-medium text-muted-foreground">{levelProgress}%</span>
          </div>
        </div>
      </div>

      {streak > 0 && (
        <div className="mt-3 flex items-center justify-center gap-2 bg-primary/10 rounded-lg py-1.5 px-3">
          <Flame className="w-3.5 h-3.5 text-game-warning" />
          <span className="font-semibold text-xs text-primary">{streak} {streak === 1 ? "dia" : "dias"} seguidos</span>
        </div>
      )}

      {showAvatars && (
        <div className="mt-3 grid grid-cols-6 gap-2 bg-muted rounded-xl p-3">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => { updateAvatar.mutate(a); setShowAvatars(false); }}
              className={`text-xl p-1.5 rounded-lg hover:bg-secondary transition-colors ${a === avatar ? "bg-secondary ring-1 ring-primary" : ""}`}
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
