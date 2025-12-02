import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { Book } from "lucide-react-native";

const hymns = [
  { id: 1, number: 1, title: "Holy, Holy, Holy", preview: "Holy, holy, holy! Lord God Almighty!", language: "EN" },
  { id: 2, number: 2, title: "Come, Thou Almighty King", preview: "Come, thou Almighty King, help us thy name to sing", language: "EN" },
  { id: 3, number: 234, title: "Jọwọ wa sọdọ wa", preview: "Jọwọ wa sọdọ wa, Olúwa Jésù", language: "YO" },
  { id: 4, number: 235, title: "Ẹni tí ó gbé ayé dá", preview: "Ẹni tí ó gbé ayé dá, ó ṣe àwọn òkè", language: "YO" },
  { id: 5, number: 567, title: "Amazing Grace", preview: "Amazing grace, how sweet the sound", language: "EN" },
];

const filters = [
  { key: "all", label: "All" },
  { key: "en", label: "English" },
  { key: "yo", label: "Yoruba" },
];

export default function Hymns() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "en" | "yo">("all");
  const [query, setQuery] = useState("");

  const visibleHymns = useMemo(
    () =>
      hymns.filter((hymn) => {
        const matchesFilter =
          filter === "all" || hymn.language.toLowerCase() === filter;
        const matchesSearch =
          hymn.title.toLowerCase().includes(query.toLowerCase()) ||
          hymn.number.toString().includes(query);
        return matchesFilter && matchesSearch;
      }),
    [filter, query],
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
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={visibleHymns}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
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
                {item.preview}
              </Text>
            </View>
          </TouchableOpacity>
        )}
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
    paddingBottom: Spacing.xl,
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
