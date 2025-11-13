import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ecwaLogo from "@/assets/ecwa-logo.png";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for auth token in localStorage
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        navigate("/dashboard");
      } else {
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary">
      <div className="animate-scale-in">
        <img 
          src={ecwaLogo} 
          alt="ECWA Logo" 
          className="h-48 w-48 animate-fade-in"
        />
      </div>
    </div>
  );
};

export default Splash;
