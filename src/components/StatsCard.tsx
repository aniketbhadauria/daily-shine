import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-card card-elevated animate-fade-in",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={cn(
              "text-xs font-medium",
              trend === "up" && "text-success",
              trend === "down" && "text-destructive",
              trend === "neutral" && "text-muted-foreground"
            )}
          >
            {trend === "up" && "↑ "}
            {trend === "down" && "↓ "}
            {trend === "up" ? "+5%" : trend === "down" ? "-2%" : "No change"}
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
};
