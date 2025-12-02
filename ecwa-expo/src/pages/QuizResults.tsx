import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Trophy } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Palette, Spacing, Radii, Shadow } from "@/constants/theme";

const ecwaLogo = require("../assets/ecwa-logo.png");

// --- ROUTE PARAM TYPES ---
type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

type QuizData = {
  title: string;
  questions: QuizQuestion[];
};

const QuizResults = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    type?: string | string[];
    year?: string | string[];
    lessonId?: string | string[];
    answers?: string | string[];
    quiz?: string | string[];
  }>();

  const type = Array.isArray(params.type) ? params.type[0] ?? "" : params.type ?? "";
  const year = Array.isArray(params.year) ? params.year[0] ?? "" : params.year ?? "";
  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] ?? "" : params.lessonId ?? "";

  const answers = useMemo<Record<number, string>>(() => {
    const raw = Array.isArray(params.answers) ? params.answers[0] : params.answers;
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }, [params.answers]);

  const quiz = useMemo<QuizData>(() => {
    const raw = Array.isArray(params.quiz) ? params.quiz[0] : params.quiz;
    if (!raw) {
      return {
        title: "Quiz",
        questions: [],
      };
    }
    try {
      return JSON.parse(raw);
    } catch {
      return {
        title: "Quiz",
        questions: [],
      };
    }
  }, [params.quiz]);

  const total = quiz.questions.length;

  const score = quiz.questions.reduce((count, q, index) => {
    return count + (q.answer === answers[index] ? 1 : 0);
  }, 0);

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;


  const getScoreColor = () => {
    if (percentage >= 80) return "#16a34a"; // green
    if (percentage >= 60) return "#ca8a04"; // yellow
    return "#dc2626"; // red
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return "Excellent!";
    if (percentage >= 60) return "Good job!";
    return "Keep practicing!";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={ecwaLogo} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Quiz Results</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Score Card */}
        <View style={[styles.scoreCard, Shadow.cardSoft]}>
          <View style={[styles.trophyIcon, { backgroundColor: getScoreColor() + "20" }]}>
            <Trophy size={48} color={getScoreColor()} />
          </View>
          <Text style={styles.scoreMessage}>{getScoreMessage()}</Text>
          <Text style={[styles.percentage, { color: getScoreColor() }]}>
            {percentage}%
          </Text>
          <Text style={styles.scoreText}>
            {score} out of {total} correct
          </Text>
        </View>

        {/* Details Card */}
        <View style={[styles.detailsCard, Shadow.cardSoft]}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quiz Type:</Text>
            <Text style={styles.detailValue}>
              {type === "sunday-school" ? "Sunday School Quiz" : "Bible Study Quiz"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lesson:</Text>
            <Text style={styles.detailValue}>Lesson {lessonId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Year:</Text>
            <Text style={styles.detailValue}>{year}</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.button, Shadow.card]}
          onPress={() => router.replace("/(tabs)/dashboard")}
        >
          <Text style={styles.buttonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default QuizResults;

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
    backgroundColor: Palette.background,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  scoreCard: {
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  trophyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  scoreMessage: {
    fontSize: 20,
    fontWeight: "600",
    color: Palette.textDefault,
    marginBottom: Spacing.sm,
  },
  percentage: {
    fontSize: 48,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  scoreText: {
    fontSize: 16,
    color: Palette.textMuted,
  },
  detailsCard: {
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.textMuted,
  },
  detailValue: {
    fontSize: 14,
    color: Palette.textDefault,
    fontWeight: "500",
  },
  button: {
    backgroundColor: Palette.accent,
    padding: Spacing.md,
    borderRadius: Radii.md,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
