import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Music, HelpCircle, Menu } from "lucide-react";

type TabConfig = {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs: TabConfig[] = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/manuals", icon: FileText, label: "Manuals" },
    { path: "/hymns", icon: Music, label: "Hymns" },
    { path: "/quiz", icon: HelpCircle, label: "Quiz" },
    { path: "/menu", icon: Menu, label: "More" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-card z-50">
      <div className="flex justify-around items-center h-16 max-w-4xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.path}
              className="flex-1 h-full flex flex-col items-center justify-center"
              onClick={() => navigate(tab.path)}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-xs mt-1 font-medium ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
