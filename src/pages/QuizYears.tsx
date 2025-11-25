import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const QuizYears = () => {
  const navigate = useNavigate();
  const { type } = useParams();

  const years = [2021, 2022, 2023, 2024, 2025, 2026];
  
  const title = type === "sunday-school" ? "Sunday School Quiz" : "Bible Study Quiz";

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/quiz")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
      </header>

      {/* Years List */}
      <main className="mx-auto max-w-4xl p-4 space-y-3">
        {years.map((year) => (
          <Card
            key={year}
            className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
            onClick={() => navigate(`/quiz/${type}/${year}/lessons`)}
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{year}</h3>
                <p className="text-sm text-muted-foreground">{title} {year}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default QuizYears;
