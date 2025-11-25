import { useNavigate, useLocation } from "react-router-dom";
import { Home, FileText, Music, HelpCircle, Menu } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/manuals", icon: FileText, label: "Manuals" },
    { path: "/hymns", icon: Music, label: "Hymns" },
    { path: "/quiz", icon: HelpCircle, label: "Quiz" },
    { path: "/menu", icon: Menu, label: "More" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="mx-auto max-w-4xl flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""}`} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
