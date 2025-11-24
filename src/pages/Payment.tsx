import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Payment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Initialize Paystack payment
      const handler = (window as any).PaystackPop.setup({
        key: 'pk_test_xxxxxxxxxxxx', // Replace with your Paystack public key
        email: 'user@example.com', // Replace with actual user email
        amount: 500000, // Amount in kobo (₦5,000)
        currency: 'NGN',
        ref: 'SS_' + Math.floor((Math.random() * 1000000000) + 1),
        callback: function(response: any) {
          // Payment successful
          localStorage.setItem("sundaySchoolPaid", "true");
          setIsSuccess(true);
          toast.success("Payment successful!");
          
          // Redirect to Sunday School lessons list after 2 seconds
          setTimeout(() => {
            navigate("/sunday-school");
          }, 2000);
        },
        onClose: function() {
          toast.error("Payment cancelled");
          setIsProcessing(false);
        }
      });
      
      handler.openIframe();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="mb-8 animate-scale-in">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h2 className="mb-2 text-2xl font-bold">Payment Successful!</h2>
        <p className="mb-8 text-center text-muted-foreground">
          You now have full access to all Sunday School lessons
        </p>

        <Button 
          className="h-12 w-full max-w-md"
          onClick={() => navigate("/sunday-school")}
        >
          View Sunday School Lessons
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Complete Purchase</h1>
        </div>
      </header>

      {/* Payment Form */}
      <main className="mx-auto max-w-4xl p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sunday School Full Access</span>
                <span className="font-semibold">₦5,000</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span>₦5,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the button below to proceed to secure payment
            </p>

            <Button 
              className="h-12 w-full text-base font-semibold"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay with Paystack"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Test Mode</span>
              </div>
            </div>

            <Button 
              variant="outline"
              className="h-12 w-full text-base font-semibold"
              onClick={() => {
                localStorage.setItem("sundaySchoolPaid", "true");
                setIsSuccess(true);
                toast.success("Test payment successful!");
                setTimeout(() => {
                  navigate("/sunday-school");
                }, 2000);
              }}
            >
              Skip Payment (Test Mode)
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Secure payment powered by Paystack
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Payment;
