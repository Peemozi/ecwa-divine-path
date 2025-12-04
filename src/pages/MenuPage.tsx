import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  Info,
  LogOut,
  ChevronRight,
  History
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import ecwaLogo from "@/assets/ecwa-logo.png";

const MenuPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const userEmail = user?.email || localStorage.getItem("userEmail") || "Guest";

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
    });
    navigate("/auth");
  };

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      action: () => navigate("/profile"),
    },
    {
      icon: History,
      label: "Quiz History",
      action: () => navigate("/quiz-history"),
    },
    {
      icon: CreditCard,
      label: "Payment History",
      action: () => toast({ title: "Coming soon" }),
    },
    {
      icon: Settings,
      label: "Settings",
      action: () => toast({ title: "Coming soon" }),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      action: () => toast({ title: "Coming soon" }),
    },
    {
      icon: Info,
      label: "About",
      action: () => toast({ title: "Coming soon" }),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b bg-card px-4 py-6">
        <div className="mx-auto max-w-4xl flex items-center gap-4">
          <img src={ecwaLogo} alt="ECWA" className="h-16 w-16" />
          <div>
            <h1 className="text-xl font-bold text-foreground">ECWA Divine Path</h1>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index}>
                  <button
                    onClick={item.action}
                    className="w-full flex items-center gap-4 p-4 hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="flex-1 text-left font-medium text-foreground">
                      {item.label}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                  {index < menuItems.length - 1 && (
                    <div className="mx-4 border-t border-border" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Log Out
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default MenuPage;
