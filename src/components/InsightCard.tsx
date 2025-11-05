import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon?: React.ReactNode;
  compact?: boolean;
}

const InsightCard = ({ title, value, subtitle, icon, compact }: InsightCardProps) => {
  return (
    <Card
      className={cn(
        "p-6 transition-all duration-300 hover:scale-105 border-primary/20",
        compact && "p-4"
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
        <h3 className="text-2xl font-bold text-primary glow-text">{value}</h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {subtitle}
        </p>
      </div>
    </Card>
  );
};

export default InsightCard;
