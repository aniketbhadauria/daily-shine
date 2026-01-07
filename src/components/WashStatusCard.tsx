import { useState } from "react";
import { Check, X, Clock, CloudRain, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhotoProofModal } from "./PhotoProofModal";

type WashStatus = "completed" | "missed" | "scheduled" | "skipped";

interface PhotoProof {
  before?: string;
  after?: string;
}

interface WashStatusCardProps {
  date: string;
  day: string;
  status: WashStatus;
  time?: string;
  reason?: string;
  photos?: PhotoProof;
}

const statusConfig = {
  completed: {
    icon: Check,
    label: "Completed",
    dotClass: "status-dot-success",
    bgClass: "bg-success/10",
    textClass: "text-success",
  },
  missed: {
    icon: X,
    label: "Missed",
    dotClass: "bg-destructive",
    bgClass: "bg-destructive/10",
    textClass: "text-destructive",
  },
  scheduled: {
    icon: Clock,
    label: "Scheduled",
    dotClass: "status-dot-muted",
    bgClass: "bg-secondary",
    textClass: "text-muted-foreground",
  },
  skipped: {
    icon: CloudRain,
    label: "Skipped",
    dotClass: "status-dot-warning",
    bgClass: "bg-warning/10",
    textClass: "text-warning",
  },
};

export const WashStatusCard = ({
  date,
  day,
  status,
  time,
  reason,
  photos,
}: WashStatusCardProps) => {
  const [showPhotos, setShowPhotos] = useState(false);
  const config = statusConfig[status];
  const Icon = config.icon;
  const hasPhotos = photos && (photos.before || photos.after);

  return (
    <>
      <div className="flex items-center gap-4 p-4 rounded-xl bg-card card-elevated animate-fade-in">
        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-secondary">
          <span className="text-xs font-medium text-muted-foreground uppercase">
            {day}
          </span>
          <span className="text-lg font-bold text-foreground">{date}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("status-dot", config.dotClass)} />
            <span className={cn("text-sm font-medium", config.textClass)}>
              {config.label}
            </span>
          </div>
          {time && (
            <p className="text-sm text-muted-foreground mt-0.5">{time}</p>
          )}
          {reason && (
            <p className="text-xs text-muted-foreground mt-1">{reason}</p>
          )}

          {/* Photo thumbnails */}
          {hasPhotos && (
            <button
              onClick={() => setShowPhotos(true)}
              className="flex items-center gap-2 mt-2 group"
            >
              <div className="flex -space-x-2">
                {photos.after && (
                  <img
                    src={photos.after}
                    alt="After wash"
                    className="w-8 h-8 rounded-lg object-cover border-2 border-card"
                  />
                )}
                {photos.before && (
                  <img
                    src={photos.before}
                    alt="Before wash"
                    className="w-8 h-8 rounded-lg object-cover border-2 border-card"
                  />
                )}
              </div>
              <span className="text-xs font-medium text-accent group-hover:underline flex items-center gap-1">
                <Camera className="h-3 w-3" />
                View proof
              </span>
            </button>
          )}
        </div>

        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
            config.bgClass
          )}
        >
          <Icon className={cn("h-5 w-5", config.textClass)} />
        </div>
      </div>

      {hasPhotos && (
        <PhotoProofModal
          isOpen={showPhotos}
          onClose={() => setShowPhotos(false)}
          beforeImage={photos.before}
          afterImage={photos.after}
          date={`${day} ${date}`}
          time={time}
        />
      )}
    </>
  );
};
