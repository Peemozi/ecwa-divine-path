import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";

const QuizQuestions = () => {
  const navigate = useNavigate();
  const { type, year, lessonId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Mock quiz data - replace with API call
  const quiz = {
    lessonNumber: lessonId,
    lessonTopic: "LOVE OF MONEY: AN END TIME CANKERWORM",
    questions: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      question: `Question ${i + 1}: What is the main point discussed in this lesson?`,
      options: [
        "Option A: The love of money is the root of all evil",
        "Option B: Money itself is evil",
        "Option C: Rich people cannot enter heaven",
        "Option D: Poverty is a virtue"
      ],
      correctAnswer: "A"
    }))
  };

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswer = (option: string) => {
    setAnswers({ ...answers, [currentQuestion]: option });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    navigate(`/quiz/${type}/${year}/lesson/${lessonId}/results`, { 
      state: { answers, quiz } 
    });
  };

  const currentQ = quiz.questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/quiz/${type}/${year}/lessons`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-sm font-bold">Lesson {quiz.lessonNumber} Quiz</h1>
            <p className="text-xs text-muted-foreground">Question {currentQuestion + 1} of {quiz.questions.length}</p>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="sticky top-[57px] z-10 bg-background border-b px-4 py-3">
        <div className="mx-auto max-w-4xl">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <Card>
          <CardHeader>
            <Badge variant="outline" className="w-fit mb-2">Question {currentQ.id}</Badge>
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const optionLetter = option.split(":")[0].replace("Option ", "");
              const isSelected = selectedAnswer === optionLetter;
              
              return (
                <Card
                  key={idx}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  onClick={() => handleAnswer(optionLetter)}
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}>
                      {isSelected ? <CheckCircle2 className="h-5 w-5" /> : optionLetter}
                    </div>
                    <p className="flex-1">{option.split(": ")[1]}</p>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            Previous
          </Button>
          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== quiz.questions.length}
              className="flex-1"
            >
              Submit Quiz
            </Button>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default QuizQuestions;
