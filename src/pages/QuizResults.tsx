import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, Home, CheckCircle2, XCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const QuizResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, year, lessonId } = useParams();
  
  const { answers, quiz } = location.state || { answers: {}, quiz: { questions: [] } };

  // Save quiz result to history
  React.useEffect(() => {
    if (quiz.questions.length > 0) {
      const history = localStorage.getItem("quizHistory");
      const quizHistory = history ? JSON.parse(history) : [];
      
      const newAttempt = {
        id: `${type}-${year}-${lessonId}-${Date.now()}`,
        type: type || "",
        year: year || "",
        lessonId: lessonId || "",
        lessonTitle: quiz.title || `Lesson ${lessonId}`,
        score: correctCount,
        total: quiz.questions.length,
        percentage: Math.round((correctCount / quiz.questions.length) * 100),
        date: new Date().toISOString(),
      };
      
      quizHistory.push(newAttempt);
      localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
    }
  }, []);

  // Calculate score
  let correctCount = 0;
  quiz.questions.forEach((q: any, idx: number) => {
    if (answers[idx] === q.correctAnswer) {
      correctCount++;
    }
  });

  const score = correctCount;
  const total = quiz.questions.length;
  const percentage = Math.round((score / total) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return "Excellent! 🎉";
    if (percentage >= 60) return "Good job! 👍";
    return "Keep studying! 📚";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <h1 className="text-xl font-bold">Quiz Results</h1>
        </div>
      </header>

      {/* Results Summary */}
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <Card className="text-center">
          <CardContent className="pt-8 pb-6">
            <div className="flex justify-center mb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">{getScoreMessage()}</h2>
            <p className={`text-5xl font-bold mb-2 ${getScoreColor()}`}>
              {score}/{total}
            </p>
            <p className="text-muted-foreground">Score: {percentage}%</p>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quiz.questions.map((q: any, idx: number) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correctAnswer;
              
              return (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="shrink-0 mt-1">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Question {q.id}</p>
                    <p className="text-sm text-muted-foreground mb-2">{q.question}</p>
                    <div className="flex gap-2">
                      <Badge variant={isCorrect ? "default" : "destructive"}>
                        Your answer: {userAnswer || "Not answered"}
                      </Badge>
                      {!isCorrect && (
                        <Badge variant="outline">
                          Correct: {q.correctAnswer}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/quiz/${type}/${year}/lesson/${lessonId}`)}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            className="flex-1"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default QuizResults;
