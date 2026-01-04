// src/assets/pages/ManualLanguage.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { manualApi, isSubscriptionError } from "@/src/lib/api";
import Toast from "react-native-toast-message";

export default function ManualLanguage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string | string[]; year?: string | string[] }>();
  const type = Array.isArray(params.type) ? params.type[0] ?? "" : params.type ?? "";
  const year = Array.isArray(params.year) ? params.year[0] ?? "" : params.year ?? "";
  const [backPressed, setBackPressed] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLanguages = async () => {
      if (!type || !year) return;
      setIsLoading(true);
      try {
        const data = await manualApi.getLanguages(type, year);
        setLanguages(data ?? []);
      } catch (error) {
        if (isSubscriptionError(error)) {
          router.replace("/payment");
          return;
        }
        Toast.show({
          type: "error",
          text1: (error as Error).message || "Failed to load languages",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadLanguages();
  }, [router, type, year]);

  const title = type === "sunday-school" ? "Sunday School Manual" : "Bible Study Manual";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push({
            pathname: "/(tabs)/manuals/years",
            params: { type },
          })}
          onPressIn={() => setBackPressed(true)}
          onPressOut={() => setBackPressed(false)}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={22}
            color={backPressed ? Palette.accent : Palette.textDefault}
          />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            {title} {year}
          </Text>
          <Text style={styles.headerSubtitle}>Select Language</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Palette.accent} />
          <Text style={styles.loadingText}>Loading languages...</Text>
        </View>
      ) : (
        <FlatList
          data={languages}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/manuals/lessons",
                  params: {
                    type,
                    year,
                    language: item,
                  },
                })
              }
            >
              <View style={styles.flagContainer}>
                <Text style={styles.flag}>🌐</Text>
              </View>

              <View style={styles.cardText}>
                <Text style={styles.name}>{item}</Text>
                <Text style={styles.subtitle}>
                  {title} in {item}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !isLoading ? (
              <Text style={styles.emptyText}>No languages found.</Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.canvas },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef1f6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { marginLeft: 12 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: Palette.textDefault },
  headerSubtitle: { fontSize: 12, color: Palette.textMuted },
  listContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  card: {
    backgroundColor: Palette.background,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    flexDirection: "row",
    alignItems: "center",
    ...Shadow.card,
  },
  flagContainer: {
    height: 50,
    width: 50,
    borderRadius: 12,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
  },
  flag: { fontSize: 22 },
  cardText: { marginLeft: 14 },
  name: { fontSize: 16, fontWeight: "600", color: Palette.textDefault },
  subtitle: { fontSize: 13, color: Palette.textMuted },
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
