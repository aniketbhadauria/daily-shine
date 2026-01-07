import { X, Car, Ban, CloudRain, Wrench, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MissedReasonSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (reason: string) => void;
  customerName: string;
  carInfo: string;
}

const reasons = [
  {
    id: "car_not_available",
    label: "Car not available",
    description: "Car was not in the parking spot",
    icon: Car,
  },
  {
    id: "access_denied",
    label: "Access denied",
    description: "Gate closed, security issue",
    icon: Ban,
  },
  {
    id: "weather",
    label: "Bad weather",
    description: "Rain or unsafe conditions",
    icon: CloudRain,
  },
  {
    id: "mechanical",
    label: "Equipment issue",
    description: "Tools or supplies problem",
    icon: Wrench,
  },
  {
    id: "other",
    label: "Other reason",
    description: "Something else happened",
    icon: HelpCircle,
  },
];

export const MissedReasonSheet = ({
  isOpen,
  onClose,
  onSelect,
  customerName,
  carInfo,
}: MissedReasonSheetProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50" onClick={onClose} />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl animate-slide-up">
        <div className="p-6 pb-8 bottom-nav-safe">
          {/* Handle */}
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6" />

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-destructive">Mark as Missed</h2>
            <p className="text-muted-foreground mt-1">
              {customerName} • {carInfo}
            </p>
          </div>

          {/* Reason list */}
          <div className="space-y-2 mb-6">
            {reasons.map((reason) => (
              <button
                key={reason.id}
                onClick={() => onSelect(reason.label)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-destructive/50 transition-colors text-left"
              >
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <reason.icon className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{reason.label}</p>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </div>
              </button>
            ))}
          </div>

          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
