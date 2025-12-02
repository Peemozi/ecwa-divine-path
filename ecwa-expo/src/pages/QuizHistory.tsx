import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, Trophy, Calendar, Target, RotateCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Palette, Spacing, Radii, Shadow } from '@/constants/theme';

const ecwaLogo = require("../assets/ecwa-logo.png");

interface QuizAttempt {
  id: string;
  type: string;
  year: string;
  lessonId: string;
  lessonTitle: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

const QuizHistory = () => {
  const router = useRouter();
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [backPressed, setBackPressed] = useState(false);

  useEffect(() => {
    loadQuizHistory();
  }, []);

  const loadQuizHistory = async () => {
    try {
      const raw = await AsyncStorage.getItem('quizHistory');
      if (!raw) return;
      const parsed: QuizAttempt[] = JSON.parse(raw);
      setQuizHistory(parsed);
    } catch (err) {
      console.error('Error loading quiz history:', err);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return '#16a34a';
    if (percentage >= 60) return '#ca8a04';
    return '#dc2626';
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const averageScore =
    quizHistory.length > 0
      ? Math.round(quizHistory.reduce((acc, q) => acc + q.percentage, 0) / quizHistory.length)
      : 0;

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
          <Text style={styles.headerTitle}>Quiz History</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {quizHistory.length === 0 ? (
          <View style={[styles.card, styles.emptyCard, Shadow.cardSoft]}>
            <View style={styles.emptyIconContainer}>
              <Trophy size={32} color={Palette.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Quiz History Yet</Text>
            <Text style={styles.emptyDescription}>
              Start taking quizzes to see your progress here
            </Text>
            <TouchableOpacity
              style={[styles.button, Shadow.card]}
              onPress={() => router.push('/quiz')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Take a Quiz</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Stats */}
            <View style={[styles.card, Shadow.cardSoft]}>
              <Text style={styles.cardTitle}>Your Stats</Text>
              <View style={styles.statsGrid}>
                <View style={[styles.statBox, { backgroundColor: '#E0F7FA' }]}>
                  <Target size={24} color={Palette.accent} />
                  <Text style={styles.statValue}>{quizHistory.length}</Text>
                  <Text style={styles.statLabel}>Quizzes Taken</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#FFF7E0' }]}>
                  <Trophy size={24} color={Palette.accent} />
                  <Text style={styles.statValue}>{averageScore}%</Text>
                  <Text style={styles.statLabel}>Average Score</Text>
                </View>
              </View>
            </View>

            {/* Attempts */}
            {quizHistory
              .slice()
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((attempt) => (
                <View key={attempt.id} style={[styles.card, styles.attemptCard, Shadow.cardSoft]}>
                  <View style={styles.attemptHeader}>
                    <View style={styles.attemptInfo}>
                      <View style={styles.badges}>
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>
                            {attempt.type === 'sunday-school' ? 'Sunday School' : 'Bible Study'}
                          </Text>
                        </View>
                        <View style={[styles.badge, styles.badgeSecondary]}>
                          <Text style={[styles.badgeText, styles.badgeTextSecondary]}>{attempt.year}</Text>
                        </View>
                      </View>
                      <Text style={styles.attemptTitle}>{attempt.lessonTitle}</Text>
                      <View style={styles.dateContainer}>
                        <Calendar size={12} color={Palette.textMuted} />
                        <Text style={styles.dateText}>{formatDate(attempt.date)}</Text>
                      </View>
                    </View>
                    <View style={styles.scoreContainer}>
                      <View
                        style={[
                          styles.scoreBadge,
                          {
                            backgroundColor:
                              attempt.percentage >= 80
                                ? '#16a34a'
                                : attempt.percentage >= 60
                                ? '#ca8a04'
                                : '#dc2626',
                          },
                        ]}
                      >
                        <Text style={styles.scoreBadgeText}>{attempt.percentage}%</Text>
                      </View>
                      <Text style={[styles.scoreValue, { color: getScoreColor(attempt.percentage) }]}>
                        {attempt.score}/{attempt.total}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.retakeButton}
                    onPress={() =>
                      router.push({
                        pathname: '/quiz-questions',
                        params: {
                          type: attempt.type,
                          year: attempt.year,
                          lessonId: attempt.lessonId,
                        },
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <RotateCcw size={16} color={Palette.textDefault} />
                    <Text style={styles.retakeButtonText}>Retake Quiz</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.background,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.textDefault,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  card: {
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Palette.textDefault,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: 14,
    color: Palette.textMuted,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Palette.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textDefault,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statBox: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radii.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Palette.textDefault,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: Spacing.xs,
  },
  attemptCard: {
    gap: Spacing.md,
  },
  attemptHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  attemptInfo: {
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  badge: {
    borderWidth: 1,
    borderColor: '#d4d4d8',
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  badgeSecondary: {
    backgroundColor: Palette.canvas,
    borderColor: 'transparent',
  },
  badgeText: {
    fontSize: 12,
    color: Palette.textDefault,
  },
  badgeTextSecondary: {
    color: Palette.textMuted,
  },
  attemptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateText: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.md,
    marginBottom: Spacing.xs,
  },
  scoreBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: Radii.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textDefault,
  },
});

export default QuizHistory;
