import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock } from "lucide-react";

const mockManuals = [
  { id: 1, title: "Teacher's Manual - Q1", language: "EN", price: "₦2,500", isPaid: false },
  { id: 2, title: "Student's Manual - Q1", language: "EN", price: "₦1,500", isPaid: false },
  { id: 3, title: "Iwe Olukọ - Q1", language: "YO", price: "₦2,500", isPaid: false },
];

const Manuals = () => {
  const [hasPurchased] = useState(false);
  const navigate = useNavigate();

  if (!hasPurchased) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
          <div className="mx-auto flex max-w-4xl items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Sunday School</h1>
          </div>
        </header>

        {/* Purchase Screen */}
        <main className="mx-auto flex max-w-4xl flex-col items-center justify-center p-4 pt-16">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
            <Lock className="h-10 w-10 text-accent" />
          </div>

          <h2 className="mb-2 text-2xl font-bold">Premium Content</h2>
          <p className="mb-8 text-center text-muted-foreground">
            Access complete Sunday School teaching manuals in English and Yoruba
          </p>

          <Card className="mb-6 w-full">
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p>Teacher's manuals for all quarters</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p>Student's manuals for all quarters</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p>Available in English and Yoruba</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p>Offline access after download</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p>Regular updates and new content</p>
              </div>
            </CardContent>
          </Card>

          <div className="mb-4 text-center">
            <p className="mb-1 text-3xl font-bold">₦5,000</p>
            <p className="text-sm text-muted-foreground">One-time payment</p>
          </div>

          <Button 
            className="h-12 w-full max-w-md text-base font-semibold"
            onClick={() => navigate("/payment")}
          >
            Buy Full Access
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Sunday School</h1>
          <Badge className="ml-auto bg-accent text-accent-foreground">Purchased</Badge>
        </div>
      </header>

      {/* Manual List */}
      <div className="mx-auto max-w-4xl space-y-3 p-4">
        {mockManuals.map((manual) => (
          <Card
            key={manual.id}
            className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
            onClick={() => navigate(`/manuals/${manual.id}`)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h3 className="font-semibold">{manual.title}</h3>
                <Badge variant="outline" className="mt-1 text-xs">
                  {manual.language}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Manuals;
