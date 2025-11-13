import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bookmark, Share2, Type, Play } from "lucide-react";
import { toast } from "sonner";

const mockHymnData: Record<string, any> = {
  "1": {
    number: 1,
    title: "Holy, Holy, Holy",
    language: "EN",
    lyrics: `Holy, holy, holy! Lord God Almighty!
Early in the morning our song shall rise to Thee;
Holy, holy, holy, merciful and mighty!
God in three Persons, blessed Trinity!

Holy, holy, holy! All the saints adore Thee,
Casting down their golden crowns around the glassy sea;
Cherubim and seraphim falling down before Thee,
Which wert, and art, and evermore shalt be.

Holy, holy, holy! though the darkness hide Thee,
Though the eye of sinful man Thy glory may not see;
Only Thou art holy; there is none beside Thee,
Perfect in power, in love, and purity.

Holy, holy, holy! Lord God Almighty!
All Thy works shall praise Thy Name, in earth, and sky, and sea;
Holy, holy, holy; merciful and mighty!
God in three Persons, blessed Trinity!`
  },
  "234": {
    number: 234,
    title: "Jọwọ wa sọdọ wa",
    language: "YO",
    lyrics: `Jọwọ wa sọdọ wa, Olúwa Jésù,
Jọwọ gbọ adura wa nínú ọjọ yìí.
À ń bẹ Ọ, jọwọ wa sọdọ wa,
Má fi wá sílẹ lọ, Olúwa Jésù.

Ẹnití ó ṣe ẹmi wa lómìnira,
Má jẹ ká padà sí ẹrú ẹṣẹ mọ.
À ń bẹ Ọ, jọwọ wa sọdọ wa,
Má fi wá sílẹ lọ, Olúwa Jésù.`
  }
};

const HymnDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState(16);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const hymn = mockHymnData[id || "1"] || mockHymnData["1"];

  const handleShare = () => {
    toast.success("Share link copied!");
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Bookmark removed" : "Bookmark added");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/hymns")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Hymn {hymn.number}</h1>
              <Badge variant="outline" className="text-xs">
                {hymn.language}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            >
              <Type className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            >
              <Type className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBookmark}
              className={isBookmarked ? "text-accent" : ""}
            >
              <Bookmark className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl p-4">
        <Card className="mb-4 animate-fade-in">
          <CardContent className="p-6">
            <h2 className="mb-4 text-2xl font-bold">{hymn.title}</h2>
            <Button variant="outline" className="mb-6 w-full">
              <Play className="mr-2 h-4 w-4" />
              Play Audio (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <pre 
              className="whitespace-pre-wrap font-sans leading-relaxed"
              style={{ fontSize: `${fontSize}px` }}
            >
              {hymn.lyrics}
            </pre>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HymnDetail;
