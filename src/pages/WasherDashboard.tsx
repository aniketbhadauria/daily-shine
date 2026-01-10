import { useState } from "react";
import { ArrowLeft, Check, X, Car, MapPin, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RouteCard, WashJob } from "@/components/RouteCard";
import { WashCompletionSheet } from "@/components/WashCompletionSheet";
import { MissedReasonSheet } from "@/components/MissedReasonSheet";
import { StatsCard } from "@/components/StatsCard";
import { Link } from "react-router-dom";

const initialJobs: WashJob[] = [
  {
    id: "1",
    customerName: "Rahul Agarwal",
    carModel: "Maruti Swift",
    carNumber: "MP 04 AB 1234",
    location: "Ashoka Garden, Block B, Basement",
    accessNotes: "Watchman opens gate at 6 AM",
    phone: "+919876543210",
    status: "pending",
  },
  {
    id: "2",
    customerName: "Priya Sharma",
    carModel: "Hyundai i20",
    carNumber: "MP 04 CD 5678",
    location: "Kolar Heights, Tower 2, Ground",
    accessNotes: "",
    phone: "+919876543211",
    status: "pending",
  },
  {
    id: "3",
    customerName: "Amit Verma",
    carModel: "Honda City",
    carNumber: "MP 04 EF 9012",
    location: "Green Valley Apartments, Open Parking",
    accessNotes: "Car usually near entrance gate",
    phone: "+919876543212",
    status: "pending",
  },
  {
    id: "4",
    customerName: "Neha Gupta",
    carModel: "Tata Nexon",
    carNumber: "MP 04 GH 3456",
    location: "Sunshine Residency, Slot 45",
    accessNotes: "",
    phone: "+919876543213",
    status: "pending",
  },
  {
    id: "5",
    customerName: "Vikram Singh",
    carModel: "Maruti Baleno",
    carNumber: "MP 04 IJ 7890",
    location: "Royal Enclave, Block A",
    accessNotes: "Please avoid splashing water on the wall",
    phone: "+919876543214",
    status: "pending",
  },
];

const WasherDashboard = () => {
  const [jobs, setJobs] = useState<WashJob[]>(initialJobs);
  const [selectedJob, setSelectedJob] = useState<WashJob | null>(null);
  const [showCompletionSheet, setShowCompletionSheet] = useState(false);
  const [showMissedSheet, setShowMissedSheet] = useState(false);

  const pendingJobs = jobs.filter((j) => j.status === "pending");
  const completedJobs = jobs.filter((j) => j.status === "completed");
  const missedJobs = jobs.filter((j) => j.status === "missed");

  const handleJobTap = (job: WashJob) => {
    setSelectedJob(job);
    setShowCompletionSheet(true);
  };

  const handleComplete = (data: {
    beforePhotoUrl?: string;
    afterPhotoUrl?: string;
    gpsLatitude?: number;
    gpsLongitude?: number;
    gpsVerified?: boolean;
  }) => {
    if (!selectedJob) return;

    setJobs((prev) =>
      prev.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              status: "completed" as const,
              completedAt: new Date().toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              gpsVerified: data.gpsVerified,
            }
          : job
      )
    );

    setShowCompletionSheet(false);
    setSelectedJob(null);
  };

  const handleShowMissed = () => {
    setShowCompletionSheet(false);
    setTimeout(() => setShowMissedSheet(true), 100);
  };

  const handleMissed = (reason: string) => {
    if (!selectedJob) return;

    setJobs((prev) =>
      prev.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              status: "missed" as const,
              missedReason: reason,
            }
          : job
      )
    );

    setShowMissedSheet(false);
    setSelectedJob(null);
  };

  const progress = Math.round(
    ((completedJobs.length + missedJobs.length) / jobs.length) * 100
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon-sm">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Today's Route</h1>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{progress}%</p>
            <p className="text-xs text-muted-foreground">complete</p>
          </div>
        </header>

        {/* Progress bar */}
        <div className="h-2 bg-secondary rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-success transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-secondary text-center">
            <p className="text-2xl font-bold text-foreground">{pendingJobs.length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="p-3 rounded-xl bg-success/10 text-center">
            <p className="text-2xl font-bold text-success">{completedJobs.length}</p>
            <p className="text-xs text-success">Done</p>
          </div>
          <div className="p-3 rounded-xl bg-destructive/10 text-center">
            <p className="text-2xl font-bold text-destructive">{missedJobs.length}</p>
            <p className="text-xs text-destructive">Missed</p>
          </div>
        </div>

        {/* Route list */}
        <div className="space-y-3">
          {pendingJobs.length > 0 && (
            <>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Up Next
              </h2>
              {pendingJobs.map((job, idx) => (
                <RouteCard
                  key={job.id}
                  job={job}
                  index={idx}
                  onTap={() => handleJobTap(job)}
                  isActive={idx === 0}
                />
              ))}
            </>
          )}

          {completedJobs.length > 0 && (
            <>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mt-6">
                Completed
              </h2>
              {completedJobs.map((job, idx) => (
                <RouteCard
                  key={job.id}
                  job={job}
                  index={idx}
                  onTap={() => {}}
                />
              ))}
            </>
          )}

          {missedJobs.length > 0 && (
            <>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mt-6">
                Missed
              </h2>
              {missedJobs.map((job, idx) => (
                <RouteCard
                  key={job.id}
                  job={job}
                  index={idx}
                  onTap={() => {}}
                />
              ))}
            </>
          )}

          {pendingJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold">Route Complete!</h3>
              <p className="text-muted-foreground mt-1">
                {completedJobs.length} washes done today
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Completion Sheet */}
      {selectedJob && (
        <>
          <WashCompletionSheet
            isOpen={showCompletionSheet}
            onClose={() => {
              setShowCompletionSheet(false);
              setSelectedJob(null);
            }}
            onComplete={handleComplete}
            customerName={selectedJob.customerName}
            carInfo={`${selectedJob.carModel} • ${selectedJob.carNumber}`}
          />

          {/* Missed button overlay */}
          {showCompletionSheet && (
            <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 pb-8">
              <Button
                variant="outline"
                className="w-full max-w-lg mx-auto border-destructive text-destructive hover:bg-destructive/10"
                onClick={handleShowMissed}
              >
                <X className="h-4 w-4 mr-2" />
                Can't complete this wash
              </Button>
            </div>
          )}

          <MissedReasonSheet
            isOpen={showMissedSheet}
            onClose={() => {
              setShowMissedSheet(false);
              setSelectedJob(null);
            }}
            onSelect={handleMissed}
            customerName={selectedJob.customerName}
            carInfo={`${selectedJob.carModel} • ${selectedJob.carNumber}`}
          />
        </>
      )}
    </div>
  );
};

export default WasherDashboard;
