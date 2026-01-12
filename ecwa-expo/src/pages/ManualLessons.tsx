// src/assets/pages/ManualLessons.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ListRenderItem,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Search } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import Toast from "react-native-toast-message";
import { manualApi, isSubscriptionError, getAllSundaySchoolManuals } from "@/src/lib/api";

export default function ManualLessons() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    type?: string | string[];
    year?: string | string[];
    language?: string | string[];
  }>();

  const type = Array.isArray(params.type) ? params.type[0] ?? "sunday-school" : params.type ?? "sunday-school";
  const year = Array.isArray(params.year) ? params.year[0] ?? `${new Date().getFullYear()}` : params.year ?? `${new Date().getFullYear()}`;
  const language = Array.isArray(params.language) ? params.language[0] ?? "english" : params.language ?? "english";

  const [searchQuery, setSearchQuery] = useState("");
  const [backPressed, setBackPressed] = useState(false);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [manualId, setManualId] = useState<number | null>(null);

  useEffect(() => {
    const loadLessons = async () => {
      setIsLoading(true);
      try {
        // For Sunday School, check payment status first
        if (type === "sunday-school") {
          try {
            const allManuals = await getAllSundaySchoolManuals();
            const yearNum = typeof year === "string" ? parseInt(year, 10) : year;
            const langLower = (language || "").toLowerCase();
            
            const manual = allManuals.find((item: any) => {
              const itemYear = typeof item.year === "string" ? parseInt(item.year, 10) : item.year;
              const itemLang = (item.language || "").toLowerCase();
              return itemYear === yearNum && itemLang === langLower;
            });
            
            if (manual) {
              setManualId(manual.id);
              const access = manual.paid === true || manual.sponsored === true || manual.is_free === true;
              
              // If no access, redirect to purchase screen
              if (!access) {
                router.replace({
                  pathname: "/purchase-manual" as any,
                  params: {
                    manual_id: String(manual.id),
                    year: String(year),
                    language: language,
                  },
                });
                return;
              }
            }
          } catch (_error) {
            // Payment check failed, continue loading lessons (may show error later)
          }
        }
        
        // Load lessons
        const data = await manualApi.getLessons(type, year, language);
        setLessons(data ?? []);
      } catch (error) {
        if (isSubscriptionError(error)) {
          // If it's a subscription error and we haven't checked payment status yet,
          // try to navigate to purchase screen with available info
          if (type === "sunday-school" && manualId) {
            router.replace({
              pathname: "/purchase-manual" as any,
              params: {
                manual_id: String(manualId),
                year: String(year),
                language: language,
              },
            });
            return;
          }
          // For other errors, navigate back to manual years
          router.back();
          return;
        }
        Toast.show({
          type: "error",
          text1: (error as Error).message || "Failed to load lessons",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, router, type, year]);

  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.number?.toString().includes(searchQuery.toLowerCase()) ||
      lesson.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const title = type === "sunday-school" ? "Sunday School Manual" : "Bible Study Manual";
  const languageName = language?.toLowerCase() === "english" ? "English" : "Yoruba";

  const renderItem: ListRenderItem<any> = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/manuals/lesson",
          params: {
            type,
            year,
            language,
            lessonId: String(item.id),
          },
        })
      }
    >
      <View style={styles.numberBox}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.lessonTitle}>
          {item.title || `Lesson ${item.number}`}
        </Text>
        {item.topic && (
          <Text style={styles.lessonTopic} numberOfLines={2}>
            {item.topic}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push({
            pathname: "/(tabs)/manuals/language",
            params: { type, year },
          })}
          onPressIn={() => setBackPressed(true)}
          onPressOut={() => setBackPressed(false)}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={22}
            color={backPressed ? Palette.accent : Palette.textDefault}
          />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {title} {year}
          </Text>
          <Text style={styles.headerSubtitle}>{languageName}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={18} color={Palette.textMuted} style={styles.searchIcon} />
        <TextInput
          placeholder="Search lessons..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Palette.accent} />
          <Text style={styles.loadingText}>Loading lessons...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredLessons}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No lessons found.</Text>
              </View>
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
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e5e5",
    backgroundColor: Palette.background,
  },

  iconButton: {
    padding: Spacing.xs,
    marginRight: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef1f6",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: { fontSize: 18, fontWeight: "700", color: Palette.textDefault },

  headerSubtitle: { fontSize: 12, color: Palette.textMuted },

  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
    backgroundColor: Palette.background,
  },

  searchIcon: { position: "absolute", left: Spacing.xl, top: Spacing.md + 2 },

  searchInput: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingLeft: Spacing.xl + 10,
    paddingVertical: 10,
    fontSize: 14,
  },

  listContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: 90, // Add padding for bottom tab bar
  },

  card: {
    flexDirection: "row",
    backgroundColor: Palette.background,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    alignItems: "center",
    ...Shadow.card,
  },

  numberBox: {
    width: 54,
    height: 54,
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },

  numberText: { fontSize: 18, fontWeight: "700", color: "#1e40af" },

  lessonTitle: { fontSize: 16, fontWeight: "600", color: Palette.textDefault, marginBottom: 4 },

  lessonTopic: { fontSize: 13, color: Palette.textMuted, marginTop: 2 },
  
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
    fontSize: 14,
    color: Palette.textMuted,
    textAlign: "center",
  },
});
