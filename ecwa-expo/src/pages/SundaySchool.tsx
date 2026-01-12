import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ChevronRight, Search, Lock } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { userApi, isSubscriptionError } from "@/src/lib/api";

type Lesson = {
  id: number;
  number: number;
  topic: string;
  texts: string;
  isCurrentWeek: boolean;
};

const mockLessons: Lesson[] = [
  { id: 1, number: 1, topic: "Love of Money: An End-Time Cankerworm", texts: "1 Timothy 6:6–10, 2 Timothy 3:1–5", isCurrentWeek: true },
  { id: 2, number: 2, topic: "Faithfulness in a Corrupt World", texts: "Daniel 6:1-10, Proverbs 28:20", isCurrentWeek: false },
  { id: 3, number: 3, topic: "Living by the Spirit", texts: "Galatians 5:16-25, Romans 8:1-14", isCurrentWeek: false },
  { id: 4, number: 4, topic: "Christian Conduct in the Last Days", texts: "2 Timothy 3:1-5, 1 Peter 4:7-11", isCurrentWeek: false },
  { id: 5, number: 5, topic: "The Power of Prayer", texts: "James 5:13-18, Matthew 7:7-11", isCurrentWeek: false },
  { id: 6, number: 6, topic: "Walking in Holiness", texts: "1 Peter 1:13-16, Hebrews 12:14", isCurrentWeek: false },
  { id: 7, number: 7, topic: "Stewardship and Responsibility", texts: "Matthew 25:14-30, Luke 12:42-48", isCurrentWeek: false },
  { id: 8, number: 8, topic: "Overcoming Temptation", texts: "1 Corinthians 10:13, James 1:12-15", isCurrentWeek: false },
  { id: 9, number: 9, topic: "Spiritual Growth and Maturity", texts: "2 Peter 3:18, Ephesians 4:11-16", isCurrentWeek: false },
  { id: 10, number: 10, topic: "The Believer's Hope in Christ", texts: "1 Peter 1:3-9, Romans 8:18-25", isCurrentWeek: false },
];

const SundaySchool: React.FC = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [hasPaidAccess, setHasPaidAccess] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);

  // Check payment status on mount and when screen is focused
  const checkPayment = async () => {
    setIsCheckingPayment(true);
    try {
      // Prefer live subscription status from backend
      const dash: any = await userApi.getDashboard();
      const hasAccess = dash?.user?.subscription?.hasAccess === true;
      setHasPaidAccess(hasAccess);
      await AsyncStorage.setItem("sundaySchoolPaid", hasAccess ? "true" : "false");
    } catch (error) {
      if (isSubscriptionError(error)) {
        setHasPaidAccess(false);
        await AsyncStorage.setItem("sundaySchoolPaid", "false");
        // Allow browsing, payment check happens at manual selection
      }
      setHasPaidAccess(false);
      await AsyncStorage.setItem("sundaySchoolPaid", "false");
    } finally {
      setIsCheckingPayment(false);
    }
  };

  useEffect(() => {
    checkPayment();
  }, []);

  // Refresh payment status when screen is focused (e.g., after returning from payment)
  useFocusEffect(
    React.useCallback(() => {
      checkPayment();
    }, [])
  );

  const filteredLessons = mockLessons.filter((lesson) =>
    lesson.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.texts.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLessonPress = (lesson: Lesson) => {
    router.push({
      pathname: "/sunday-school-lesson",
      params: { lessonId: String(lesson.id) },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/(tabs)/dashboard")} style={styles.iconBtn}>
          <ArrowLeft size={22} />
        </Pressable>

        <Text style={styles.headerTitle}>Sunday School</Text>

        {hasPaidAccess ? (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        ) : (
          <View style={{ width: 56 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.main}>
        {isCheckingPayment ? (
          <View style={styles.lockCard}>
            <Text style={styles.lockDesc}>Loading...</Text>
          </View>
        ) : !hasPaidAccess ? (
          <View style={styles.lockCard}>
            <Lock size={44} color="#3B82F6" style={{ marginBottom: 12 }} />
            <Text style={styles.lockTitle}>Unlock All Lessons</Text>
            <Text style={styles.lockDesc}>
              Get full access to all Sunday School lessons and study materials.
            </Text>

            <Pressable style={styles.buyBtn} onPress={() => router.push("/(tabs)/manuals")}>
              <Text style={styles.buyBtnText}>Browse Manuals</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Search */}
            <View style={styles.searchWrap}>
              <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                placeholder="Search lessons..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </View>

            <Text style={styles.sectionTitle}>
              {searchQuery ? `SEARCH RESULTS (${filteredLessons.length})` : "ALL LESSONS"}
            </Text>

            {filteredLessons.length === 0 ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No lessons found matching your search</Text>
              </View>
            ) : (
              filteredLessons.map((lesson) => (
                <Pressable
                  key={lesson.id}
                  style={[styles.lessonCard, lesson.isCurrentWeek && styles.currentCard]}
                  onPress={() => handleLessonPress(lesson)}
                >
                  <View style={styles.leftCircle}>
                    <Text style={styles.leftNumber}>{lesson.number}</Text>
                  </View>

                  <View style={styles.lessonBody}>
                    {lesson.isCurrentWeek && (
                      <View style={styles.thisWeek}>
                        <Text style={styles.thisWeekText}>This Week</Text>
                      </View>
                    )}
                    <Text style={styles.lessonTitle}>{lesson.topic}</Text>
                    <Text style={styles.lessonSub}>{lesson.texts}</Text>
                  </View>

                  <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SundaySchool;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "space-between",
  },
  iconBtn: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  premiumBadge: {
    backgroundColor: "#ECFEFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  premiumText: { color: "#0EA5A3", fontWeight: "700" },

  main: { padding: 16, paddingBottom: 120 },

  lockCard: {
    backgroundColor: "#EFF6FF",
    padding: 22,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 36,
  },
  lockTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  lockDesc: { color: "#6B7280", textAlign: "center", marginBottom: 16 },

  buyBtn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buyBtnText: { color: "#fff", fontWeight: "700" },

  searchWrap: { marginBottom: 14, position: "relative" },
  searchIcon: { position: "absolute", left: 12, top: 11 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingLeft: 40,
    paddingVertical: 10,
    borderRadius: 10,
    color: "#111827",
  },

  sectionTitle: { fontSize: 13, fontWeight: "700", color: "#6B7280", marginBottom: 10 },

  noResults: { padding: 20, alignItems: "center" },
  noResultsText: { color: "#9CA3AF" },

  lessonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  currentCard: { backgroundColor: "#F0FDFA", borderColor: "#BBF7D0" },

  leftCircle: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  leftNumber: { fontWeight: "800", fontSize: 18, color: "#4338CA" },

  lessonBody: { flex: 1, marginLeft: 12 },
  thisWeek: { alignSelf: "flex-start", backgroundColor: "#DCFCE7", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 6 },
  thisWeekText: { color: "#064E3B", fontWeight: "700", fontSize: 11 },

  lessonTitle: { fontWeight: "700", fontSize: 15, marginBottom: 4 },
  lessonSub: { color: "#6B7280", fontSize: 13 },
});
