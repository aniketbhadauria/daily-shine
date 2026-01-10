import { useState } from "react";
import { MapPin, Clock, Car, Phone, ChevronRight, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

type WashJobStatus = "pending" | "completed" | "missed";

interface WashJob {
  id: string;
  customerName: string;
  carModel: string;
  carNumber: string;
  location: string;
  accessNotes: string;
  phone: string;
  status: WashJobStatus;
  completedAt?: string;
  missedReason?: string;
  gpsVerified?: boolean;
  targetLatitude?: number;
  targetLongitude?: number;
}

interface RouteCardProps {
  job: WashJob;
  index: number;
  onTap: () => void;
  isActive?: boolean;
}

export const RouteCard = ({ job, index, onTap, isActive }: RouteCardProps) => {
  const isPending = job.status === "pending";
  const isCompleted = job.status === "completed";
  const isMissed = job.status === "missed";

  return (
    <button
      onClick={onTap}
      disabled={!isPending}
      className={cn(
        "w-full p-4 rounded-2xl border text-left transition-all animate-fade-in",
        isPending && "bg-card border-border card-elevated hover:border-accent/50 active:scale-[0.99]",
        isCompleted && "bg-success/5 border-success/30 opacity-70",
        isMissed && "bg-destructive/5 border-destructive/30 opacity-70",
        isActive && "ring-2 ring-accent"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* Index badge */}
        <div
          className={cn(
            "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold",
            isPending && "bg-primary text-primary-foreground",
            isCompleted && "bg-success text-success-foreground",
            isMissed && "bg-destructive text-destructive-foreground"
          )}
        >
          {isCompleted ? "✓" : isMissed ? "✗" : index + 1}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground truncate">{job.customerName}</h3>
            {isPending && <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Car className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground truncate">
              {job.carModel} • {job.carNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground truncate">{job.location}</span>
          </div>

          {job.accessNotes && isPending && (
            <p className="text-xs text-accent mt-2 bg-accent/10 rounded-lg px-2 py-1">
              📝 {job.accessNotes}
            </p>
          )}

          {isCompleted && job.completedAt && (
            <p className="text-xs text-success mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Completed at {job.completedAt}
            </p>
          )}

          {isMissed && job.missedReason && (
            <p className="text-xs text-destructive mt-2">{job.missedReason}</p>
          )}
        </div>
      </div>

      {/* Quick actions for pending */}
      {isPending && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <a
            href={`tel:${job.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            Call
          </a>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(job.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <Navigation className="h-3.5 w-3.5" />
            Navigate
          </a>
        </div>
      )}
    </button>
  );
};

export type { WashJob, WashJobStatus };
