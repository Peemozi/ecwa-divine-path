// src/assets/pages/ManualLessons.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import { ArrowLeft, Search } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

type Lesson = {
  id: number;
  number: number;
  title: string;
  topic: string;
};

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

  // Auto-generate 52 lessons
  const lessons: Lesson[] = Array.from({ length: 52 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    title: `Lesson ${i + 1}`,
    topic: `Topic for Lesson ${i + 1}`,
  }));

  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const title = type === "sunday-school" ? "Sunday School Manual" : "Bible Study Manual";
  const languageName = language === "english" ? "English" : "Yoruba";

  const renderItem: ListRenderItem<Lesson> = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/manual-lesson",
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
        <Text style={styles.lessonTitle}>{item.title}</Text>
        <Text style={styles.lessonTopic} numberOfLines={1}>
          {item.topic}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
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

      <FlatList
        data={filteredLessons}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
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

  lessonTitle: { fontSize: 16, fontWeight: "600", color: Palette.textDefault },

  lessonTopic: { fontSize: 13, color: Palette.textMuted, marginTop: 2 },
});
