import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { verifyLoginCode, sendLoginCode } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import ecwaLogo from "@/assets/ecwa-logo.png";

const LoginVerify = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useAuth();
  const email = location.state?.email || "";

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    
    try {
      await verifyLoginCode(email, code);
      await checkAuth();
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Wrong Code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await sendLoginCode(email);
      toast.success("Code resent! Check your email.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    navigate("/login-email");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 animate-fade-in">
        <img src={ecwaLogo} alt="ECWA Logo" className="h-20 w-20" />
      </div>

      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            Enter the code sent to<br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-14 text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="h-12 w-full text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Login"
              )}
            </Button>

            <div className="text-center">
              <Button 
                type="button"
                variant="link"
                className="text-sm"
                onClick={handleResendCode}
                disabled={isResending}
              >
                {isResending ? "Resending..." : "Didn't receive code? Resend"}
              </Button>
            </div>

            <Button 
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/login-email")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Use Different Email
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginVerify;
