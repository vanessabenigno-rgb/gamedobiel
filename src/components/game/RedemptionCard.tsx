import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useApproveRedemption } from "@/hooks/useRewards";

interface RedemptionCardProps {
  id: string;
  rewardName: string;
  pointsSpent: number;
  date: string;
}

export function RedemptionCard({ id, rewardName, pointsSpent, date }: RedemptionCardProps) {
  const approve = useApproveRedemption();

  return (
    <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl border-l-4 border-l-primary">
      <span className="text-xl">🎁</span>
      <div className="flex-1">
        <p className="font-bold text-sm">{rewardName}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(date).toLocaleDateString("pt-BR")} • {pointsSpent} pts
        </p>
      </div>
      <Button
        size="sm"
        onClick={() => approve.mutate({ redemptionId: id, pointsSpent })}
        disabled={approve.isPending}
        className="gradient-success text-accent-foreground rounded-xl font-bold"
      >
        <Check className="w-4 h-4 mr-1" /> Aprovar
      </Button>
    </div>
  );
}
