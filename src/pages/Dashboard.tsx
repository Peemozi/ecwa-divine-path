import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, GraduationCap, Search, LogOut, User } from "lucide-react";
import ecwaLogo from "@/assets/ecwa-logo.png";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <img src={ecwaLogo} alt="ECWA" className="h-10 w-10" />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl p-4 pb-20">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Welcome back!
          </h1>
          <p className="text-muted-foreground">{userEmail}</p>
        </div>

        {/* Search */}
        <div className="relative mb-8 animate-fade-in">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search hymns or manuals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-10 text-base"
          />
        </div>

        {/* Primary CTAs */}
        <div className="mb-8 grid gap-4 animate-scale-in">
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
            onClick={() => navigate("/hymns")}
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Book className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">Hymns</CardTitle>
                <CardDescription>Browse English & Yoruba hymns</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="secondary">English</Badge>
                <Badge variant="secondary">Yoruba</Badge>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
            onClick={() => navigate("/manuals")}
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">Sunday School</CardTitle>
                <CardDescription>Access teaching manuals</CardDescription>
              </div>
              <Badge className="bg-accent text-accent-foreground">Premium</Badge>
            </CardHeader>
          </Card>
        </div>

        {/* Recent/Bookmarked */}
        <div className="animate-fade-in">
          <h2 className="mb-4 text-xl font-semibold">Recent Hymns</h2>
          <div className="space-y-3">
            {[
              { number: 1, title: "Holy, Holy, Holy", language: "EN" },
              { number: 234, title: "Jọwọ wa sọdọ wa", language: "YO" },
              { number: 567, title: "Amazing Grace", language: "EN" },
            ].map((hymn) => (
              <Card 
                key={hymn.number}
                className="cursor-pointer transition-all hover:bg-accent/5"
                onClick={() => navigate(`/hymns/${hymn.number}`)}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                    {hymn.number}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{hymn.title}</p>
                  </div>
                  <Badge variant="outline">{hymn.language}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
