import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ManualLesson = () => {
  const navigate = useNavigate();
  const { type, year, language, lessonId } = useParams();

  // Mock lesson data - replace with API call
  const lesson = {
    number: lessonId,
    topic: "LOVE OF MONEY: AN END TIME CANKERWORM",
    texts: "2 Timothy 3:1–5, 1 Timothy 6:6–10",
    aim: "To help believers understand the dangers of the love of money and to encourage them to pursue godliness with contentment.",
    introduction: "The love of money is one of the most dangerous spiritual diseases affecting believers today. It has led many astray from the faith and caused them untold suffering.",
    sections: [
      {
        title: "THE NATURE OF THE LOVE OF MONEY",
        points: [
          { label: "A", content: "It is a root of all kinds of evil (1 Timothy 6:10)" },
          { label: "B", content: "It causes people to wander from the faith" },
        ]
      },
      {
        title: "BIBLICAL WARNINGS AGAINST THE LOVE OF MONEY",
        points: [
          { label: "A", content: "Jesus warned about serving two masters (Matthew 6:24)" },
          { label: "B", content: "Paul's instructions to Timothy about contentment" },
        ]
      }
    ],
    conclusion: "Believers must guard their hearts against the love of money and instead pursue godliness with contentment, trusting in God's provision.",
    memoryVerse: "For the love of money is the root of all evil: which while some coveted after, they have erred from the faith, and pierced themselves through with many sorrows. - 1 Timothy 6:10"
  };
  
  const title = type === "sunday-school" ? "Sunday School Manual" : "Bible Study Manual";
  const languageName = language === "english" ? "English" : "Yoruba";

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/manuals/${type}/${year}/${language}/lessons`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-sm font-bold">{title} {year}</h1>
            <p className="text-xs text-muted-foreground">Lesson {lesson.number}</p>
          </div>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Lesson Content */}
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        {/* Topic */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="outline" className="mb-2">Lesson {lesson.number}</Badge>
                <CardTitle className="text-2xl">{lesson.topic}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Texts:</span> {lesson.texts}
            </p>
          </CardContent>
        </Card>

        {/* Aim */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{lesson.aim}</p>
          </CardContent>
        </Card>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{lesson.introduction}</p>
          </CardContent>
        </Card>

        {/* Sections */}
        {lesson.sections.map((section, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {section.points.map((point, pointIdx) => (
                <div key={pointIdx}>
                  <p className="font-semibold text-primary mb-1">{point.label}. {point.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Conclusion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conclusion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{lesson.conclusion}</p>
          </CardContent>
        </Card>

        {/* Memory Verse */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Memory Verse</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed italic">{lesson.memoryVerse}</p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default ManualLesson;
