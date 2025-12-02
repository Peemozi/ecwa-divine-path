// src/assets/pages/ManualYears.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Calendar } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

export default function ManualYears() {
  const router = useRouter();
  const { type: typeParam } = useLocalSearchParams<{ type?: string | string[] }>();
  const type = Array.isArray(typeParam) ? typeParam[0] ?? "" : typeParam ?? "";
  const [backPressed, setBackPressed] = useState(false);

  const years = [2021, 2022, 2023, 2024, 2025, 2026];

  const title =
    type === "sunday-school"
      ? "Sunday School Manual"
      : "Bible Study Manual";

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
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {years.map((year) => (
          <TouchableOpacity
            key={year}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/manual-language",
                params: { type, year: String(year) },
              })
            }
          >
            <View style={styles.iconWrap}>
              <Calendar size={24} color={Palette.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{year}</Text>
              <Text style={styles.cardSubtitle}>
                {title} {year}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    ...Shadow.card,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#e4edff",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Palette.textMuted,
    marginTop: 2,
  },
});
