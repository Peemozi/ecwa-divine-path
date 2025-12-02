import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { ArrowLeft, CheckCircle2 } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Palette, Spacing, Radii, Shadow } from "@/constants/theme";

const ecwaLogo = require("../assets/ecwa-logo.png");

const QuizQuestions = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string | string[]; year?: string | string[]; lessonId?: string | string[] }>();
  const type = Array.isArray(params.type) ? params.type[0] : params.type;
  const year = Array.isArray(params.year) ? params.year[0] : params.year;
  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [backPressed, setBackPressed] = useState(false);

  // Mock Quiz Data (Replace with API later)
  const quiz = {
    lessonNumber: lessonId,
    lessonTopic: "LOVE OF MONEY: AN END TIME CANKERWORM",
    questions: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      question: `Question ${i + 1}: What is the main point discussed in this lesson?`,
      options: [
        "Option A: The love of money is the root of all evil",
        "Option B: Money itself is evil",
        "Option C: Rich people cannot enter heaven",
        "Option D: Poverty is a virtue",
      ],
      correctAnswer: "A",
    })),
  };

  const currentQ = quiz.questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswer = (letter: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: letter }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    router.push({
      pathname: "/quiz-results",
      params: {
        type: type ?? "",
        year: year ?? "",
        lessonId: lessonId ?? "",
        answers: JSON.stringify(answers),
        quiz: JSON.stringify(quiz),
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          onPressIn={() => setBackPressed(true)}
          onPressOut={() => setBackPressed(false)}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={24}
            color={backPressed ? Palette.accent : Palette.textDefault}
          />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Image source={ecwaLogo} style={styles.headerLogo} resizeMode="contain" />
          <View>
            <Text style={styles.headerTitle}>Lesson {quiz.lessonNumber} Quiz</Text>
            <Text style={styles.subHeader}>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </Text>
          </View>
        </View>
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressWrapper}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* QUESTION CARD */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Question {currentQ.id}</Text>
          </View>
          <Text style={styles.questionText}>{currentQ.question}</Text>

          <View style={styles.optionsContainer}>
            {currentQ.options.map((opt, index) => {
              const letter = opt.split(":")[0].replace("Option ", "");
              const isSelected = selectedAnswer === letter;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionSelected,
                  ]}
                  onPress={() => handleAnswer(letter)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.circle,
                      isSelected && styles.circleSelected,
                    ]}
                  >
                    {isSelected ? (
                      <CheckCircle2 size={20} color="#fff" />
                    ) : (
                      <Text style={styles.circleText}>{letter}</Text>
                    )}
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {opt.split(": ")[1]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* NAV BUTTONS */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnSecondary, currentQuestion === 0 && styles.disabled]}
            onPress={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <Text style={[styles.navText, styles.navTextSecondary]}>Previous</Text>
          </TouchableOpacity>

          {currentQuestion < quiz.questions.length - 1 ? (
            <TouchableOpacity
              style={[styles.navBtn, !selectedAnswer && styles.disabled]}
              onPress={handleNext}
              disabled={!selectedAnswer}
            >
              <Text style={styles.navText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.navBtn,
                Object.keys(answers).length !== quiz.questions.length &&
                  styles.disabled,
              ]}
              onPress={handleSubmit}
              disabled={
                Object.keys(answers).length !== quiz.questions.length
              }
            >
              <Text style={styles.navText}>Submit Quiz</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default QuizQuestions;

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
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: Palette.background,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  subHeader: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  progressWrapper: {
    height: 4,
    backgroundColor: "#e5e7eb",
    width: "100%",
  },
  progressBar: {
    height: 4,
    backgroundColor: Palette.accent,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  card: {
    padding: Spacing.lg,
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  badge: {
    backgroundColor: "#E0F7FA",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.md,
    alignSelf: "flex-start",
    marginBottom: Spacing.md,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Palette.accent,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: Palette.textDefault,
    marginBottom: Spacing.lg,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionCard: {
    padding: Spacing.md,
    borderRadius: Radii.md,
    backgroundColor: Palette.canvas,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  optionSelected: {
    borderColor: Palette.accent,
    borderWidth: 2,
    backgroundColor: "#E0F7FA",
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  circleSelected: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },
  circleText: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.textMuted,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: Palette.textDefault,
  },
  optionTextSelected: {
    fontWeight: "600",
  },
  navRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  navBtn: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Palette.accent,
    borderRadius: Radii.md,
    alignItems: "center",
  },
  navBtnSecondary: {
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  navText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  navTextSecondary: {
    color: Palette.textDefault,
  },
  disabled: {
    opacity: 0.5,
  },
});
