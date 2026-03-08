import { useState, useEffect } from "react";
import { Timer, AlertTriangle } from "lucide-react";

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const deadline = new Date();
      deadline.setHours(21, 0, 0, 0);

      if (now >= deadline) {
        setTimeLeft("ENCERRADO");
        setIsExpired(true);
        setIsUrgent(false);
        return;
      }

      const diff = deadline.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
      setIsExpired(false);
      setIsUrgent(h < 2);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative flex items-center justify-center gap-3 rounded-xl py-3 px-4 border ${
      isExpired 
        ? "border-destructive/40 bg-destructive/10 neon-glow-pink" 
        : isUrgent
        ? "border-neon-yellow/40 bg-neon-yellow/5 neon-glow-pink"
        : "border-neon-cyan/30 bg-neon-cyan/5 neon-glow-cyan"
    }`}>
      {isUrgent && !isExpired ? (
        <AlertTriangle className="w-5 h-5 text-neon-yellow animate-glow-pulse" />
      ) : (
        <Timer className={`w-5 h-5 ${isExpired ? "text-destructive" : "text-neon-cyan"}`} />
      )}
      <span className={`font-display font-bold text-xl tracking-[0.15em] ${
        isExpired ? "text-destructive" : isUrgent ? "text-neon-yellow neon-text-cyan" : "text-neon-cyan neon-text-cyan"
      }`}>
        {timeLeft}
      </span>
      <span className="text-xs font-body text-muted-foreground">até 21h</span>
    </div>
  );
}
