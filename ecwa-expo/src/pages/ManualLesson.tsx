import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

const ManualLesson = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    type?: string | string[];
    year?: string | string[];
    language?: string | string[];
    lessonId?: string | string[];
  }>();
  const type = Array.isArray(params.type) ? params.type[0] ?? "sunday-school" : params.type ?? "sunday-school";
  const year = Array.isArray(params.year) ? params.year[0] ?? `${new Date().getFullYear()}` : params.year ?? `${new Date().getFullYear()}`;
  const language = Array.isArray(params.language) ? params.language[0] ?? "english" : params.language ?? "english";
  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] ?? "1" : params.lessonId ?? "1";

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [backPressed, setBackPressed] = useState(false);

  // Mock data — replace with API later
  const lesson = {
    number: lessonId,
    topic: "LOVE OF MONEY: AN END TIME CANKERWORM",
    texts: "2 Timothy 3:1–5, 1 Timothy 6:6–10",
    aim: "To help believers understand the dangers of the love of money and to encourage them to pursue godliness with contentment.",
    introduction:
      "The love of money is one of the most dangerous spiritual diseases affecting believers today. It has led many astray from the faith and caused them untold suffering.",
    sections: [
      {
        title: "THE NATURE OF THE LOVE OF MONEY",
        points: [
          {
            label: "A",
            content: "It is a root of all kinds of evil (1 Timothy 6:10)",
          },
          { label: "B", content: "It causes people to wander from the faith" },
        ],
      },
      {
        title: "BIBLICAL WARNINGS AGAINST THE LOVE OF MONEY",
        points: [
          {
            label: "A",
            content: "Jesus warned about serving two masters (Matthew 6:24)",
          },
          {
            label: "B",
            content: "Paul's instructions to Timothy about contentment",
          },
        ],
      },
    ],
    conclusion:
      "Believers must guard their hearts against the love of money and instead pursue godliness with contentment, trusting in God's provision.",
    memoryVerse:
      "For the love of money is the root of all evil... - 1 Timothy 6:10",
  };

  const title =
    type === "sunday-school" ? "Sunday School Manual" : "Bible Study Manual";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          onPressIn={() => setBackPressed(true)}
          onPressOut={() => setBackPressed(false)}
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={20}
            color={backPressed ? Palette.accent : Palette.textDefault}
          />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>
            {title} {year}
          </Text>

          <Text style={styles.headerSubtitle}>
            Lesson {lesson.number}
          </Text>

          {/* LANGUAGE USED HERE */}
          <Text style={styles.headerSubtitleLanguage}>
            {language === "english" ? "English Version" : "Yoruba Version"}
          </Text>
        </View>

        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <Share2 size={20} color={Palette.textDefault} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsBookmarked(!isBookmarked)}
          activeOpacity={0.7}
        >
          <Bookmark
            size={20}
            color={Palette.textDefault}
            fill={isBookmarked ? Palette.accent : "none"}
          />
        </TouchableOpacity>
      </View>

      {/* LESSON BODY */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* TOPIC CARD */}
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Lesson {lesson.number}</Text>
            </View>

            <Text style={styles.topicTitle}>
              {lesson.topic}
            </Text>

            <Text style={styles.texts}>
              <Text style={styles.textsLabel}>Texts:</Text> {lesson.texts}
            </Text>
          </View>

          {/* AIM */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Aim
            </Text>
            <Text style={styles.sectionContent}>
              {lesson.aim}
            </Text>
          </View>

          {/* INTRODUCTION */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Introduction
            </Text>
            <Text style={styles.sectionContent}>
              {lesson.introduction}
            </Text>
          </View>

          {/* SECTIONS */}
          {lesson.sections.map((section, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.sectionTitle}>
                {section.title}
              </Text>

              <View style={styles.pointsContainer}>
                {section.points.map((point, pIdx) => (
                  <Text key={pIdx} style={styles.point}>
                    <Text style={styles.pointLabel}>{point.label}.</Text>{" "}
                    {point.content}
                  </Text>
                ))}
              </View>
            </View>
          ))}

          {/* CONCLUSION */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Conclusion
            </Text>
            <Text style={styles.sectionContent}>
              {lesson.conclusion}
            </Text>
          </View>

          {/* MEMORY VERSE */}
          <View style={[styles.card, styles.memoryVerseCard]}>
            <Text style={styles.memoryVerseTitle}>
              Memory Verse
            </Text>
            <Text style={styles.memoryVerseText}>
              {lesson.memoryVerse}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e4e7f2",
    backgroundColor: Palette.background,
  },
  headerButton: {
    padding: Spacing.xs,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef1f6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitleText: {
    fontSize: 14,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 2,
  },
  headerSubtitleLanguage: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
    gap: Spacing.lg,
  },
  card: {
    borderRadius: Radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e4e7f2",
    padding: Spacing.lg,
    backgroundColor: Palette.background,
    ...Shadow.cardSoft,
  },
  badge: {
    alignSelf: "flex-start",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.textMuted,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    fontSize: 12,
    color: Palette.textMuted,
    fontWeight: "600",
  },
  topicTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    color: Palette.textDefault,
  },
  texts: {
    fontSize: 14,
    color: Palette.textMuted,
  },
  textsLabel: {
    fontWeight: "600",
    color: Palette.textDefault,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: Spacing.md,
    color: Palette.textDefault,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: Palette.textDefault,
  },
  pointsContainer: {
    gap: Spacing.md,
  },
  point: {
    fontSize: 16,
    lineHeight: 24,
    color: Palette.textDefault,
  },
  pointLabel: {
    fontWeight: "700",
    color: Palette.accent,
  },
  memoryVerseCard: {
    backgroundColor: "#f0f9ff",
    borderColor: "#bae6fd",
  },
  memoryVerseTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: Spacing.md,
    color: "#0369a1",
  },
  memoryVerseText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
    color: Palette.textDefault,
  },
});

export default ManualLesson;
