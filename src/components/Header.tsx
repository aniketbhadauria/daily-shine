import { Bell, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showNotification?: boolean;
  notificationCount?: number;
}

export const Header = ({
  title,
  subtitle,
  showNotification = true,
  notificationCount = 0,
}: HeaderProps) => {
  return (
    <header className="flex items-center justify-between py-4 px-1">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
            {subtitle}
            <ChevronDown className="h-4 w-4" />
          </p>
        )}
      </div>

      {showNotification && (
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>
      )}
    </header>
  );
};
