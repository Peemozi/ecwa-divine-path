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
import { ArrowLeft, Lock, CheckCircle } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { manualApi, isSubscriptionError, getAllSundaySchoolManuals } from "@/src/lib/api";
import Toast from "react-native-toast-message";

interface ManualLanguageItem {
  language: string;
  manual_id: number;
  paid: boolean;
  sponsored: boolean;
  is_free: boolean;
}

export default function ManualLanguage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string | string[]; year?: string | string[] }>();
  const type = Array.isArray(params.type) ? params.type[0] ?? "" : params.type ?? "";
  const year = Array.isArray(params.year) ? params.year[0] ?? "" : params.year ?? "";
  const [backPressed, setBackPressed] = useState(false);
  const [languages, setLanguages] = useState<ManualLanguageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLanguages = async () => {
      if (!type || !year) return;
      setIsLoading(true);
      try {
        if (type === "sunday-school") {
          // Fetch all manuals and filter by year, extract language info with payment status
          const data = await getAllSundaySchoolManuals();
          const yearNum = typeof year === "string" ? parseInt(year, 10) : year;
          
          if (data && Array.isArray(data)) {
            const manualsForYear = data.filter((item: any) => {
              const itemYear = typeof item.year === "string" ? parseInt(item.year, 10) : item.year;
              return itemYear === yearNum;
            });

            // Group by language and include payment status
            const languageMap = new Map<string, ManualLanguageItem>();
            manualsForYear.forEach((manual: any) => {
              const lang = manual.language || "";
              if (lang && !languageMap.has(lang)) {
                languageMap.set(lang, {
                  language: lang,
                  manual_id: manual.id,
                  paid: manual.paid === true,
                  sponsored: manual.sponsored === true,
                  is_free: manual.is_free === true,
                });
              }
            });

            setLanguages(Array.from(languageMap.values()));
          } else {
            setLanguages([]);
          }
        } else {
          // For other types, use the standard endpoint
          const data = await manualApi.getLanguages(type, year);
          // Convert to ManualLanguageItem format (assume not paid for non-Sunday School)
          const languageItems: ManualLanguageItem[] = (data ?? []).map((lang) => ({
            language: lang,
            manual_id: 0, // Not available for non-Sunday School
            paid: false,
            sponsored: false,
            is_free: false,
          }));
          setLanguages(languageItems);
        }
      } catch (error) {
        if (isSubscriptionError(error)) {
          // Don't redirect for subscription errors in this context
          // Just show empty or error state
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

  const handleLanguagePress = (item: ManualLanguageItem) => {
    // Check if user has access (paid, sponsored, or free)
    const hasAccess = item.paid || item.sponsored || item.is_free;
    
    if (hasAccess) {
      // User has access, navigate to lessons
      router.push({
        pathname: "/(tabs)/manuals/lessons",
        params: {
          type,
          year,
          language: item.language,
        },
      });
    } else {
      // User needs to purchase, navigate to purchase screen
      router.push({
        pathname: "/purchase-manual" as any,
        params: {
          manual_id: String(item.manual_id),
          year: year,
          language: item.language,
        },
      });
    }
  };

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
          keyExtractor={(item) => `${item.language}-${item.manual_id}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const hasAccess = item.paid || item.sponsored || item.is_free;
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleLanguagePress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.flagContainer}>
                  <Text style={styles.flag}>🌐</Text>
                </View>

                <View style={styles.cardText}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.name}>{item.language}</Text>
                    {hasAccess ? (
                      // Only show badge for Free or Sponsored, not for purchased (Owned)
                      item.is_free || item.sponsored ? (
                        <View style={styles.accessBadge}>
                          <CheckCircle size={16} color={Palette.accent} />
                          <Text style={styles.accessBadgeText}>
                            {item.is_free ? "Free" : "Sponsored"}
                          </Text>
                        </View>
                      ) : null
                    ) : (
                      <View style={styles.lockBadge}>
                        <Lock size={16} color={Palette.textMuted} />
                        <Text style={styles.lockBadgeText}>Purchase</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.subtitle}>
                    {title} in {item.language}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
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
  cardText: { marginLeft: 14, flex: 1 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: { fontSize: 16, fontWeight: "600", color: Palette.textDefault, flex: 1 },
  subtitle: { fontSize: 13, color: Palette.textMuted },
  accessBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#e6f7e6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accessBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Palette.accent,
  },
  lockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff4e6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lockBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#d97706",
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
