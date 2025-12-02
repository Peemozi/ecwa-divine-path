/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Book,
  Music,
  BookOpen,
  Calendar,
  ChevronRight,
  User,
} from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

const ecwaLogo = require("../assets/ecwa-logo.png");

const weeklyLesson = {
  number: 46,
  topic: "LOVE OF MONEY: AN END TIME CANKERWORM",
  texts: "2 Timothy 3:1–5, 1 Timothy 6:6–10",
  intro:
    "The love of money is one of the most dangerous spiritual diseases affecting believers today...",
};

const verseOfWeek = {
  reference: "1 Timothy 6:10",
  text: `"For the love of money is the root of all evil: which while some coveted after, they have erred from the faith, and pierced themselves through with many sorrows."`,
};

const hymnOfWeek = {
  number: 234,
  title: "Take My Life and Let It Be",
  language: "English",
};

const upcoming = {
  lessonNumber: 50,
  title: "THE POWER OF FORGIVENESS",
  reference: "Matthew 18:21-35",
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
  const userEmail = "Guest";
  const [profilePressed, setProfilePressed] = useState(false);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={ecwaLogo} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={styles.headerTitle}>ECWA Divine Path</Text>
            <Text style={styles.headerSubtitle}>{userEmail}</Text>
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
        {/* Verse of the Week - First (matches web) */}
        <View style={styles.verseCard}>
          <View style={styles.verseIcon}>
            <Book size={18} color={Palette.accent} />
          </View>
          <Text style={styles.verseLabel}>VERSE OF THE WEEK</Text>
          <Text style={styles.verseText}>{verseOfWeek.text}</Text>
          <Text style={styles.verseReference}>{verseOfWeek.reference}</Text>
        </View>

        {/* Weekly Lesson Card - Second (matches web) */}
        <TouchableOpacity
          style={styles.lessonCard}
          onPress={async () => {
            const paid = await AsyncStorage.getItem("sundaySchoolPaid");
            const hasPaid = paid === "true";
            router.push(hasPaid ? "/sunday-school-years" : "/sunday-school");
          }}
          activeOpacity={0.8}
        >
          <View style={styles.lessonBadges}>
            <Badge text="This Week" />
            <Badge text={`Lesson ${weeklyLesson.number}`} tone="outline" />
          </View>
          <Text style={styles.lessonTitle}>{weeklyLesson.topic}</Text>
          <Text style={styles.lessonTexts}>
            <Text style={{ fontWeight: "600" }}>Texts: </Text>
            {weeklyLesson.texts}
          </Text>
          <Text style={styles.lessonIntro}>{weeklyLesson.intro}</Text>
          <ChevronRight size={20} color={Palette.textMuted} />
        </TouchableOpacity>

        {/* Hymn of the Week - Third (matches web) */}
        <TouchableOpacity
          style={styles.hymnCard}
          onPress={() =>
            router.push({
              pathname: "/hymn-detail",
              params: { id: String(hymnOfWeek.number) },
            })
          }
          activeOpacity={0.8}
        >
          <View style={styles.hymnIcon}>
            <Music size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.hymnLabel}>HYMN OF THE WEEK</Text>
            <Text style={styles.hymnTitle}>{hymnOfWeek.title}</Text>
            <Text style={styles.hymnMeta}>
              Hymn #{hymnOfWeek.number} • {hymnOfWeek.language}
            </Text>
          </View>
          <ChevronRight size={20} color="#194185" />
        </TouchableOpacity>

        {/* Quick Links - Fourth (matches web) */}
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
        <View style={styles.upcomingCard}>
          <View style={styles.upcomingBadge}>
            <Text style={styles.upcomingBadgeText}>{upcoming.lessonNumber}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.upcomingCaption}>Next Week's Lesson</Text>
            <Text style={styles.upcomingTitle}>{upcoming.title}</Text>
            <Text style={styles.upcomingRef}>{upcoming.reference}</Text>
          </View>
        </View>
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
  verseCard: {
    backgroundColor: "#f0f4ff",
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    ...Shadow.cardSoft,
  },
  verseIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e0e9ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  verseLabel: {
    fontSize: 12,
    letterSpacing: 0.8,
    fontWeight: "600",
    color: Palette.textMuted,
    marginBottom: Spacing.xs,
  },
  verseText: {
    fontSize: 15,
    fontStyle: "italic",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  verseReference: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.accent,
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
});
