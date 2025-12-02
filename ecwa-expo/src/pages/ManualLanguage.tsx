// src/assets/pages/ManualLanguage.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

export default function ManualLanguage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string | string[]; year?: string | string[] }>();
  const type = Array.isArray(params.type) ? params.type[0] ?? "" : params.type ?? "";
  const year = Array.isArray(params.year) ? params.year[0] ?? "" : params.year ?? "";
  const [backPressed, setBackPressed] = useState(false);

  const languages = [
    { code: "english", name: "English", flag: "🇬🇧" },
    { code: "yoruba", name: "Yoruba", flag: "🇳🇬" },
  ];

  const title = type === "sunday-school" ? "Sunday School Manual" : "Bible Study Manual";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
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

      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/manual-lessons",
                params: {
                  type,
                  year,
                  language: item.code,
                },
              })
            }
          >
            <View style={styles.flagContainer}>
              <Text style={styles.flag}>{item.flag}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subtitle}>
                {title} in {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
});
