import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { authApi, getApiToken, removeApiToken } from "@/lib/api";
import ecwaLogo from "@/assets/ecwa-logo.png";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      // Small delay for splash visual
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const apiToken = getApiToken();
      if (!apiToken) {
        navigate("/auth");
        return;
      }

      try {
        await authApi.getAuthUser();
        navigate("/dashboard");
      } catch {
        removeApiToken();
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
