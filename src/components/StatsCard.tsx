import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: number;
  highlight?: boolean;
}

const StatsCard = ({ title, value, subtitle, trend, highlight }: StatsCardProps) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card
      className={cn(
        "p-6 transition-all duration-300 hover:scale-105",
        highlight && "border-primary glow-border"
      )}
    >
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-baseline justify-between">
          <h3
            className={cn(
              "text-3xl font-bold",
              highlight && "text-primary glow-text"
            )}
          >
            {value}
          </h3>
          {trend !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive && "text-primary",
                isNegative && "text-destructive"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </Card>
  );
};

export default StatsCard;
