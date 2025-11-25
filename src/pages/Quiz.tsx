import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Brain, GraduationCap } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Quiz = () => {
  const navigate = useNavigate();

  const quizTypes = [
    { 
      id: "sunday-school", 
      title: "Sunday School Quiz", 
      icon: Brain,
      description: "Test your Sunday School knowledge"
    },
    { 
      id: "bible-study", 
      title: "Bible Study Quiz", 
      icon: GraduationCap,
      description: "Test your Bible Study knowledge"
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
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
          <h1 className="text-xl font-bold">Quiz</h1>
        </div>
      </header>

      {/* Quiz Type Selection */}
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        {quizTypes.map((quiz) => {
          const Icon = quiz.icon;
          return (
            <Card
              key={quiz.id}
              className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
              onClick={() => navigate(`/quiz/${quiz.id}/years`)}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent/20">
                  <Icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground">{quiz.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
};

export default Quiz;
