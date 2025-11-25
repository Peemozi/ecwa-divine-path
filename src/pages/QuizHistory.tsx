import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Calendar, Target, RotateCcw } from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface QuizAttempt {
  id: string;
  type: string;
  year: string;
  lessonId: string;
  lessonTitle: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

const QuizHistory = () => {
  const navigate = useNavigate();

  // Get quiz history from localStorage
  const getQuizHistory = (): QuizAttempt[] => {
    const history = localStorage.getItem("quizHistory");
    return history ? JSON.parse(history) : [];
  };

  const quizHistory = getQuizHistory();

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (percentage: number): "default" | "secondary" | "destructive" => {
    if (percentage >= 80) return "default";
    if (percentage >= 60) return "secondary";
    return "destructive";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/menu")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Quiz History</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        {quizHistory.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Trophy className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Quiz History Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start taking quizzes to see your progress here
              </p>
              <Button onClick={() => navigate("/quiz")}>
                Take a Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{quizHistory.length}</p>
                  <p className="text-xs text-muted-foreground">Quizzes Taken</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">
                    {Math.round(
                      quizHistory.reduce((acc, q) => acc + q.percentage, 0) / quizHistory.length
                    )}%
                  </p>
                  <p className="text-xs text-muted-foreground">Average Score</p>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Attempts List */}
            <div className="space-y-3">
              {quizHistory
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((attempt) => (
                  <Card key={attempt.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                              {attempt.type === "sunday-school" ? "Sunday School" : "Bible Study"}
                            </Badge>
                            <Badge variant="secondary">{attempt.year}</Badge>
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {attempt.lessonTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(attempt.date)}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getScoreBadgeVariant(attempt.percentage)}>
                            {attempt.percentage}%
                          </Badge>
                          <p className={`text-2xl font-bold mt-1 ${getScoreColor(attempt.percentage)}`}>
                            {attempt.score}/{attempt.total}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/quiz/${attempt.type}/${attempt.year}/lesson/${attempt.lessonId}`)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retake Quiz
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default QuizHistory;
