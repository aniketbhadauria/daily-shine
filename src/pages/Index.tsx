import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { TabSwitcher } from "@/components/TabSwitcher";
import { WashStatusCard } from "@/components/WashStatusCard";
import { CarCard } from "@/components/CarCard";
import { CalendarGrid } from "@/components/CalendarGrid";
import { StatsCard } from "@/components/StatsCard";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Droplets, TrendingUp, Calendar, Settings, ChevronRight, Plus, MapPin } from "lucide-react";

const Index = () => {
  const [activeNav, setActiveNav] = useState("today");
  const [activeHomeTab, setActiveHomeTab] = useState("today");
  const [selectedPlan, setSelectedPlan] = useState("daily");

  const homeTabs = [
    { id: "today", label: "Today" },
    { id: "upcoming", label: "Upcoming" },
  ];

  const todayWashes = [
    { date: "7", day: "Tue", status: "completed" as const, time: "6:45 AM" },
    { date: "6", day: "Mon", status: "completed" as const, time: "6:52 AM" },
    { date: "5", day: "Sun", status: "skipped" as const, reason: "Rain detected" },
    { date: "4", day: "Sat", status: "completed" as const, time: "7:10 AM" },
  ];

  const upcomingWashes = [
    { date: "8", day: "Wed", status: "scheduled" as const, time: "6:30 - 7:30 AM" },
    { date: "9", day: "Thu", status: "scheduled" as const, time: "6:30 - 7:30 AM" },
    { date: "10", day: "Fri", status: "scheduled" as const, time: "6:30 - 7:30 AM" },
  ];

  const calendarDays = [
    { date: 1, status: "completed" as const },
    { date: 2, status: "completed" as const },
    { date: 3, status: "completed" as const },
    { date: 4, status: "completed" as const },
    { date: 5, status: "skipped" as const },
    { date: 6, status: "completed" as const },
    { date: 7, status: "completed" as const, isToday: true },
    { date: 8, status: "scheduled" as const },
    { date: 9, status: "scheduled" as const },
    { date: 10, status: "scheduled" as const },
    { date: 11, status: "scheduled" as const },
    { date: 12, status: "off" as const },
    { date: 13, status: "scheduled" as const },
    { date: 14, status: "scheduled" as const },
    { date: 15, status: "scheduled" as const },
    { date: 16, status: "scheduled" as const },
    { date: 17, status: "scheduled" as const },
    { date: 18, status: "scheduled" as const },
    { date: 19, status: "off" as const },
    { date: 20, status: "scheduled" as const },
    { date: 21, status: "scheduled" as const },
  ];

  const subscriptionPlans = [
    {
      id: "daily",
      title: "Daily Wash",
      price: "₹799",
      period: "month",
      features: ["Mon-Sat exterior wash", "6:30 AM wash window", "Photo proof", "Rain skip protection"],
      isPopular: true,
    },
    {
      id: "weekly",
      title: "Weekly Wash",
      price: "₹399",
      period: "month",
      features: ["3 washes per week", "Choose your days", "Photo proof", "Flexible scheduling"],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto px-4">
        {activeNav === "today" && (
          <>
            <Header 
              title="DailyDrop" 
              subtitle="Kolar Road, Bhopal" 
              notificationCount={2}
            />

            <div className="flex items-center justify-center mb-6">
              <TabSwitcher
                tabs={homeTabs}
                activeTab={activeHomeTab}
                onChange={setActiveHomeTab}
              />
            </div>

            {activeHomeTab === "today" ? (
              <div className="space-y-6 animate-fade-in">
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Your Car</h2>
                    <Button variant="ghost" size="sm" className="text-accent">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Car
                    </Button>
                  </div>
                  <CarCard
                    model="Maruti Swift"
                    number="MP 04 AB 1234"
                    location="Block B, Basement"
                    washTime="6:30 - 7:30 AM"
                    plan="Daily"
                    nextWash="Tomorrow, 6:30 AM"
                  />
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">Recent Washes</h2>
                  <div className="space-y-3">
                    {todayWashes.map((wash, idx) => (
                      <WashStatusCard key={idx} {...wash} />
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">This Month</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <StatsCard
                      title="Washes Done"
                      value="6"
                      subtitle="out of 7 scheduled"
                      icon={Droplets}
                      trend="up"
                    />
                    <StatsCard
                      title="Reliability"
                      value="98%"
                      subtitle="on-time delivery"
                      icon={TrendingUp}
                    />
                  </div>
                </section>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-lg font-semibold">Scheduled Washes</h2>
                {upcomingWashes.map((wash, idx) => (
                  <WashStatusCard key={idx} {...wash} />
                ))}
              </div>
            )}
          </>
        )}

        {activeNav === "calendar" && (
          <>
            <Header title="Calendar" showNotification={false} />
            <div className="space-y-6 animate-fade-in">
              <CalendarGrid
                month="January"
                year={2026}
                days={calendarDays}
              />

              <section>
                <h2 className="text-lg font-semibold mb-3">Summary</h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-primary text-primary-foreground text-center">
                    <p className="text-2xl font-bold">6</p>
                    <p className="text-xs opacity-80">Completed</p>
                  </div>
                  <div className="p-3 rounded-xl bg-warning/15 text-warning text-center">
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-xs">Skipped</p>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary text-foreground text-center">
                    <p className="text-2xl font-bold">14</p>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}

        {activeNav === "alerts" && (
          <>
            <Header title="Notifications" showNotification={false} />
            <div className="space-y-3 animate-fade-in">
              <div className="p-4 rounded-xl bg-card card-elevated border-l-4 border-success">
                <p className="font-medium">Wash completed</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your Swift was washed at 6:45 AM today
                </p>
                <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
              </div>
              <div className="p-4 rounded-xl bg-card card-elevated border-l-4 border-accent">
                <p className="font-medium">Subscription renewing soon</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your Daily Wash plan renews on Jan 15
                </p>
                <p className="text-xs text-muted-foreground mt-2">Yesterday</p>
              </div>
              <div className="p-4 rounded-xl bg-card card-elevated border-l-4 border-warning">
                <p className="font-medium">Wash skipped</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Jan 5 wash was skipped due to rain
                </p>
                <p className="text-xs text-muted-foreground mt-2">2 days ago</p>
              </div>
            </div>
          </>
        )}

        {activeNav === "account" && (
          <>
            <Header title="Account" showNotification={false} />
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card card-elevated">
                <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-accent">RA</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Rahul Agarwal</h3>
                  <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <section>
                <h2 className="text-lg font-semibold mb-3">Change Plan</h2>
                <div className="space-y-3">
                  {subscriptionPlans.map((plan) => (
                    <SubscriptionCard
                      key={plan.id}
                      {...plan}
                      isSelected={selectedPlan === plan.id}
                      onSelect={() => setSelectedPlan(plan.id)}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { icon: MapPin, label: "Update parking location" },
                    { icon: Calendar, label: "Pause subscription" },
                    { icon: Settings, label: "Wash preferences" },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-card card-elevated hover:bg-secondary transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </div>

      <BottomNav activeTab={activeNav} onTabChange={setActiveNav} />
    </div>
  );
};

export default Index;
