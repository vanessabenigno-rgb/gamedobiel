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
        setTimeLeft("Encerrado");
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
    <div className={`flex items-center justify-center gap-3 rounded-xl py-3 px-4 border ${
      isExpired 
        ? "border-destructive/30 bg-destructive/5" 
        : isUrgent
        ? "border-game-warning/30 bg-game-warning/5"
        : "border-border bg-card"
    }`}>
      {isUrgent && !isExpired ? (
        <AlertTriangle className="w-4 h-4 text-game-warning" />
      ) : (
        <Timer className={`w-4 h-4 ${isExpired ? "text-destructive" : "text-muted-foreground"}`} />
      )}
      <span className={`font-mono font-bold text-lg tracking-widest ${
        isExpired ? "text-destructive" : isUrgent ? "text-game-warning" : "text-foreground"
      }`}>
        {timeLeft}
      </span>
      <span className="text-xs text-muted-foreground">até 21h</span>
    </div>
  );
}
