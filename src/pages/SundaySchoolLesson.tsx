import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

// Mock lesson data - replace with backend API call
const mockLessonsData: Record<number, any> = {
  1: {
    lessonNumber: 1,
    topic: "LOVE OF MONEY: AN END-TIME CANKERWORM",
    texts: ["1 Timothy 6:6–10", "2 Timothy 3:1–5"],
    aim: "To teach believers the dangers of loving money and pursue godliness with contentment.",
    introduction: "Money itself is not evil, but the love of money leads to destruction. In the last days, people will be lovers of themselves and lovers of money rather than lovers of God.",
    sections: [
      {
        heading: "A. Signs of the Love of Money",
        content: "The love of money manifests in various ways in a believer's life, drawing them away from God.",
        subPoints: ["Obsession with wealth accumulation", "Greed-driven decisions", "Spiritual neglect and prayerlessness"]
      },
      {
        heading: "B. Effects in Today's World",
        content: "We see the devastating effects of money-love in our society today.",
        subPoints: ["Fraud and corruption in all sectors", "Materialistic lifestyles", "Broken families and relationships"]
      }
    ],
    conclusion: "True contentment comes from godliness with contentment. We must flee the love of money and pursue righteousness, faith, love, and patience.",
    memoryVerse: "For the love of money is the root of all evil. - 1 Timothy 6:10"
  },
  2: {
    lessonNumber: 2,
    topic: "FAITHFULNESS IN A CORRUPT WORLD",
    texts: ["Daniel 6:1-10", "Proverbs 28:20"],
    aim: "To encourage believers to remain faithful to God even in corrupt environments.",
    introduction: "Daniel's life demonstrates that it is possible to maintain integrity and faithfulness in a corrupt system.",
    sections: [
      {
        heading: "A. Daniel's Example of Faithfulness",
        content: "Daniel distinguished himself through his excellent spirit and unwavering commitment to God.",
        subPoints: ["Consistent prayer life", "Integrity in public service", "Courage in the face of opposition"]
      },
      {
        heading: "B. Remaining Faithful Today",
        content: "Believers must stand firm in their faith despite societal pressures.",
        subPoints: ["Maintaining godly standards at work", "Refusing to compromise biblical values", "Being salt and light"]
      }
    ],
    conclusion: "Like Daniel, we must purpose in our hearts to remain faithful to God regardless of the cost.",
    memoryVerse: "A faithful man shall abound with blessings. - Proverbs 28:20"
  },
  3: {
    lessonNumber: 3,
    topic: "LIVING BY THE SPIRIT",
    texts: ["Galatians 5:16-25", "Romans 8:1-14"],
    aim: "To help believers understand how to walk in the Spirit and not fulfill the lusts of the flesh.",
    introduction: "The Christian life is a Spirit-led life. We must learn to be controlled by the Holy Spirit rather than our sinful nature.",
    sections: [
      {
        heading: "A. The Works of the Flesh",
        content: "Paul lists the destructive works of the flesh that believers must avoid.",
        subPoints: ["Sexual immorality and impurity", "Hatred, jealousy, and strife", "Drunkenness and revelry"]
      },
      {
        heading: "B. The Fruit of the Spirit",
        content: "Walking in the Spirit produces godly character in our lives.",
        subPoints: ["Love, joy, and peace", "Patience, kindness, and goodness", "Faithfulness, gentleness, and self-control"]
      }
    ],
    conclusion: "Those who belong to Christ have crucified the flesh. Let us walk in the Spirit and bear spiritual fruit.",
    memoryVerse: "Walk in the Spirit, and ye shall not fulfil the lust of the flesh. - Galatians 5:16"
  },
  4: {
    lessonNumber: 4,
    topic: "CHRISTIAN CONDUCT IN THE LAST DAYS",
    texts: ["2 Timothy 3:1-5", "1 Peter 4:7-11"],
    aim: "To guide believers on how to live godly lives in the perilous last days.",
    introduction: "Scripture warns that the last days will be characterized by moral decay. Christians must live differently.",
    sections: [
      {
        heading: "A. Characteristics of the Last Days",
        content: "Paul describes the dangerous times we are living in.",
        subPoints: ["Lovers of self and money", "Disobedient to parents", "Without self-control"]
      },
      {
        heading: "B. How to Live in the Last Days",
        content: "Believers must maintain godly conduct.",
        subPoints: ["Be sober-minded and watchful", "Love one another earnestly", "Use your gifts to serve others"]
      }
    ],
    conclusion: "Though we live in perilous times, we must shine as lights in the darkness.",
    memoryVerse: "The end of all things is at hand: be ye therefore sober, and watch unto prayer. - 1 Peter 4:7"
  },
  5: {
    lessonNumber: 5,
    topic: "THE POWER OF PRAYER",
    texts: ["James 5:13-18", "Matthew 7:7-11"],
    aim: "To teach believers about the effectiveness of fervent prayer.",
    introduction: "Prayer is the believer's weapon and communication line with God. Effective prayer produces results.",
    sections: [
      {
        heading: "A. Types of Prayer",
        content: "Scripture teaches us different types of prayer for different situations.",
        subPoints: ["Prayer of supplication", "Prayer of thanksgiving", "Prayer of intercession"]
      },
      {
        heading: "B. Conditions for Effective Prayer",
        content: "Certain conditions must be met for prayers to be answered.",
        subPoints: ["Pray in faith without doubting", "Pray according to God's will", "Pray with a pure heart"]
      }
    ],
    conclusion: "The effectual fervent prayer of a righteous man avails much. Let us be people of prayer.",
    memoryVerse: "The effectual fervent prayer of a righteous man availeth much. - James 5:16"
  },
  6: {
    lessonNumber: 6,
    topic: "WALKING IN HOLINESS",
    texts: ["1 Peter 1:13-16", "Hebrews 12:14"],
    aim: "To emphasize the importance of holy living for every believer.",
    introduction: "God has called us to be holy as He is holy. Without holiness, no one will see the Lord.",
    sections: [
      {
        heading: "A. The Call to Holiness",
        content: "Holiness is not optional but a requirement for all believers.",
        subPoints: ["Set apart for God's purposes", "Separated from worldly practices", "Reflecting God's character"]
      },
      {
        heading: "B. Practical Steps to Holiness",
        content: "Holiness requires intentional effort and God's grace.",
        subPoints: ["Renewing your mind daily", "Avoiding every appearance of evil", "Crucifying the flesh"]
      }
    ],
    conclusion: "Follow peace with all men, and holiness, without which no man shall see the Lord.",
    memoryVerse: "Be ye holy; for I am holy. - 1 Peter 1:16"
  },
  7: {
    lessonNumber: 7,
    topic: "STEWARDSHIP AND RESPONSIBILITY",
    texts: ["Matthew 25:14-30", "Luke 12:42-48"],
    aim: "To teach believers about faithful stewardship of God's resources.",
    introduction: "Every believer is a steward of what God has entrusted to them. We will give account.",
    sections: [
      {
        heading: "A. What is Stewardship?",
        content: "Stewardship is managing God's resources according to His will.",
        subPoints: ["Time and talents", "Money and material possessions", "Spiritual gifts"]
      },
      {
        heading: "B. Characteristics of a Faithful Steward",
        content: "God rewards faithful stewards.",
        subPoints: ["Faithfulness in little things", "Diligence and hard work", "Accountability and transparency"]
      }
    ],
    conclusion: "Unto whomsoever much is given, of him shall be much required.",
    memoryVerse: "It is required in stewards, that a man be found faithful. - 1 Corinthians 4:2"
  },
  8: {
    lessonNumber: 8,
    topic: "OVERCOMING TEMPTATION",
    texts: ["1 Corinthians 10:13", "James 1:12-15"],
    aim: "To equip believers with strategies to overcome temptation.",
    introduction: "Temptation is common to all believers, but God provides a way of escape.",
    sections: [
      {
        heading: "A. The Nature of Temptation",
        content: "Understanding how temptation works helps us resist it.",
        subPoints: ["Temptation is not sin", "It targets our weaknesses", "It follows a predictable pattern"]
      },
      {
        heading: "B. Strategies for Victory",
        content: "God has given us tools to overcome temptation.",
        subPoints: ["Flee from temptation", "Use the Word of God", "Pray without ceasing"]
      }
    ],
    conclusion: "Blessed is the man that endureth temptation, for he shall receive the crown of life.",
    memoryVerse: "There hath no temptation taken you but such as is common to man. - 1 Corinthians 10:13"
  },
  9: {
    lessonNumber: 9,
    topic: "SPIRITUAL GROWTH AND MATURITY",
    texts: ["2 Peter 3:18", "Ephesians 4:11-16"],
    aim: "To encourage believers to grow in grace and in the knowledge of Christ.",
    introduction: "Spiritual growth is God's desire for every believer. We must not remain spiritual babies.",
    sections: [
      {
        heading: "A. Signs of Spiritual Maturity",
        content: "Mature believers exhibit certain characteristics.",
        subPoints: ["Ability to digest solid spiritual food", "Stability in doctrine", "Ability to teach others"]
      },
      {
        heading: "B. How to Grow Spiritually",
        content: "Growth requires intentional effort.",
        subPoints: ["Regular Bible study", "Prayer and fellowship", "Serving in ministry"]
      }
    ],
    conclusion: "Grow in grace and in the knowledge of our Lord Jesus Christ.",
    memoryVerse: "But grow in grace, and in the knowledge of our Lord and Saviour Jesus Christ. - 2 Peter 3:18"
  },
  10: {
    lessonNumber: 10,
    topic: "THE BELIEVER'S HOPE IN CHRIST",
    texts: ["1 Peter 1:3-9", "Romans 8:18-25"],
    aim: "To strengthen believers' hope in the return of Christ and eternal life.",
    introduction: "Our hope is not in this world but in the glorious return of our Lord Jesus Christ.",
    sections: [
      {
        heading: "A. The Nature of Our Hope",
        content: "Christian hope is a confident expectation based on God's promises.",
        subPoints: ["A living hope through resurrection", "An incorruptible inheritance", "Hope that does not disappoint"]
      },
      {
        heading: "B. Living in Hope",
        content: "Hope affects how we live today.",
        subPoints: ["Patient endurance in trials", "Holy living in anticipation", "Eagerly waiting for Christ's return"]
      }
    ],
    conclusion: "We have this hope as an anchor for the soul, firm and secure.",
    memoryVerse: "We rejoice in hope of the glory of God. - Romans 5:2"
  },
  11: {
    lessonNumber: 11,
    topic: "CHRISTIAN GIVING AND SACRIFICE",
    texts: ["2 Corinthians 9:6-15", "Malachi 3:8-10"],
    aim: "To teach the principles of cheerful and sacrificial giving.",
    introduction: "God loves a cheerful giver. Our giving reflects our trust in God's provision.",
    sections: [
      {
        heading: "A. Principles of Biblical Giving",
        content: "God has established principles for giving.",
        subPoints: ["Give willingly and cheerfully", "Give proportionately", "Give expecting God's blessing"]
      },
      {
        heading: "B. The Blessings of Giving",
        content: "God promises to bless those who give.",
        subPoints: ["God supplies all our needs", "Windows of heaven opened", "Reaping bountifully"]
      }
    ],
    conclusion: "God is able to make all grace abound toward you.",
    memoryVerse: "God loveth a cheerful giver. - 2 Corinthians 9:7"
  },
  12: {
    lessonNumber: 12,
    topic: "EVANGELISM AND SOUL WINNING",
    texts: ["Matthew 28:18-20", "Acts 1:8"],
    aim: "To motivate believers to fulfill the Great Commission.",
    introduction: "Every believer is called to be a witness for Christ and win souls for the kingdom.",
    sections: [
      {
        heading: "A. The Great Commission",
        content: "Jesus gave the church a mandate to evangelize the world.",
        subPoints: ["Go into all the world", "Preach the gospel to every creature", "Make disciples of all nations"]
      },
      {
        heading: "B. Methods of Evangelism",
        content: "There are various ways to share the gospel.",
        subPoints: ["Personal evangelism", "Mass evangelism", "Digital evangelism"]
      }
    ],
    conclusion: "He that winneth souls is wise. Let us be faithful witnesses.",
    memoryVerse: "Ye shall be witnesses unto me. - Acts 1:8"
  },
  13: {
    lessonNumber: 13,
    topic: "GOD'S FAITHFULNESS IN TRIALS",
    texts: ["1 Corinthians 10:13", "James 1:2-4"],
    aim: "To encourage believers to trust God during difficult times.",
    introduction: "Trials are inevitable, but God is faithful and will not allow us to be tempted beyond what we can bear.",
    sections: [
      {
        heading: "A. The Purpose of Trials",
        content: "God uses trials to refine and strengthen our faith.",
        subPoints: ["Testing produces patience", "Trials purify our faith", "Suffering produces character"]
      },
      {
        heading: "B. God's Faithfulness",
        content: "We can always depend on God's faithfulness.",
        subPoints: ["He provides a way of escape", "His grace is sufficient", "He never leaves nor forsakes us"]
      }
    ],
    conclusion: "Count it all joy when you face trials, knowing God is faithful.",
    memoryVerse: "God is faithful, who will not suffer you to be tempted above that ye are able. - 1 Corinthians 10:13"
  },
  14: {
    lessonNumber: 14,
    topic: "THE FRUIT OF THE SPIRIT",
    texts: ["Galatians 5:22-23", "John 15:1-8"],
    aim: "To teach believers about the nine-fold fruit of the Spirit.",
    introduction: "The fruit of the Spirit is evidence of a Spirit-filled life. Every believer should bear this fruit.",
    sections: [
      {
        heading: "A. Understanding the Fruit",
        content: "There are nine aspects of the fruit of the Spirit.",
        subPoints: ["Love, joy, peace", "Longsuffering, gentleness, goodness", "Faith, meekness, temperance"]
      },
      {
        heading: "B. Bearing Fruit",
        content: "We must abide in Christ to bear fruit.",
        subPoints: ["Remain connected to the vine", "Allow God to prune us", "Surrender to the Holy Spirit"]
      }
    ],
    conclusion: "By this shall all men know that ye are my disciples, if ye bear much fruit.",
    memoryVerse: "The fruit of the Spirit is love, joy, peace... - Galatians 5:22-23"
  },
  15: {
    lessonNumber: 15,
    topic: "THE BELIEVER'S IDENTITY IN CHRIST",
    texts: ["2 Corinthians 5:17", "Ephesians 1:3-14"],
    aim: "To help believers understand who they are in Christ.",
    introduction: "When we accept Christ, we receive a new identity. Understanding this transforms how we live.",
    sections: [
      {
        heading: "A. Our New Identity",
        content: "In Christ, we are new creations with a new identity.",
        subPoints: ["Children of God", "Saints and holy ones", "Ambassadors for Christ"]
      },
      {
        heading: "B. Living Out Our Identity",
        content: "Knowing who we are affects how we live.",
        subPoints: ["Walk worthy of your calling", "Put off the old man", "Renew your mind daily"]
      }
    ],
    conclusion: "If any man be in Christ, he is a new creature. Old things are passed away.",
    memoryVerse: "Therefore if any man be in Christ, he is a new creature. - 2 Corinthians 5:17"
  },
  16: {
    lessonNumber: 16,
    topic: "VICTORY OVER SIN",
    texts: ["Romans 6:1-14", "1 John 1:5-10"],
    aim: "To teach believers how to live in victory over sin.",
    introduction: "Through Christ, we have been set free from the power of sin. We must walk in this freedom.",
    sections: [
      {
        heading: "A. Dead to Sin, Alive to God",
        content: "Our old man was crucified with Christ.",
        subPoints: ["Sin shall not have dominion", "Reckon yourself dead to sin", "Present yourself to God"]
      },
      {
        heading: "B. Maintaining Victory",
        content: "Victory over sin requires vigilance.",
        subPoints: ["Confess sins quickly", "Walk in the light", "Depend on the Holy Spirit"]
      }
    ],
    conclusion: "Thanks be to God who gives us the victory through our Lord Jesus Christ.",
    memoryVerse: "Sin shall not have dominion over you. - Romans 6:14"
  },
  17: {
    lessonNumber: 17,
    topic: "UNDERSTANDING GOD'S PURPOSE",
    texts: ["Romans 8:28", "Jeremiah 29:11"],
    aim: "To help believers discover and fulfill God's purpose for their lives.",
    introduction: "God has a specific plan and purpose for every believer's life. We must seek and fulfill it.",
    sections: [
      {
        heading: "A. God Has a Plan",
        content: "God's plans for us are good and purposeful.",
        subPoints: ["Plans to prosper and not to harm", "Plans for a hope and a future", "Plans established before we were born"]
      },
      {
        heading: "B. Discovering Your Purpose",
        content: "We can know God's will for our lives.",
        subPoints: ["Through prayer and His Word", "Through spiritual gifts and talents", "Through godly counsel"]
      }
    ],
    conclusion: "All things work together for good to them that love God.",
    memoryVerse: "For I know the plans I have for you, declares the Lord. - Jeremiah 29:11"
  },
  18: {
    lessonNumber: 18,
    topic: "KINGDOM LIVING",
    texts: ["Matthew 6:33", "Romans 14:17"],
    aim: "To teach believers how to live as citizens of God's kingdom.",
    introduction: "We are citizens of heaven living on earth. Our priorities and values must reflect kingdom principles.",
    sections: [
      {
        heading: "A. Characteristics of the Kingdom",
        content: "The kingdom of God has distinct characteristics.",
        subPoints: ["Righteousness, peace, and joy", "Not meat and drink", "Power and demonstration"]
      },
      {
        heading: "B. Seeking First the Kingdom",
        content: "Kingdom priorities must come first.",
        subPoints: ["Prioritize spiritual over material", "Live by kingdom principles", "Advance the kingdom through evangelism"]
      }
    ],
    conclusion: "Seek ye first the kingdom of God and His righteousness.",
    memoryVerse: "But seek ye first the kingdom of God, and his righteousness. - Matthew 6:33"
  },
  19: {
    lessonNumber: 19,
    topic: "LIVING BY FAITH",
    texts: ["Hebrews 11:1-6", "Habakkuk 2:4"],
    aim: "To teach believers how to live a life of faith.",
    introduction: "Without faith it is impossible to please God. The just shall live by faith.",
    sections: [
      {
        heading: "A. What is Faith?",
        content: "Faith is confidence in what we hope for and assurance about what we do not see.",
        subPoints: ["Faith comes by hearing God's Word", "Faith is the substance of things hoped for", "Faith without works is dead"]
      },
      {
        heading: "B. Examples of Faith",
        content: "Scripture gives us many examples of people who lived by faith.",
        subPoints: ["Abraham believed God", "Moses chose to suffer affliction", "The heroes of faith conquered kingdoms"]
      }
    ],
    conclusion: "The just shall live by faith. Let us walk by faith and not by sight.",
    memoryVerse: "The just shall live by faith. - Habakkuk 2:4"
  },
  20: {
    lessonNumber: 20,
    topic: "HOPE OF ETERNAL GLORY",
    texts: ["Colossians 3:1-4", "Revelation 21:1-7"],
    aim: "To fix believers' hope on eternal glory with Christ.",
    introduction: "Our citizenship is in heaven. We eagerly await a new heaven and new earth where righteousness dwells.",
    sections: [
      {
        heading: "A. The Promise of Eternal Glory",
        content: "God has prepared an eternal home for believers.",
        subPoints: ["A new heaven and new earth", "No more death, sorrow, or pain", "We shall be like Him"]
      },
      {
        heading: "B. Living with Eternity in View",
        content: "Our hope of glory affects how we live now.",
        subPoints: ["Set your affection on things above", "Store up treasures in heaven", "Live as strangers and pilgrims"]
      }
    ],
    conclusion: "When Christ who is our life appears, we shall appear with Him in glory.",
    memoryVerse: "When Christ, who is our life, shall appear, then shall ye also appear with him in glory. - Colossians 3:4"
  }
};

const SundaySchoolLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Check payment status on mount
    const hasPaidAccess = localStorage.getItem("sundaySchoolPaid") === "true";
    if (!hasPaidAccess) {
      navigate("/payment");
    }
  }, [navigate]);

  // TODO: Replace with actual API call to fetch lesson by ID
  const lessonId = parseInt(id || "1");
  const lesson = mockLessonsData[lessonId] || mockLessonsData[1];

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
