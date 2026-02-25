import { getLevel, getLevelProgress, getRandomPhrase } from "@/lib/game-constants";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { AVATARS } from "@/lib/game-constants";
import { useUpdateAvatar } from "@/hooks/useGameData";

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
    <div className="gradient-primary rounded-2xl p-5 text-primary-foreground shadow-lg animate-slide-up">
      {/* Motivational phrase */}
      <p className="text-sm font-semibold opacity-90 mb-3 text-center">{phrase}</p>

      <div className="flex items-center gap-4">
        {/* Avatar */}
        <button
          onClick={() => setShowAvatars(!showAvatars)}
          className="text-5xl bg-primary-foreground/20 rounded-2xl w-20 h-20 flex items-center justify-center hover:scale-105 transition-transform border-2 border-primary-foreground/30"
        >
          {avatar}
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{level.emoji}</span>
            <span className="font-bold text-lg">{level.name}</span>
          </div>
          <div className="text-sm opacity-90 mb-2">
            {totalPoints} pts total • {monthlyPoints} pts este mês
          </div>
          <div className="flex items-center gap-2">
            <Progress value={levelProgress} className="h-2 bg-primary-foreground/20 flex-1" />
            <span className="text-xs font-bold">{levelProgress}%</span>
          </div>
        </div>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div className="mt-3 flex items-center justify-center gap-2 bg-primary-foreground/15 rounded-xl py-2 px-4">
          <span className="text-lg">🔥</span>
          <span className="font-bold text-sm">{streak} {streak === 1 ? "dia" : "dias"} seguidos!</span>
        </div>
      )}

      {/* Avatar selector */}
      {showAvatars && (
        <div className="mt-3 grid grid-cols-6 gap-2 bg-primary-foreground/10 rounded-xl p-3">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => { updateAvatar.mutate(a); setShowAvatars(false); }}
              className={`text-2xl p-2 rounded-lg hover:bg-primary-foreground/20 transition-colors ${a === avatar ? "bg-primary-foreground/30 ring-2 ring-primary-foreground" : ""}`}
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
