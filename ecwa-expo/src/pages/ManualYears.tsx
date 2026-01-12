// src/assets/pages/ManualYears.tsx

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Calendar } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import Toast from "react-native-toast-message";
import { manualApi, isSubscriptionError } from "@/src/lib/api";

export default function ManualYears() {
  const router = useRouter();
  const { type: typeParam } = useLocalSearchParams<{ type?: string | string[] }>();
  const type = Array.isArray(typeParam) ? typeParam[0] ?? "" : typeParam ?? "";
  const [backPressed, setBackPressed] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadYears = async () => {
      if (!type) return;
      setIsLoading(true);
      try {
        const data = await manualApi.getYears(type);
        
        // Data is already processed as number[] from manualApi.getYears
        const yearsData: number[] = Array.isArray(data) ? data : [];
        
        setYears(yearsData);
        
        if (yearsData.length === 0) {
          Toast.show({
            type: "info",
            text1: "No years available",
            text2: "Please check back later or contact support",
          });
        }
      } catch (error) {
        if (isSubscriptionError(error)) {
          // Payment/subscription error - allow user to browse manuals
          // Payment check will happen at language/manual level
        }
        Toast.show({
          type: "error",
          text1: (error as Error).message || "Failed to load years",
          text2: "Please check your connection and try again",
        });
        setYears([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadYears();
  }, [router, type]);

  const title =
    type === "sunday-school"
      ? "Sunday School Manual"
      : "Bible Study Manual";

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/manuals")}
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
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/manuals/language",
                    params: { type, year: String(year) },
                  })
                }
                activeOpacity={0.8}
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
            {years.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No years found.</Text>
                <Text style={styles.emptySubtext}>
                  Please check your connection or contact support if this issue persists.
                </Text>
              </View>
            )}
          </>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xxl * 2,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    color: Palette.textMuted,
  },
  emptyContainer: {
    paddingVertical: Spacing.xxl * 2,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: 13,
    color: Palette.textMuted,
    textAlign: "center",
    paddingHorizontal: Spacing.lg,
  },
});
