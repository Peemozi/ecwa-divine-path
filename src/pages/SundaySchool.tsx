import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useEffect } from "react";

// Mock data - replace with backend API call
const mockLessons = [
  {
    id: 46,
    number: 46,
    topic: "LOVE OF MONEY: AN END TIME CANKERWORM",
    texts: "2 Timothy 3:1–5, 1 Timothy 6:6–10",
    isPaid: true,
    isCurrentWeek: true
  },
  {
    id: 45,
    number: 45,
    topic: "LIVING IN THE END TIMES",
    texts: "Matthew 24:1-14",
    isPaid: true,
    isCurrentWeek: false
  },
  {
    id: 44,
    number: 44,
    topic: "THE POWER OF PRAYER",
    texts: "James 5:13-18",
    isPaid: false,
    isCurrentWeek: false
  },
  // Add more lessons as needed
];

const hasPaidAccess = true; // Replace with actual payment check from backend

const SundaySchool = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check payment status on mount
    if (!hasPaidAccess) {
      navigate("/payment");
    }
  }, [navigate]);

  const handleLessonClick = (lesson: typeof mockLessons[0]) => {
    if (hasPaidAccess || lesson.isPaid) {
      navigate(`/sunday-school-lesson/${lesson.id}`);
    } else {
      navigate("/payment");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Sunday School</h1>
          {hasPaidAccess && (
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
              Premium
            </Badge>
          )}
          {!hasPaidAccess && <div className="w-6" />}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl p-4">
        {!hasPaidAccess && (
          <Card className="mb-6 animate-fade-in bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-bold mb-2 text-foreground">Unlock All Lessons</h2>
              <p className="text-muted-foreground mb-4">
                Get full access to all Sunday School lessons and study materials
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate("/payment")}
              >
                Buy Full Access - ₦5,000
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">ALL LESSONS</h2>
          
          {mockLessons.map((lesson) => (
            <Card
              key={lesson.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                lesson.isCurrentWeek ? "border-accent/50 bg-accent/5" : ""
              }`}
              onClick={() => handleLessonClick(lesson)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                    {lesson.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {lesson.isCurrentWeek && (
                        <Badge variant="secondary" className="bg-accent/20 text-accent-foreground text-xs">
                          This Week
                        </Badge>
                      )}
                      {!hasPaidAccess && !lesson.isPaid && (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 leading-tight">
                      {lesson.topic}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {lesson.texts}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default SundaySchool;
