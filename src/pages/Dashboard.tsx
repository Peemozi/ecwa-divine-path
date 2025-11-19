import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Music, Book, Calendar, ChevronRight, User } from "lucide-react";
import ecwaLogo from "@/assets/ecwa-logo.png";
import BottomNav from "@/components/BottomNav";

// Mock data - replace with backend API calls
const mockWeeklyLesson = {
  number: 46,
  topic: "LOVE OF MONEY: AN END TIME CANKERWORM",
  texts: "2 Timothy 3:1–5, 1 Timothy 6:6–10",
  intro: "The love of money is one of the most dangerous spiritual diseases affecting believers today..."
};

const mockVerseOfWeek = {
  reference: "1 Timothy 6:10",
  text: "For the love of money is the root of all evil: which while some coveted after, they have erred from the faith, and pierced themselves through with many sorrows."
};

const mockWeeklyHymn = {
  number: 234,
  title: "Take My Life and Let It Be",
  language: "English"
};

const Dashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "Guest";

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 sticky top-0 z-40">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ecwaLogo} alt="ECWA" className="h-10 w-10" />
            <div>
              <h1 className="font-bold text-foreground">ECWA Divine Path</h1>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl p-4 space-y-6">
        
        {/* Verse of the Week */}
        <Card className="animate-fade-in bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                <Book className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground mb-2">VERSE OF THE WEEK</p>
                <p className="text-foreground leading-relaxed mb-2 italic">
                  "{mockVerseOfWeek.text}"
                </p>
                <p className="text-sm font-semibold text-primary">{mockVerseOfWeek.reference}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sunday School of the Week */}
        <Card 
          className="animate-fade-in cursor-pointer transition-all hover:shadow-lg border-accent/30 bg-gradient-to-br from-accent/10 to-transparent"
          onClick={() => navigate(`/sunday-school-lesson/${mockWeeklyLesson.number}`)}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">This Week</Badge>
                  <Badge variant="outline">Lesson {mockWeeklyLesson.number}</Badge>
                </div>
                <CardTitle className="text-xl mb-2">{mockWeeklyLesson.topic}</CardTitle>
                <CardDescription className="text-sm mb-3">
                  <span className="font-medium text-muted-foreground">Texts:</span> {mockWeeklyLesson.texts}
                </CardDescription>
                <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                  {mockWeeklyLesson.intro}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </div>
          </CardHeader>
        </Card>

        {/* Weekly Hymn */}
        <Card 
          className="animate-fade-in cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01]"
          onClick={() => navigate(`/hymns/${mockWeeklyHymn.number}`)}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Music className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-muted-foreground mb-1">HYMN OF THE WEEK</p>
              <p className="font-semibold text-foreground">{mockWeeklyHymn.title}</p>
              <p className="text-sm text-muted-foreground">Hymn #{mockWeeklyHymn.number} • {mockWeeklyHymn.language}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in">
          <Card 
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => navigate("/sunday-school")}
          >
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                <BookOpen className="h-6 w-6 text-accent-foreground" />
              </div>
              <p className="font-semibold text-foreground">Sunday School</p>
              <p className="text-xs text-muted-foreground mt-1">All Lessons</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => navigate("/hymns")}
          >
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold text-foreground">Hymn Book</p>
              <p className="text-xs text-muted-foreground mt-1">EN & YO</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Upcoming</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <div className="text-center shrink-0">
                <p className="text-2xl font-bold text-primary">24</p>
                <p className="text-xs text-muted-foreground">NOV</p>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Sunday Service</p>
                <p className="text-sm text-muted-foreground">9:00 AM - Main Auditorium</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
