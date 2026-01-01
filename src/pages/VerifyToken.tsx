import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { authApi, setApiToken } from "@/lib/api";

const VerifyToken = () => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    
    try {
      const user = await authApi.verifyLoginCode(email, token);
      
      // Store the API token
      setApiToken(user.api_token);
      localStorage.setItem('userEmail', email);
      if (user.name) {
        localStorage.setItem('userName', user.name);
      }
      
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid verification code";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            Enter the verification code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Verification Code</Label>
              <Input
                id="token"
                type="text"
                placeholder="Enter 6-digit code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="h-12 text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="h-12 w-full text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify & Login"}
            </Button>

            <Button 
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/auth")}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyToken;
