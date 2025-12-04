import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, UserPlus } from "lucide-react";
import ecwaLogo from "@/assets/ecwa-logo.png";

const AuthOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 animate-fade-in">
        <img src={ecwaLogo} alt="ECWA Logo" className="h-24 w-24" />
      </div>

      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>
            Choose how you'd like to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="default"
            className="h-14 w-full justify-start gap-3 text-base"
            onClick={() => navigate("/login")}
          >
            <Lock className="h-5 w-5" />
            Login with Email & Password
          </Button>

          <Button 
            variant="outline"
            className="h-14 w-full justify-start gap-3 text-base"
            onClick={() => navigate("/login-email")}
          >
            <Mail className="h-5 w-5" />
            Login with Email Only
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                New here?
              </span>
            </div>
          </div>

          <Button 
            variant="secondary"
            className="h-14 w-full justify-start gap-3 text-base"
            onClick={() => navigate("/register")}
          >
            <UserPlus className="h-5 w-5" />
            Create Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthOptions;
