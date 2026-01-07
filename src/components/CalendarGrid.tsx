import { cn } from "@/lib/utils";
import { Check, X, Clock, Minus } from "lucide-react";

type DayStatus = "completed" | "missed" | "scheduled" | "skipped" | "off";

interface CalendarDay {
  date: number;
  status: DayStatus;
  isToday?: boolean;
}

interface CalendarGridProps {
  month: string;
  year: number;
  days: CalendarDay[];
  onDayClick?: (date: number) => void;
}

const statusStyles = {
  completed: "bg-primary text-primary-foreground",
  missed: "bg-destructive/15 text-destructive border-destructive/30",
  scheduled: "bg-secondary text-foreground",
  skipped: "bg-warning/15 text-warning border-warning/30",
  off: "bg-transparent text-muted-foreground/50",
};

const StatusIcon = ({ status }: { status: DayStatus }) => {
  switch (status) {
    case "completed":
      return <Check className="h-3 w-3" />;
    case "missed":
      return <X className="h-3 w-3" />;
    case "scheduled":
      return <Clock className="h-3 w-3" />;
    case "skipped":
      return <Minus className="h-3 w-3" />;
    default:
      return null;
  }
};

export const CalendarGrid = ({
  month,
  year,
  days,
  onDayClick,
}: CalendarGridProps) => {
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="bg-card rounded-2xl p-4 card-elevated">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">
          {month} {year}
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-primary" />
            Done
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-destructive/40" />
            Missed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => day.status !== "off" && onDayClick?.(day.date)}
            disabled={day.status === "off"}
            className={cn(
              "relative h-10 flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all",
              statusStyles[day.status],
              day.isToday && "ring-2 ring-accent ring-offset-2",
              day.status !== "off" && "hover:scale-105 cursor-pointer"
            )}
          >
            <span>{day.date}</span>
            {day.status !== "off" && day.status !== "scheduled" && (
              <span className="absolute -bottom-0.5">
                <StatusIcon status={day.status} />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
