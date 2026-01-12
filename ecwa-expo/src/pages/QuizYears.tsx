import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, Radii, Shadow } from '@/constants/theme';
import { manualApi, isSubscriptionError } from '@/src/lib/api';
import Toast from 'react-native-toast-message';

const ecwaLogo = require("../assets/ecwa-logo.png");

const QuizYears = () => {
  const router = useRouter();
  const { quizId } = useLocalSearchParams<{ quizId?: string | string[] }>();
  const type = Array.isArray(quizId) ? quizId[0] ?? '' : quizId ?? '';
  const [backPressed, setBackPressed] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const title = type === "sunday-school" ? "Sunday School Quiz" : "Bible Study Quiz";

  useEffect(() => {
    const loadYears = async () => {
      if (!type) return;
      setIsLoading(true);
      try {
        const data = await manualApi.getYears(type);
        setYears(data ?? []);
      } catch (error) {
        if (isSubscriptionError(error)) {
          // Quiz access error - navigate back
          router.back();
          return;
        }
        Toast.show({
          type: "error",
          text1: (error as Error).message || "Failed to load years",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadYears();
  }, [router, type]);

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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Palette.accent} />
            <Text style={styles.loadingText}>Loading years...</Text>
          </View>
        ) : (
          <>
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                style={[styles.yearCard, Shadow.cardSoft]}
                onPress={() =>
                  router.push({
                    pathname: '/quiz-language',
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
            {!isLoading && years.length === 0 && (
              <Text style={styles.emptyText}>No years found.</Text>
            )}
          </>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    color: Palette.textMuted,
  },
  emptyText: {
    textAlign: 'center',
    color: Palette.textMuted,
    fontSize: 14,
    paddingVertical: Spacing.xxl,
  },
});
