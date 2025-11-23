import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock, ChevronRight, Search } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";

// Mock data - replace with backend API call
const mockLessons = [
  { id: 1, number: 1, topic: "Love of Money: An End-Time Cankerworm", texts: "1 Timothy 6:6–10, 2 Timothy 3:1–5", isCurrentWeek: true },
  { id: 2, number: 2, topic: "Faithfulness in a Corrupt World", texts: "Daniel 6:1-10, Proverbs 28:20", isCurrentWeek: false },
  { id: 3, number: 3, topic: "Living by the Spirit", texts: "Galatians 5:16-25, Romans 8:1-14", isCurrentWeek: false },
  { id: 4, number: 4, topic: "Christian Conduct in the Last Days", texts: "2 Timothy 3:1-5, 1 Peter 4:7-11", isCurrentWeek: false },
  { id: 5, number: 5, topic: "The Power of Prayer", texts: "James 5:13-18, Matthew 7:7-11", isCurrentWeek: false },
  { id: 6, number: 6, topic: "Walking in Holiness", texts: "1 Peter 1:13-16, Hebrews 12:14", isCurrentWeek: false },
  { id: 7, number: 7, topic: "Stewardship and Responsibility", texts: "Matthew 25:14-30, Luke 12:42-48", isCurrentWeek: false },
  { id: 8, number: 8, topic: "Overcoming Temptation", texts: "1 Corinthians 10:13, James 1:12-15", isCurrentWeek: false },
  { id: 9, number: 9, topic: "Spiritual Growth and Maturity", texts: "2 Peter 3:18, Ephesians 4:11-16", isCurrentWeek: false },
  { id: 10, number: 10, topic: "The Believer's Hope in Christ", texts: "1 Peter 1:3-9, Romans 8:18-25", isCurrentWeek: false },
  { id: 11, number: 11, topic: "Christian Giving and Sacrifice", texts: "2 Corinthians 9:6-15, Malachi 3:8-10", isCurrentWeek: false },
  { id: 12, number: 12, topic: "Evangelism and Soul Winning", texts: "Matthew 28:18-20, Acts 1:8", isCurrentWeek: false },
  { id: 13, number: 13, topic: "God's Faithfulness in Trials", texts: "1 Corinthians 10:13, James 1:2-4", isCurrentWeek: false },
  { id: 14, number: 14, topic: "The Fruit of the Spirit", texts: "Galatians 5:22-23, John 15:1-8", isCurrentWeek: false },
  { id: 15, number: 15, topic: "The Believer's Identity in Christ", texts: "2 Corinthians 5:17, Ephesians 1:3-14", isCurrentWeek: false },
  { id: 16, number: 16, topic: "Victory Over Sin", texts: "Romans 6:1-14, 1 John 1:5-10", isCurrentWeek: false },
  { id: 17, number: 17, topic: "Understanding God's Purpose", texts: "Romans 8:28, Jeremiah 29:11", isCurrentWeek: false },
  { id: 18, number: 18, topic: "Kingdom Living", texts: "Matthew 6:33, Romans 14:17", isCurrentWeek: false },
  { id: 19, number: 19, topic: "Living by Faith", texts: "Hebrews 11:1-6, Habakkuk 2:4", isCurrentWeek: false },
  { id: 20, number: 20, topic: "Hope of Eternal Glory", texts: "Colossians 3:1-4, Revelation 21:1-7", isCurrentWeek: false },
];

const SundaySchool = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const hasPaidAccess = localStorage.getItem("sundaySchoolPaid") === "true";

  useEffect(() => {
    // Check payment status on mount
    const hasPaid = localStorage.getItem("sundaySchoolPaid") === "true";
    if (!hasPaid) {
      navigate("/payment");
    }
  }, [navigate]);

  const handleLessonClick = (lesson: typeof mockLessons[0]) => {
    navigate(`/sunday-school-lesson/${lesson.id}`);
  };

  const filteredLessons = mockLessons.filter(lesson => 
    lesson.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.texts.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {!hasPaidAccess ? (
          <>
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
          </>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground mb-4">
                {searchQuery ? `SEARCH RESULTS (${filteredLessons.length})` : 'ALL LESSONS'}
              </h2>
              
              {filteredLessons.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No lessons found matching "{searchQuery}"</p>
                </Card>
              ) : (
                filteredLessons.map((lesson) => (
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
                ))
              )}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default SundaySchool;
