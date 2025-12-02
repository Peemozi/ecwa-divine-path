import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, Radii, Shadow } from '@/constants/theme';

const ecwaLogo = require("../assets/ecwa-logo.png");

const QuizYears = () => {
  const router = useRouter();
  const { quizId } = useLocalSearchParams<{ quizId?: string | string[] }>();
  const type = Array.isArray(quizId) ? quizId[0] ?? '' : quizId ?? '';
  const [backPressed, setBackPressed] = useState(false);

  const years = [2021, 2022, 2023, 2024, 2025, 2026];
  const title = type === "sunday-school" ? "Sunday School Quiz" : "Bible Study Quiz";

  return (
    <View style={styles.container}>
      {/* Header */}
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
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>

      {/* Years List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {years.map((year) => (
          <TouchableOpacity
            key={year}
            style={[styles.yearCard, Shadow.cardSoft]}
            onPress={() =>
              router.push({
                pathname: '/quiz-lessons',
                params: { type, year: String(year) },
              })
            }
            activeOpacity={0.8}
          >
            <View style={styles.yearIconBg}>
              <Calendar size={24} color={Palette.accent} />
            </View>
            <View style={styles.yearContent}>
              <Text style={styles.yearText}>{year}</Text>
              <Text style={styles.yearSubtext}>{title} {year}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default QuizYears;

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
    fontSize: 20,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  yearCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  yearIconBg: {
    height: 48,
    width: 48,
    borderRadius: Radii.md,
    backgroundColor: "#E0F7FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  yearContent: {
    flex: 1,
  },
  yearText: {
    fontSize: 18,
    fontWeight: "600",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  yearSubtext: {
    fontSize: 14,
    color: Palette.textMuted,
  },
});
