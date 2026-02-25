import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const deadline = new Date();
      deadline.setHours(21, 0, 0, 0);

      if (now >= deadline) {
        setTimeLeft("Encerrado!");
        setIsExpired(true);
        return;
      }

      const diff = deadline.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
      setIsExpired(false);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-bold text-lg ${isExpired ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"}`}>
      <Clock className="w-5 h-5" />
      <span className="font-mono">{timeLeft}</span>
      <span className="text-sm font-normal opacity-70">até 21h</span>
    </div>
  );
}
