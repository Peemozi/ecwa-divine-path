/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Music,
  BookOpen,
  Calendar,
  ChevronRight,
  User,
} from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { userApi, isSubscriptionError } from "@/src/lib/api";
import Toast from "react-native-toast-message";

const ecwaLogo = require("../assets/ecwa-logo.png");

const fallbackWeeklyLesson = {
  number: 46,
  topic: "LOVE OF MONEY: AN END TIME CANKERWORM",
  texts: "2 Timothy 3:1–5, 1 Timothy 6:6–10",
  intro:
    "The love of money is one of the most dangerous spiritual diseases affecting believers today...",
};

const fallbackHymnOfWeek = {
  number: 234,
  title: "Take My Life and Let It Be",
  language: "English",
};

const fallbackNextLesson = {
  number: 50,
  topic: "THE POWER OF FORGIVENESS",
  texts: "Matthew 18:21-35",
};

const quickLinks = [
  {
    title: "Sunday School",
    subtitle: "All Lessons",
    icon: BookOpen,
    bg: "#FFF7E0",
    iconBg: "#FFE9B3",
    route: "/sunday-school" as const,
  },
  {
    title: "Hymn Book",
    subtitle: "EN & YO",
    icon: Music,
    bg: "#E9F1FF",
    iconBg: "#CFE1FF",
    route: "/(tabs)/hymns" as const,
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("Guest");
  const [profilePressed, setProfilePressed] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<any | null>(null);
  const [hymnOfWeek, setHymnOfWeek] = useState<any | null>(null);
  const [nextLesson, setNextLesson] = useState<any | null>(null);
  const [subscription, setSubscription] = useState<{ hasAccess?: boolean } | null>(null);
  const [participation, setParticipation] = useState<{
    read_topics?: number;
    percentage?: number;
    current_week?: number | string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadName = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      const storedEmail = await AsyncStorage.getItem("userEmail");
      setDisplayName(storedName || storedEmail || "Guest");
    };
    loadName();
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const data = await userApi.getDashboard();
        const dash: any = data;
        
        // Backend provides: currentLesson (id, number, topic, texts, intro, weekNumber, year)
        // and nextLesson (id, number, topic, texts)
        // Handle potential field name variations (e.g., bible_text vs texts, title vs topic)
        const currentLessonData = dash.currentLesson ?? null;
        if (currentLessonData) {
          // Normalize field names if needed
          if (!currentLessonData.texts && currentLessonData.bible_text) {
            currentLessonData.texts = currentLessonData.bible_text;
          }
          if (!currentLessonData.topic && currentLessonData.title) {
            currentLessonData.topic = currentLessonData.title;
          }
          if (!currentLessonData.intro && currentLessonData.introduction) {
            currentLessonData.intro = currentLessonData.introduction;
          }
          // Ensure year is set to 2025 for Sunday School (since 2026 manual isn't available yet)
          currentLessonData.year = currentLessonData.year || 2025;
        }
        setCurrentLesson(currentLessonData);
        
        setHymnOfWeek(dash.hymnOfWeek ?? null);
        
        const nextLessonData = dash.nextLesson ?? null;
        if (nextLessonData) {
          // Normalize field names if needed
          if (!nextLessonData.texts && nextLessonData.bible_text) {
            nextLessonData.texts = nextLessonData.bible_text;
          }
          if (!nextLessonData.topic && nextLessonData.title) {
            nextLessonData.topic = nextLessonData.title;
          }
          // Ensure year is set to 2025 for Sunday School
          nextLessonData.year = nextLessonData.year || 2025;
        }
        setNextLesson(nextLessonData);
        setSubscription(dash.user?.subscription ?? null);

        // Refresh stored display name/email if available
        if (dash.user?.name) {
          await AsyncStorage.setItem("userName", dash.user.name);
          setDisplayName(dash.user.name);
        } else if (dash.user?.email) {
          await AsyncStorage.setItem("userEmail", dash.user.email);
          setDisplayName(dash.user.email);
        }

        if (dash.user?.subscription?.hasAccess !== undefined) {
          await AsyncStorage.setItem(
            "sundaySchoolPaid",
            dash.user.subscription.hasAccess ? "true" : "false"
          );
        }
      } catch (error) {
        if (isSubscriptionError(error)) {
          router.replace("/payment");
          return;
        }
        // Show user-friendly error message for server errors
        const apiError = error as any;
        if (apiError?.status === 500) {
          Toast.show({
            type: "error",
            text1: "Server Error",
            text2: "Unable to load dashboard. Please try again later.",
            visibilityTime: 4000,
          });
        }
        // Continue with fallback data (already set in state)
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Use backend data from currentLesson (fields: id, number, topic, texts, intro, weekNumber, year)
  // Only use fallback if backend data is completely missing (null/undefined)
  // Prioritize backend data when available
  const lessonNumber = currentLesson?.number ?? currentLesson?.weekNumber ?? fallbackWeeklyLesson.number;
  const lessonTopic = currentLesson?.topic ?? fallbackWeeklyLesson.topic;
  const lessonTexts = currentLesson?.texts ?? fallbackWeeklyLesson.texts;
  const lessonIntro = currentLesson?.intro ?? fallbackWeeklyLesson.intro;

  const hymnNumber = hymnOfWeek?.number ?? fallbackHymnOfWeek.number;
  const hymnTitle = hymnOfWeek?.title ?? fallbackHymnOfWeek.title;
  const hymnLanguage = hymnOfWeek?.language ?? fallbackHymnOfWeek.language;

  // Use backend data from nextLesson (fields: id, number, topic, texts)
  // Only use fallback if backend data is completely missing (null/undefined)
  // Prioritize backend data when available
  const upcomingNumber = nextLesson?.number ?? fallbackNextLesson.number;
  const upcomingTitle = nextLesson?.topic ?? fallbackNextLesson.topic;
  const upcomingRef = nextLesson?.texts ?? fallbackNextLesson.texts;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={ecwaLogo} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={styles.headerTitle}>ECWA Media Center</Text>
            <Text style={styles.headerSubtitle}>{displayName}</Text>
          </View>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.push("/profile")}
          onPressIn={() => setProfilePressed(true)}
          onPressOut={() => setProfilePressed(false)}
          style={[
            styles.profileButton,
            profilePressed && styles.profileButtonPressed,
          ]}
          activeOpacity={0.7}
        >
          <User
            size={18}
            color={profilePressed ? Palette.accent : Palette.textMuted}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Palette.accent} size="small" />
            <Text style={styles.loadingText}>Updating dashboard...</Text>
          </View>
        )}

        {/* Weekly Lesson Card - Second (matches web) */}
        <TouchableOpacity
          style={styles.lessonCard}
          onPress={async () => {
            const paid = await AsyncStorage.getItem("sundaySchoolPaid");
            const hasPaid = paid === "true" || subscription?.hasAccess === true;
            
            // Prepare navigation params for the lesson
            // Use 'number' (week number) instead of 'id' since the API matches by number
            const year = currentLesson?.year || 2025;
            const language = "english"; // Default to english, or get from backend if available
            // Prioritize number over id, since the API searches by topic.number
            // The dashboard returns 'number' or 'weekNumber' which matches the topic's 'number' field
            const lessonId = currentLesson?.number || currentLesson?.weekNumber || lessonNumber;
            
            // Store the intended destination before navigating
            const navigationParams = {
              pathname: "/(tabs)/manuals/lesson" as const,
              params: {
                type: "sunday-school",
                year: String(year),
                language: language,
                lessonId: String(lessonId),
              },
            };
            
            if (hasPaid && currentLesson) {
              // User has paid, navigate directly to lesson
              router.push(navigationParams);
            } else {
              // User needs to pay, store destination and go to payment
              await AsyncStorage.setItem(
                "pendingNavigation",
                JSON.stringify(navigationParams)
              );
              router.push("/payment");
            }
          }}
          activeOpacity={0.8}
        >
          <View style={styles.lessonBadges}>
            <Badge text="This Week" />
            <Badge text={`Lesson ${lessonNumber}`} tone="outline" />
          </View>
          <Text style={styles.lessonTitle}>{lessonTopic}</Text>
          <Text style={styles.lessonTexts}>
            <Text style={{ fontWeight: "600" }}>Texts: </Text>
            {lessonTexts}
          </Text>
          {lessonIntro && (
            <Text style={styles.lessonIntro} numberOfLines={6} ellipsizeMode="tail">
              {lessonIntro}
            </Text>
          )}
          <ChevronRight size={20} color={Palette.textMuted} />
        </TouchableOpacity>

        {/* Hymn of the Week - Third (matches web) */}
        <TouchableOpacity
          style={styles.hymnCard}
          onPress={() => {
            // Use the hymn ID from backend if available, otherwise use number
            // The API expects the hymn ID, not the display number
            const hymnId = hymnOfWeek?.id || hymnNumber;
            router.push({
              pathname: "/hymn-detail",
              params: { id: String(hymnId) },
            });
          }}
          activeOpacity={0.8}
        >
          <View style={styles.hymnIcon}>
            <Music size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.hymnLabel}>HYMN OF THE WEEK</Text>
            <Text style={styles.hymnTitle}>{hymnTitle}</Text>
            <Text style={styles.hymnMeta}>
              Hymn #{hymnNumber} • {hymnLanguage}
            </Text>
          </View>
          <ChevronRight size={20} color="#194185" />
        </TouchableOpacity>

        {/* Quick Links (unchanged) */}
        <View style={styles.quickLinkRow}>
          {quickLinks.map((link) => (
            <TouchableOpacity
              key={link.title}
              style={[styles.quickLinkCard, { backgroundColor: link.bg }]}
              onPress={() => router.push(link.route)}
              activeOpacity={0.8}
            >
              <View
                style={[styles.quickIcon, { backgroundColor: link.iconBg }]}
              >
                <link.icon size={22} color={Palette.accent} />
              </View>
              <Text style={styles.quickTitle}>{link.title}</Text>
              <Text style={styles.quickSubtitle}>{link.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Events - Last (matches web) */}
        <SectionHeader icon={Calendar} label="Upcoming" />
        <TouchableOpacity
          style={styles.upcomingCard}
          onPress={async () => {
            const paid = await AsyncStorage.getItem("sundaySchoolPaid");
            const hasPaid = paid === "true" || subscription?.hasAccess === true;
            
            // Prepare navigation params for the next lesson
            const year = nextLesson?.year || 2025;
            const language = "english"; // Default to english, or get from backend if available
            // Prioritize number over id, since the API searches by topic.number
            const lessonId = nextLesson?.number || nextLesson?.weekNumber || upcomingNumber;
            
            // Store the intended destination before navigating
            const navigationParams = {
              pathname: "/(tabs)/manuals/lesson" as const,
              params: {
                type: "sunday-school",
                year: String(year),
                language: language,
                lessonId: String(lessonId),
              },
            };
            
            if (hasPaid && nextLesson) {
              // User has paid, navigate directly to lesson
              router.push(navigationParams);
            } else {
              // User needs to pay, store destination and go to payment
              await AsyncStorage.setItem(
                "pendingNavigation",
                JSON.stringify(navigationParams)
              );
              router.push("/payment");
            }
          }}
          activeOpacity={0.8}
        >
          {upcomingNumber && (
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingBadgeText}>{upcomingNumber}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.upcomingCaption}>Next Week's Lesson</Text>
            <Text style={styles.upcomingTitle}>{upcomingTitle}</Text>
            {upcomingRef && <Text style={styles.upcomingRef}>{upcomingRef}</Text>}
          </View>
          <ChevronRight size={20} color={Palette.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const SectionHeader = ({
  icon: Icon,
  label,
}: {
  icon: typeof Calendar;
  label: string;
}) => (
  <View style={styles.sectionHeader}>
    <Icon size={18} color={Palette.textDefault} />
    <Text style={styles.sectionHeaderText}>{label}</Text>
  </View>
);

const Badge = ({
  text,
  tone = "solid",
}: {
  text: string;
  tone?: "solid" | "outline";
}) => (
  <View
    style={[
      styles.badge,
      tone === "outline" && {
        backgroundColor: "transparent",
        borderColor: "#d6c79b",
        borderWidth: 1,
      },
    ]}
  >
    <Text
      style={[
        styles.badgeText,
        tone === "outline" && { color: Palette.textDefault },
      ]}
    >
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#eceff5",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  profileButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f0f2f8",
    alignItems: "center",
    justifyContent: "center",
  },
  profileButtonPressed: {
    backgroundColor: "#e0e7ff",
  },
  logo: {
    width: 42,
    height: 42,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingBottom: 40, // Minimal padding for bottom tab clearance
    gap: Spacing.lg,
  },
  quickLinkRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  quickLinkCard: {
    flex: 1,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  quickSubtitle: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  upcomingCard: {
    backgroundColor: "#fff",
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: "row",
    gap: Spacing.md,
    alignItems: "center",
    ...Shadow.card,
    marginBottom: 0, // Remove any extra margin
  },
  upcomingBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#e7ecff",
    alignItems: "center",
    justifyContent: "center",
  },
  upcomingBadgeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2846c7",
  },
  upcomingCaption: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  upcomingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  upcomingRef: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  lessonCard: {
    backgroundColor: "#fff5de",
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadow.cardSoft,
  },
  lessonBadges: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  badge: {
    borderRadius: 999,
    backgroundColor: "#f1d79d",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5a4105",
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  lessonTexts: {
    fontSize: 13,
    color: Palette.textMuted,
  },
  lessonIntro: {
    fontSize: 14,
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  hymnCard: {
    backgroundColor: "#103d91",
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  hymnIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#0b2f70",
    alignItems: "center",
    justifyContent: "center",
  },
  hymnLabel: {
    fontSize: 12,
    color: "#c7d7ff",
    letterSpacing: 0.8,
  },
  hymnTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  hymnMeta: {
    fontSize: 13,
    color: "#c7d7ff",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  loadingText: {
    color: Palette.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
});
