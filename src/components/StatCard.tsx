import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, className }: StatCardProps) => {
  return (
    <div className={cn("stat-card-3d group", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight gradient-text">{value}</h3>
          {trend && (
            <p className={cn(
              "text-xs mt-2 font-medium flex items-center gap-1",
              trend.isPositive ? "text-chart-4" : "text-destructive"
            )}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              <span className="text-muted-foreground">vs last month</span>
            </p>
          )}
        </div>
        <div className="rounded-xl bg-gradient-to-br from-primary to-secondary p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
};
