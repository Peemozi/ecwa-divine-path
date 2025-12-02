// src/assets/pages/Manuals.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, BookOpen, GraduationCap } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

const manuals = [
  {
    id: "sunday-school",
    title: "Sunday School",
    subtitle: "Weekly lessons & devotionals",
    icon: BookOpen,
    card: "#fff8e8",
    iconBg: "#ffe3ad",
  },
  {
    id: "bible-study",
    title: "Bible Study",
    subtitle: "Dig deeper into scripture",
    icon: GraduationCap,
    card: "#edf4ff",
    iconBg: "#cfe0ff",
  },
];

export default function Manuals() {
  const router = useRouter();
  const [backPressed, setBackPressed] = useState(false);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          onPressIn={() => setBackPressed(true)}
          onPressOut={() => setBackPressed(false)}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={20}
            color={backPressed ? Palette.accent : Palette.textDefault}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manuals</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {manuals.map((manual) => {
          const Icon = manual.icon;
          return (
            <TouchableOpacity
              key={manual.id}
              style={[styles.card, { backgroundColor: manual.card }]}
              onPress={() =>
                router.push({
                  pathname: "/manual-years",
                  params: { type: manual.id },
                })
              }
            >
              <View
                style={[styles.iconWrap, { backgroundColor: manual.iconBg }]}
              >
                <Icon size={26} color={Palette.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{manual.title}</Text>
                <Text style={styles.cardSubtitle}>{manual.subtitle}</Text>
              </View>
              <ArrowLeft
                size={18}
                color={Palette.textMuted}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e4e7f2",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef1f6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    ...Shadow.cardSoft,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Palette.textMuted,
    marginTop: 2,
  },
});
