import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Languages } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ManualLanguage = () => {
  const navigate = useNavigate();
  const { type, year } = useParams();

  const languages = [
    { code: "english", name: "English", flag: "🇬🇧" },
    { code: "yoruba", name: "Yoruba", flag: "🇳🇬" },
  ];
  
  const title = type === "sunday-school" ? "Sunday School Manual" : "Bible Study Manual";

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/manuals/${type}/years`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{title} {year}</h1>
            <p className="text-xs text-muted-foreground">Select Language</p>
          </div>
        </div>
      </header>

      {/* Language Selection */}
      <main className="mx-auto max-w-4xl p-4 space-y-3">
        {languages.map((language) => (
          <Card
            key={language.code}
            className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
            onClick={() => navigate(`/manuals/${type}/${year}/${language.code}/lessons`)}
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-2xl">
                {language.flag}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{language.name}</h3>
                <p className="text-sm text-muted-foreground">{title} in {language.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default ManualLanguage;
