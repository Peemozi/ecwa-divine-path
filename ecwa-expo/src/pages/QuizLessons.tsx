import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import { ArrowLeft, Search, Trophy } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, Radii, Shadow } from '@/constants/theme';

const ecwaLogo = require("../assets/ecwa-logo.png");

type Lesson = {
  id: string;
  title: string;
  topic: string;
};

const QuizLessons = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string | string[]; year?: string | string[] }>();
  const type = Array.isArray(params.type) ? params.type[0] ?? '' : params.type ?? '';
  const year = Array.isArray(params.year) ? params.year[0] ?? '' : params.year ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const [backPressed, setBackPressed] = useState(false);

  const lessons: Lesson[] = [
    { id: '1', title: 'Lesson 1 - Faith & Foundation', topic: 'Understanding the basics of faith' },
    { id: '2', title: 'Lesson 2 - Prayer & Power', topic: 'Building a strong prayer life' },
    { id: '3', title: 'Lesson 3 - Spiritual Growth', topic: 'Steps to grow spiritually' },
    { id: '4', title: 'Lesson 4 - Holiness & Purity', topic: 'Walking in righteousness' },
    { id: '5', title: 'Lesson 5 - Purpose & Calling', topic: 'Discovering God\'s plan' },
  ];

  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const title = type === "sunday-school" ? "Sunday School Quiz" : "Bible Study Quiz";

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
            <Text style={styles.headerTitleText}>{title}</Text>
            <Text style={styles.headerSubtitle}>Year {year}</Text>
          </View>
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Palette.textMuted} />
          <TextInput
            placeholder="Search lesson..."
            placeholderTextColor={Palette.textMuted}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {filteredLessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            onPress={() =>
              router.push({
                pathname: '/quiz-questions',
                params: {
                  type,
                  year,
                  lessonId: lesson.id,
                  lessonTitle: lesson.title,
                },
              })
            }
            style={[styles.card, Shadow.cardSoft]}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <Trophy size={24} color={Palette.accent} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{lesson.title}</Text>
                <Text style={styles.cardSubtitle}>{lesson.topic}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  headerTitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.textDefault,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.background,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.canvas,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    height: 42,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
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
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: Palette.background,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F7FA',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Palette.textMuted,
  },
});

export default QuizLessons;
