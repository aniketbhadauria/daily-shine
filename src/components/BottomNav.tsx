import { Home, Calendar, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-1 flex-col items-center gap-1 py-2 transition-colors",
      isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
    )}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border bottom-nav-safe">
      <div className="flex items-center max-w-lg mx-auto">
        <NavItem
          icon={<Home className="h-5 w-5" />}
          label="Today"
          isActive={activeTab === "today"}
          onClick={() => onTabChange("today")}
        />
        <NavItem
          icon={<Calendar className="h-5 w-5" />}
          label="Calendar"
          isActive={activeTab === "calendar"}
          onClick={() => onTabChange("calendar")}
        />
        <NavItem
          icon={<Bell className="h-5 w-5" />}
          label="Alerts"
          isActive={activeTab === "alerts"}
          onClick={() => onTabChange("alerts")}
        />
        <NavItem
          icon={<User className="h-5 w-5" />}
          label="Account"
          isActive={activeTab === "account"}
          onClick={() => onTabChange("account")}
        />
      </div>
    </nav>
  );
};
