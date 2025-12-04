import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getAuthUser, isAuthenticated } from "@/services/auth";
import ecwaLogo from "@/assets/ecwa-logo.png";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      // Small delay for splash visual
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!isAuthenticated()) {
        navigate("/auth");
        return;
      }

      try {
        await getAuthUser();
        navigate("/dashboard");
      } catch {
        navigate("/auth");
      }
    };

    init();
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="animate-scale-in">
        <img 
          src={ecwaLogo} 
          alt="ECWA Logo" 
          className="h-48 w-48 animate-fade-in"
        />
      </div>
      <div className="mt-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  );
};

export default Splash;
