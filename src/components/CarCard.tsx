import { Car, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarCardProps {
  model: string;
  number: string;
  location: string;
  washTime: string;
  plan: string;
  nextWash: string;
  isActive?: boolean;
}

export const CarCard = ({
  model,
  number,
  location,
  washTime,
  plan,
  nextWash,
  isActive = true,
}: CarCardProps) => {
  return (
    <div
      className={cn(
        "p-5 rounded-2xl border bg-card card-elevated transition-all",
        isActive ? "border-border" : "border-dashed border-muted-foreground/30 opacity-60"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center">
          <Car className="h-7 w-7 text-foreground" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{model}</h3>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/10 text-accent">
              {plan}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{number}</p>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {location}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {washTime}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Next wash</p>
          <p className="text-sm font-medium text-foreground">{nextWash}</p>
        </div>
        {isActive && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-success">
            <span className="status-dot status-dot-success animate-pulse-soft" />
            Active
          </span>
        )}
      </div>
    </div>
  );
};
