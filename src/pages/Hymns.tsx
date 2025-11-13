import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search } from "lucide-react";

const mockHymns = [
  { id: 1, number: 1, title: "Holy, Holy, Holy", preview: "Holy, holy, holy! Lord God Almighty!", language: "EN" },
  { id: 2, number: 2, title: "Come, Thou Almighty King", preview: "Come, thou Almighty King, help us thy name to sing", language: "EN" },
  { id: 3, number: 234, title: "Jọwọ wa sọdọ wa", preview: "Jọwọ wa sọdọ wa, Olúwa Jésù", language: "YO" },
  { id: 4, number: 235, title: "Ẹni tí ó gbé ayé dá", preview: "Ẹni tí ó gbé ayé dá, ó ṣe àwọn òkè", language: "YO" },
  { id: 5, number: 567, title: "Amazing Grace", preview: "Amazing grace, how sweet the sound", language: "EN" },
];

const Hymns = () => {
  const [language, setLanguage] = useState<"all" | "en" | "yo">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredHymns = mockHymns.filter((hymn) => {
    const matchesLanguage = language === "all" || hymn.language.toLowerCase() === language;
    const matchesSearch = 
      hymn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hymn.number.toString().includes(searchQuery);
    return matchesLanguage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Hymns</h1>
        </div>
      </header>

      {/* Filters */}
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <Tabs value={language} onValueChange={(v) => setLanguage(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="yo">Yoruba</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-10"
          />
        </div>
      </div>

      {/* Hymn List */}
      <div className="mx-auto max-w-4xl space-y-3 p-4">
        {filteredHymns.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No hymns match your search — try another phrase.
            </p>
          </Card>
        ) : (
          filteredHymns.map((hymn) => (
            <Card
              key={hymn.id}
              className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
              onClick={() => navigate(`/hymns/${hymn.id}`)}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                  {hymn.number}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-semibold">{hymn.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {hymn.language}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {hymn.preview}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Hymns;
