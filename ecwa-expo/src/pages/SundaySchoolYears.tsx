import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { ArrowLeft, Calendar } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { manualApi, isSubscriptionError } from "@/src/lib/api";
import Toast from "react-native-toast-message";

export default function SundaySchoolYears() {
  const router = useRouter();
  const [backPressed, setBackPressed] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const title = "Sunday School Manual";

  useEffect(() => {
    const loadYears = async () => {
      setIsLoading(true);
      try {
        const data = await manualApi.getYears("sunday-school");
        setYears(data ?? []);
      } catch (error) {
        if (isSubscriptionError(error)) {
          // Allow browsing, payment check happens at manual selection
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
  }, [router]);

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
                    params: { type: "sunday-school", year: String(year) },
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
            {!isLoading && years.length === 0 && (
              <Text style={styles.emptyText}>No years found.</Text>
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
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    color: Palette.textMuted,
  },
  emptyText: {
    textAlign: "center",
    color: Palette.textMuted,
    fontSize: 14,
    paddingVertical: Spacing.xxl,
  },
});

