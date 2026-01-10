import { useState, useRef } from "react";
import { Camera, Check, RotateCcw, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WashCompletionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    beforePhotoUrl?: string;
    afterPhotoUrl?: string;
    gpsLatitude?: number;
    gpsLongitude?: number;
    gpsVerified?: boolean;
  }) => void;
  customerName: string;
  carInfo: string;
  jobId?: string;
  targetLatitude?: number;
  targetLongitude?: number;
}

export const WashCompletionSheet = ({
  isOpen,
  onClose,
  onComplete,
  customerName,
  carInfo,
  jobId,
  targetLatitude,
  targetLongitude,
}: WashCompletionSheetProps) => {
  const [step, setStep] = useState<"before" | "after" | "confirm">("before");
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [beforePhotoFile, setBeforePhotoFile] = useState<File | null>(null);
  const [afterPhotoFile, setAfterPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentPhotoType = useRef<"before" | "after">("before");

  const { getCurrentPosition, verifyLocation, loading: gpsLoading, error: gpsError } = useGeolocation();

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (currentPhotoType.current === "before") {
          setBeforePhoto(result);
          setBeforePhotoFile(file);
          setStep("after");
        } else {
          setAfterPhoto(result);
          setAfterPhotoFile(file);
          setStep("confirm");
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const openCamera = (type: "before" | "after") => {
    currentPhotoType.current = type;
    fileInputRef.current?.click();
  };

  const uploadPhoto = async (file: File, type: "before" | "after"): Promise<string | null> => {
    const fileName = `${jobId || "demo"}_${type}_${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from("wash-photos")
      .upload(fileName, file, { contentType: "image/jpeg" });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("wash-photos")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleComplete = async () => {
    setUploading(true);

    try {
      // Get GPS location
      const position = await getCurrentPosition();
      let gpsVerified = false;

      if (position && targetLatitude && targetLongitude) {
        gpsVerified = await verifyLocation(targetLatitude, targetLongitude, 100);
      }

      // Upload photos if we have real files
      let beforePhotoUrl: string | undefined;
      let afterPhotoUrl: string | undefined;

      if (beforePhotoFile) {
        beforePhotoUrl = (await uploadPhoto(beforePhotoFile, "before")) || undefined;
      }

      if (afterPhotoFile) {
        afterPhotoUrl = (await uploadPhoto(afterPhotoFile, "after")) || undefined;
      }

      onComplete({
        beforePhotoUrl,
        afterPhotoUrl,
        gpsLatitude: position?.latitude,
        gpsLongitude: position?.longitude,
        gpsVerified,
      });

      if (gpsVerified) {
        toast.success("Location verified! Wash marked complete.");
      } else if (position) {
        toast.info("Wash completed. Location could not be verified.");
      }

      resetState();
    } catch (error) {
      console.error("Error completing wash:", error);
      toast.error("Failed to complete wash");
    } finally {
      setUploading(false);
    }
  };

  const handleSkipPhotos = () => {
    onComplete({});
    resetState();
  };

  const resetState = () => {
    setStep("before");
    setBeforePhoto(null);
    setAfterPhoto(null);
    setBeforePhotoFile(null);
    setAfterPhotoFile(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50" onClick={handleClose} />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl animate-slide-up max-h-[90vh] overflow-auto">
        <div className="p-6 pb-8 bottom-nav-safe">
          {/* Handle */}
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6" />

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">Mark as Completed</h2>
            <p className="text-muted-foreground mt-1">
              {customerName} • {carInfo}
            </p>
          </div>

          {/* GPS Status */}
          <div className="flex items-center justify-center gap-2 mb-4 p-2 rounded-lg bg-secondary">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {gpsLoading ? "Getting location..." : gpsError || "GPS will verify your location"}
            </span>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Step: Before Photo */}
          {step === "before" && (
            <div className="space-y-4">
              <div
                onClick={() => openCamera("before")}
                className="aspect-video rounded-2xl bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 transition-colors"
              >
                <Camera className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="font-medium">Take BEFORE photo</p>
                <p className="text-sm text-muted-foreground">Optional but recommended</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => setStep("after")}>
                  Skip
                </Button>
              </div>
            </div>
          )}

          {/* Step: After Photo */}
          {step === "after" && (
            <div className="space-y-4">
              {beforePhoto && (
                <div className="relative">
                  <img
                    src={beforePhoto}
                    alt="Before"
                    className="w-full aspect-video object-cover rounded-xl opacity-50"
                  />
                  <span className="absolute top-2 left-2 px-2 py-1 bg-foreground/80 text-background text-xs font-medium rounded-lg">
                    Before ✓
                  </span>
                </div>
              )}

              <div
                onClick={() => openCamera("after")}
                className="aspect-video rounded-2xl bg-secondary border-2 border-dashed border-accent/50 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors"
              >
                <Camera className="h-12 w-12 text-accent mb-3" />
                <p className="font-medium">Take AFTER photo</p>
                <p className="text-sm text-muted-foreground">Show the clean car</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep("before")}>
                  Back
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => setStep("confirm")}>
                  Skip
                </Button>
              </div>
            </div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {beforePhoto ? (
                  <div className="relative">
                    <img
                      src={beforePhoto}
                      alt="Before"
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-foreground/80 text-background text-xs font-medium rounded">
                      Before
                    </span>
                    <button
                      onClick={() => {
                        setBeforePhoto(null);
                        setBeforePhotoFile(null);
                        setStep("before");
                      }}
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-foreground/80 flex items-center justify-center"
                    >
                      <RotateCcw className="h-3 w-3 text-background" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setStep("before")}
                    className="aspect-square rounded-xl bg-secondary flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Add before</span>
                  </div>
                )}

                {afterPhoto ? (
                  <div className="relative">
                    <img
                      src={afterPhoto}
                      alt="After"
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-foreground/80 text-background text-xs font-medium rounded">
                      After
                    </span>
                    <button
                      onClick={() => {
                        setAfterPhoto(null);
                        setAfterPhotoFile(null);
                        setStep("after");
                      }}
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-foreground/80 flex items-center justify-center"
                    >
                      <RotateCcw className="h-3 w-3 text-background" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => openCamera("after")}
                    className="aspect-square rounded-xl bg-secondary flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Add after</span>
                  </div>
                )}
              </div>

              <Button
                size="xl"
                className="w-full"
                onClick={handleComplete}
                disabled={uploading || gpsLoading}
              >
                {uploading || gpsLoading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Check className="h-5 w-5 mr-2" />
                )}
                {uploading ? "Uploading..." : gpsLoading ? "Getting location..." : "Mark Completed"}
              </Button>

              <Button variant="ghost" className="w-full" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
