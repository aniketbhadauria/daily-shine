import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  beforeImage?: string;
  afterImage?: string;
  date: string;
  time?: string;
}

export const PhotoProofModal = ({
  isOpen,
  onClose,
  beforeImage,
  afterImage,
  date,
  time,
}: PhotoProofModalProps) => {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");

  if (!isOpen) return null;

  const currentImage = activeTab === "before" ? beforeImage : afterImage;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/95 animate-fade-in">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-muted-foreground">Photo Proof</p>
            <p className="font-semibold text-primary-foreground">
              {date} {time && `• ${time}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center hover:bg-secondary/30 transition-colors"
          >
            <X className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 flex items-center justify-center p-4 relative">
          {currentImage ? (
            <img
              src={currentImage}
              alt={`${activeTab} wash`}
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No {activeTab} photo available</p>
            </div>
          )}

          {/* Navigation arrows */}
          {beforeImage && afterImage && (
            <>
              <button
                onClick={() => setActiveTab(activeTab === "before" ? "after" : "before")}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center hover:bg-secondary/30 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-primary-foreground" />
              </button>
              <button
                onClick={() => setActiveTab(activeTab === "before" ? "after" : "before")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center hover:bg-secondary/30 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-primary-foreground" />
              </button>
            </>
          )}
        </div>

        {/* Tab switcher */}
        {beforeImage && afterImage && (
          <div className="p-4 pb-8">
            <div className="flex items-center justify-center gap-2 p-1 rounded-full bg-secondary/20 max-w-xs mx-auto">
              <button
                onClick={() => setActiveTab("before")}
                className={cn(
                  "flex-1 py-2.5 rounded-full text-sm font-medium transition-all",
                  activeTab === "before"
                    ? "bg-primary-foreground text-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                )}
              >
                Before
              </button>
              <button
                onClick={() => setActiveTab("after")}
                className={cn(
                  "flex-1 py-2.5 rounded-full text-sm font-medium transition-all",
                  activeTab === "after"
                    ? "bg-primary-foreground text-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                )}
              >
                After
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
