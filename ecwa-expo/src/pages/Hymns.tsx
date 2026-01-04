import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import { useRouter } from "expo-router";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { Book } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { hymnApi, isSubscriptionError } from "@/src/lib/api";

const filters = [
  { key: "all", label: "All" },
  { key: "english", label: "English" },
  { key: "yoruba", label: "Yoruba" },
];

export default function Hymns() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "english" | "yoruba">("all");
  const [query, setQuery] = useState("");
  const [hymns, setHymns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHymns = async () => {
    setIsLoading(true);
    try {
      // For "all", don't pass language param to get both English and Yoruba
      // For specific language, pass it to filter
      const languageParam = filter === "all" ? undefined : filter;
      let data = await hymnApi.listHymns({ language: languageParam, search: query.trim() || undefined });
      
      // If filtering by language and API doesn't filter, do client-side filtering
      if (filter !== "all" && data && data.length > 0) {
        data = data.filter((hymn: any) => {
          const hymnLang = (hymn.language || '').toLowerCase();
          if (filter === "english") {
            return hymnLang === 'english' || hymnLang === 'en';
          } else if (filter === "yoruba") {
            return hymnLang === 'yoruba' || hymnLang === 'yo' || hymnLang === 'yorùbá';
          }
          return true;
        });
      }
      
      // Sort hymns: by number first, then by language (English before Yoruba)
      const sortedHymns = (data ?? []).sort((a, b) => {
        // First sort by number
        const numA = Number(a.number) || 0;
        const numB = Number(b.number) || 0;
        if (numA !== numB) {
          return numA - numB;
        }
        // If same number, English comes before Yoruba
        const langA = (a.language || '').toLowerCase();
        const langB = (b.language || '').toLowerCase();
        if (langA === 'english' || langA === 'en') return -1;
        if (langB === 'english' || langB === 'en') return 1;
        if (langA === 'yoruba' || langA === 'yo' || langA === 'yorùbá') return 1;
        if (langB === 'yoruba' || langB === 'yo' || langB === 'yorùbá') return -1;
        return 0;
      });
      
      setHymns(sortedHymns);
    } catch (error) {
      const message = (error as Error).message || "Failed to load hymns";
      Toast.show({ type: "error", text1: message });
      setHymns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHymns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Also reload when search query changes (with debounce would be better, but this works)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        loadHymns();
      } else {
        loadHymns();
      }
    }, 500); // Debounce search by 500ms
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const visibleHymns = useMemo(
    () => {
      // If we have a search query, filter client-side as well (for better UX)
      // But the API should handle most filtering
      if (!query.trim()) {
        return hymns;
      }
      return hymns.filter((hymn) => {
        const matchesSearch =
          hymn.title?.toLowerCase().includes(query.toLowerCase()) ||
          hymn.number?.toString().includes(query);
        return matchesSearch;
      });
    },
    [hymns, query],
  );

  // Optimized render function with useCallback
  const renderHymnItem: ListRenderItem<any> = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.hymnCard}
        onPress={() =>
          router.push({
            pathname: "/hymn-detail",
            params: { id: String(item.id) },
          })
        }
      >
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{item.number}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.hymnTitleRow}>
            <Text style={styles.hymnTitle}>{item.title}</Text>
            <View style={styles.languagePill}>
              <Text style={styles.languageText}>{item.language}</Text>
            </View>
          </View>
          <Text style={styles.hymnPreview} numberOfLines={1}>
            {item.preview || item.first_line || item.chorus || ""}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [router],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hymns</Text>
        <TouchableOpacity
          onPress={() => router.push("/menu-page")}
          style={styles.profileBadge}
        >
          <Book size={16} color={Palette.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {filters.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.filterChip,
              filter === item.key && styles.filterChipActive,
            ]}
            onPress={() => setFilter(item.key as typeof filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === item.key && styles.filterChipTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search by title or number..."
          style={styles.searchInput}
          value={query}
          onChangeText={(val) => setQuery(val)}
          onSubmitEditing={loadHymns}
        />
      </View>

      <FlatList
        data={visibleHymns}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={loadHymns}
        renderItem={renderHymnItem}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={15}
        windowSize={10}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No results</Text>
            <Text style={styles.emptySubtitle}>
              Try a different title or hymn number.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  header: {
    backgroundColor: Palette.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e8f2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  profileBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#eef1f6",
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    flexDirection: "row",
    backgroundColor: "#e7ecf4",
    margin: Spacing.lg,
    borderRadius: Radii.lg,
    padding: 4,
    gap: 4,
  },
  filterChip: {
    flex: 1,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: "#fff",
    ...Shadow.cardSoft,
  },
  filterChipText: {
    fontSize: 14,
    color: Palette.textMuted,
  },
  filterChipTextActive: {
    color: Palette.textDefault,
    fontWeight: "600",
  },
  searchBox: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    ...Shadow.cardSoft,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: Palette.textDefault,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
    gap: Spacing.md,
  },
  hymnCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow.card,
  },
  numberBadge: {
    width: 52,
    height: 52,
    borderRadius: Radii.md,
    backgroundColor: "#e2e9ff",
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2745cc",
  },
  hymnTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hymnTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.textDefault,
    flex: 1,
  },
  languagePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d6dce8",
  },
  languageText: {
    fontSize: 10,
    fontWeight: "600",
    color: Palette.textMuted,
  },
  hymnPreview: {
    marginTop: 4,
    fontSize: 13,
    color: Palette.textMuted,
  },
  emptyState: {
    marginTop: 80,
    alignItems: "center",
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Palette.textMuted,
  },
});
