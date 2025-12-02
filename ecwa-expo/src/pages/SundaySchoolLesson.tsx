// src/assets/pages/SundaySchoolLesson.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Share2, Bookmark as BookmarkIcon } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

/* ---------------------------------------------
   MOCK LESSON DATA (trimmed for brevity)
---------------------------------------------- */
const mockLessonsData: Record<number, any> = {
  1: {
    lessonNumber: 1,
    topic: "LOVE OF MONEY: AN END-TIME CANKERWORM",
    texts: ["1 Timothy 6:6–10", "2 Timothy 3:1–5"],
    aim: "To teach believers the dangers of loving money and pursue godliness with contentment.",
    introduction:
      "Money itself is not evil, but the love of money leads to destruction. In the last days, people will be lovers of themselves and lovers of money rather than lovers of God.",
    sections: [
      {
        heading: "A. Signs of the Love of Money",
        content:
          "The love of money manifests in various ways in a believer's life, drawing them away from God.",
        subPoints: [
          "Obsession with wealth accumulation",
          "Greed-driven decisions",
          "Spiritual neglect and prayerlessness",
        ],
      },
      {
        heading: "B. Effects in Today's World",
        content: "We see the devastating effects of money-love in our society today.",
        subPoints: ["Fraud and corruption", "Materialistic lifestyles", "Broken relationships"],
      },
    ],
    conclusion:
      "True contentment comes from godliness with contentment. We must flee the love of money and pursue righteousness, faith, love, and patience.",
    memoryVerse: "For the love of money is the root of all evil. - 1 Timothy 6:10",
  },

  2: {
    lessonNumber: 2,
    topic: "FAITHFULNESS IN A CORRUPT WORLD",
    texts: ["Daniel 6:1-10", "Proverbs 28:20"],
    aim: "To encourage believers to remain faithful to God even in corrupt environments.",
    introduction:
      "Daniel's life demonstrates that it is possible to maintain integrity and faithfulness in a corrupt system.",
    sections: [
      {
        heading: "A. Daniel's Example of Faithfulness",
        content:
          "Daniel distinguished himself through his excellent spirit and unwavering commitment to God.",
        subPoints: ["Consistent prayer life", "Integrity in service", "Courage in opposition"],
      },
      {
        heading: "B. Remaining Faithful Today",
        content: "Believers must stand firm in faith despite societal pressures.",
        subPoints: ["Godly standards at work", "No compromise", "Being salt and light"],
      },
    ],
    conclusion:
      "Like Daniel, we must purpose in our hearts to remain faithful to God regardless of the cost.",
    memoryVerse: "A faithful man shall abound with blessings. - Proverbs 28:20",
  },
};

/* ---------------------------------------------
   TOAST HANDLER
---------------------------------------------- */
const showToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("", message);
  }
};

/* ---------------------------------------------
   MAIN COMPONENT
---------------------------------------------- */
const SundaySchoolLesson: React.FC = () => {
  const router = useRouter();
  const { lessonId: lessonIdParam } = useLocalSearchParams<{ lessonId?: string }>();
  const lessonId = parseInt(lessonIdParam ?? "1", 10);
  const lesson = mockLessonsData[lessonId] ?? mockLessonsData[1];

  const [isBookmarked, setIsBookmarked] = useState(false);

  /* ---------------------------------------------
     AUTH CHECK (PAID?)
     - navigation included in deps to satisfy eslint.
  ---------------------------------------------- */
  useEffect(() => {
    const checkPayment = async () => {
      try {
        const paidFlag = await AsyncStorage.getItem("sundaySchoolPaid");
        if (paidFlag !== "true") {
          router.push("/payment");
        }
      } catch (err) {
        console.error("Payment check failed:", err);
        router.push("/payment");
      }
    };
    checkPayment();
  }, [router]);

  /* ---------------------------------------------
     SHARE
  ---------------------------------------------- */
  const handleShare = async () => {
    const shareContent = `${lesson.topic}\n\n${lesson.introduction}\n\nMemory verse: ${lesson.memoryVerse}`;

    try {
      await Share.share({ message: shareContent });
      showToast("Share dialog opened");
    } catch (err) {
      console.error("Share error:", err);
      showToast("Unable to open share dialog");
    }
  };

  /* ---------------------------------------------
     BOOKMARK TOGGLE
  ---------------------------------------------- */
  const toggleBookmark = () => {
    setIsBookmarked((prev) => {
      const next = !prev;
      showToast(next ? "Lesson bookmarked" : "Bookmark removed");
      return next;
    });
  };

  /* ---------------------------------------------
     UI
  ---------------------------------------------- */
  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.badge}>Lesson {lesson.lessonNumber}</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleBookmark} style={styles.iconBtn}>
            <BookmarkIcon size={20} color={isBookmarked ? "#0ea5a3" : "#374151"} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
            <Share2 size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView contentContainerStyle={styles.main}>
        <View style={styles.topicWrap}>
          <Text style={styles.topic}>{lesson.topic}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>LESSON TEXTS</Text>
          {lesson.texts.map((t: string, i: number) => (
            <Text key={i} style={styles.textItem}>
              {t}
            </Text>
          ))}
        </View>

        <View style={[styles.card, styles.aimCard]}>
          <Text style={styles.sectionTitle}>AIM</Text>
          <Text style={styles.paragraph}>{lesson.aim}</Text>
        </View>

        {/* INTRODUCTION */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>INTRODUCTION</Text>
          <Text style={styles.paragraph}>{lesson.introduction}</Text>
        </View>

        {/* SECTIONS */}
        {lesson.sections?.map((section: any, index: number) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionHeader}>{section.heading}</Text>
            <Text style={styles.paragraph}>{section.content}</Text>

            {section.subPoints?.length > 0 && (
              <View style={styles.list}>
                {section.subPoints.map((point: string, j: number) => (
                  <View key={j} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* CONCLUSION */}
        <View style={[styles.card, styles.conclusionCard]}>
          <Text style={styles.sectionHeader}>CONCLUSION</Text>
          <Text style={styles.paragraph}>{lesson.conclusion}</Text>
        </View>

        {/* MEMORY VERSE */}
        <View style={[styles.card, styles.memoryCard]}>
          <Text style={styles.sectionTitle}>MEMORY VERSE</Text>
          <Text style={styles.memoryVerse}>{lesson.memoryVerse}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SundaySchoolLesson;

/* ---------------------------------------------
   STYLES
---------------------------------------------- */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },

  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e4e7f2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Palette.background,
  },
  iconBtn: {
    padding: Spacing.xs,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef1f6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  badge: {
    backgroundColor: "#ECFEFF",
    color: "#0EA5A3",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    fontWeight: "700",
    fontSize: 12,
  },

  headerActions: {
    flexDirection: "row",
    gap: Spacing.xs,
  },

  main: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },

  topicWrap: {
    marginBottom: Spacing.md,
  },
  topic: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: Spacing.xs,
    color: Palette.textDefault,
  },

  card: {
    backgroundColor: Palette.background,
    borderRadius: Radii.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e4e7f2",
    ...Shadow.cardSoft,
  },

  aimCard: {
    backgroundColor: "#F0F9FF",
    borderColor: "#E0F2FE",
  },
  conclusionCard: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E6EEF8",
  },
  memoryCard: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FDE68A",
  },

  section: {
    backgroundColor: Palette.background,
    padding: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e4e7f2",
    marginBottom: Spacing.md,
    ...Shadow.cardSoft,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Palette.textMuted,
    marginBottom: Spacing.xs,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },

  paragraph: {
    color: Palette.textDefault,
    lineHeight: 20,
    marginBottom: Spacing.xs,
    fontSize: 15,
  },
  textItem: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: Spacing.xs,
    color: Palette.textDefault,
  },

  list: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: Spacing.xs,
  },
  bullet: {
    marginRight: Spacing.xs,
    color: Palette.textDefault,
  },
  listText: {
    flex: 1,
    color: Palette.textDefault,
    fontSize: 15,
  },

  memoryVerse: {
    fontStyle: "italic",
    fontSize: 16,
    color: Palette.textDefault,
  },
});
