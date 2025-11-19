import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

// Mock lesson data - replace with backend API call
const mockLessonData = {
  lessonNumber: 46,
  topic: "LOVE OF MONEY: AN END TIME CANKERWORM",
  texts: ["2 Timothy 3:1–5", "1 Timothy 6:6–10"],
  aim: "To expose believers to the evil of love of money so that they can avoid it and live godly lives.",
  introduction: "The love of money is one of the most dangerous spiritual diseases affecting believers today. As we approach the end times, this vice has become increasingly prevalent, corrupting hearts and leading many astray from the faith.",
  sections: [
    {
      heading: "A. Biblical Predictions on End-time",
      content: "The Scripture clearly warns us that in the last days, perilous times shall come. Men shall be lovers of their own selves, covetous, boasters, proud, and lovers of pleasures more than lovers of God. These characteristics are evident in our society today, particularly the obsession with material wealth and possessions.",
      subPoints: [
        "The increase of materialism in modern society",
        "The departure from godly contentment",
        "The rise of prosperity gospel that distorts biblical truth"
      ]
    },
    {
      heading: "B. Evidences of Love of Money Today",
      content: "We see clear evidence of the love of money in contemporary society through various manifestations. Corruption has become widespread, people pursue wealth at any cost, and many have compromised their faith for financial gain.",
      subPoints: [
        "Corruption in religious and secular institutions",
        "Exploitation of the poor and vulnerable",
        "Abandonment of spiritual values for material gain",
        "The rise of fraudulent schemes and dishonest practices"
      ]
    }
  ],
  conclusion: "The love of money is indeed a root of all kinds of evil. As believers, we must guard our hearts against this dangerous vice. We are called to pursue godliness with contentment, trusting in God's provision rather than placing our hope in uncertain riches. Let us flee from the love of money and pursue righteousness, godliness, faith, love, patience, and meekness.",
  memoryVerse: "For the love of money is the root of all evil: which while some coveted after, they have erred from the faith, and pierced themselves through with many sorrows. - 1 Timothy 6:10"
};

const SundaySchoolLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Check payment status on mount
    const hasPaidAccess = false; // Replace with actual backend check
    if (!hasPaidAccess) {
      navigate("/payment");
    }
  }, [navigate]);

  // TODO: Replace with actual API call to fetch lesson by ID
  const lesson = mockLessonData;

  const handleShare = () => {
    toast({
      title: "Share Lesson",
      description: "Sharing functionality coming soon!",
    });
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Lesson bookmarked",
      description: isBookmarked ? "" : "Saved to your bookmarks",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Badge variant="secondary">Lesson {lesson.lessonNumber}</Badge>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBookmark}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-primary" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Lesson Content */}
      <main className="mx-auto max-w-4xl p-4 space-y-6">
        {/* Topic */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {lesson.topic}
          </h1>
        </div>

        {/* Texts */}
        <Card className="animate-fade-in">
          <CardContent className="pt-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-2">LESSON TEXTS</h2>
            <div className="space-y-1">
              {lesson.texts.map((text, index) => (
                <p key={index} className="text-foreground font-medium">{text}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aim */}
        <Card className="animate-fade-in bg-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <h2 className="text-sm font-semibold text-accent-foreground mb-2">AIM</h2>
            <p className="text-foreground leading-relaxed">{lesson.aim}</p>
          </CardContent>
        </Card>

        {/* Introduction */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-foreground mb-3">INTRODUCTION</h2>
          <p className="text-foreground leading-relaxed">{lesson.introduction}</p>
        </div>

        {/* Main Sections */}
        {lesson.sections.map((section, index) => (
          <div key={index} className="animate-fade-in">
            <h2 className="text-xl font-bold text-primary mb-3">{section.heading}</h2>
            <p className="text-foreground leading-relaxed mb-4">{section.content}</p>
            {section.subPoints && section.subPoints.length > 0 && (
              <ul className="list-disc list-inside space-y-2 ml-4">
                {section.subPoints.map((point, idx) => (
                  <li key={idx} className="text-foreground leading-relaxed">{point}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Conclusion */}
        <Card className="animate-fade-in bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-primary mb-3">CONCLUSION</h2>
            <p className="text-foreground leading-relaxed">{lesson.conclusion}</p>
          </CardContent>
        </Card>

        {/* Memory Verse */}
        <Card className="animate-fade-in bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="pt-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">MEMORY VERSE</h2>
            <p className="text-foreground italic leading-relaxed text-lg">{lesson.memoryVerse}</p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default SundaySchoolLesson;
