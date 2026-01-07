import { Check, Droplets, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const SubscriptionCard = ({
  title,
  price,
  period,
  features,
  isPopular,
  isSelected,
  onSelect,
}: SubscriptionCardProps) => {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative w-full p-5 rounded-2xl border-2 text-left transition-all card-elevated",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground/30",
        isPopular && !isSelected && "border-accent/50"
      )}
    >
      {isPopular && (
        <span className="absolute -top-3 left-4 inline-flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
          <Sparkles className="h-3 w-3" />
          Popular
        </span>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-foreground">{price}</span>
            <span className="text-muted-foreground text-sm">/{period}</span>
          </div>
        </div>
        <div
          className={cn(
            "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
            isSelected
              ? "bg-primary border-primary"
              : "border-muted-foreground/40"
          )}
        >
          {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
        </div>
      </div>

      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li
            key={idx}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Droplets className="h-4 w-4 text-accent" />
            {feature}
          </li>
        ))}
      </ul>
    </button>
  );
};
