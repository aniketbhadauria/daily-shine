import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const TabSwitcher = ({ tabs, activeTab, onChange }: TabSwitcherProps) => {
  return (
    <div className="inline-flex items-center p-1 rounded-full bg-secondary">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
