import { getLevel, getLevelProgress, getRandomPhrase } from "@/lib/game-constants";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { AVATARS } from "@/lib/game-constants";
import { useUpdateAvatar } from "@/hooks/useGameData";
import { Zap, TrendingUp, Flame } from "lucide-react";

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
    <div className="relative rounded-2xl p-5 gradient-primary neon-glow-purple animate-slide-up overflow-hidden scanline">
      {/* Motivational phrase */}
      <p className="text-sm font-semibold text-primary-foreground/90 mb-3 text-center font-display tracking-wide uppercase text-[11px]">
        {phrase}
      </p>

      <div className="flex items-center gap-4">
        {/* Avatar */}
        <button
          onClick={() => setShowAvatars(!showAvatars)}
          className="text-4xl bg-background/20 rounded-2xl w-18 h-18 flex items-center justify-center hover:scale-105 transition-transform border border-primary-foreground/20 backdrop-blur-sm p-3"
        >
          {avatar}
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-neon-yellow" />
            <span className="font-display font-bold text-sm text-primary-foreground tracking-wide">{level.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-primary-foreground/80 mb-2">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {totalPoints} XP
            </span>
            <span className="text-primary-foreground/40">|</span>
            <span>{monthlyPoints} este mês</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={levelProgress} className="h-2 bg-background/30 flex-1" />
            <span className="text-[10px] font-display font-bold text-primary-foreground/90">{levelProgress}%</span>
          </div>
        </div>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div className="mt-3 flex items-center justify-center gap-2 bg-background/20 backdrop-blur-sm rounded-xl py-2 px-4 border border-neon-yellow/20">
          <Flame className="w-4 h-4 text-neon-yellow animate-glow-pulse" />
          <span className="font-display font-bold text-xs text-neon-yellow tracking-wide">
            {streak} {streak === 1 ? "DIA" : "DIAS"} SEGUIDOS
          </span>
        </div>
      )}

      {/* Avatar selector */}
      {showAvatars && (
        <div className="mt-3 grid grid-cols-6 gap-2 bg-background/30 backdrop-blur-sm rounded-xl p-3 border border-primary-foreground/10">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => { updateAvatar.mutate(a); setShowAvatars(false); }}
              className={`text-2xl p-2 rounded-lg hover:bg-primary-foreground/20 transition-colors ${a === avatar ? "bg-primary-foreground/30 ring-2 ring-neon-cyan" : ""}`}
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
