import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, BookOpen } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ManualLessons = () => {
  const navigate = useNavigate();
  const { type, year, language } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock lessons - replace with API call
  const lessons = Array.from({ length: 52 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    title: `Lesson ${i + 1}`,
    topic: `Topic for Lesson ${i + 1}`,
  }));
  
  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
            onClick={() => navigate(`/manuals/${type}/${year}/language`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{title} {year}</h1>
            <p className="text-xs text-muted-foreground">{languageName}</p>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="sticky top-[57px] z-10 bg-background border-b px-4 py-3">
        <div className="mx-auto max-w-4xl relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lessons List */}
      <main className="mx-auto max-w-4xl p-4 space-y-3">
        {filteredLessons.map((lesson) => (
          <Card
            key={lesson.id}
            className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
            onClick={() => navigate(`/manuals/${type}/${year}/${language}/lesson/${lesson.id}`)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold">
                {lesson.number}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground">{lesson.topic}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default ManualLessons;
