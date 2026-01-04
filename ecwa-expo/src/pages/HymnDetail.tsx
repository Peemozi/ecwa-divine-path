import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import Toast from "react-native-toast-message";
import { hymnApi, isSubscriptionError } from "@/src/lib/api";
import { formatHymn } from "@/src/lib/hymn-format";
import { useFontSize } from "@/src/lib/font-size-context";

// -----------------------
// ROUTE TYPE
// -----------------------
export default function HymnDetail() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(idParam) ? idParam[0] ?? "1" : idParam ?? "1";
  const [hymn, setHymn] = useState<any | null>(null);
  const { fontSize, setFontSize, getScaledSize } = useFontSize();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await hymnApi.getHymn(id);
        setHymn(data);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: (error as Error)?.message || "Failed to load hymn",
        });
        router.back();
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, router]);

  const language = hymn?.language ?? "—";
  const formatted = hymn ? formatHymn(hymn) : null;
  const title = formatted?.title ?? "";
  const number = formatted?.number ?? "";
  const verses = formatted?.verses ?? [];
  const chorus = formatted?.chorus;

  // Show loading state while fetching hymn data
  if (isLoading) {
    return (
      <View style={[styles.screen, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Palette.accent} />
        <Text style={styles.loadingText}>Loading hymn...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={{ fontSize: 16 }}>←</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>Hymn #{number}</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.fontSizeButton}
            onPress={() => setFontSize(Math.max(12, fontSize - 2))}
            activeOpacity={0.7}
          >
            <Feather name="minus" size={16} color={Palette.textDefault} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fontSizeButton}
            onPress={() => setFontSize(Math.min(24, fontSize + 2))}
            activeOpacity={0.7}
          >
            <Feather name="plus" size={16} color={Palette.textDefault} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Language</Text>
          <Text style={styles.infoValue}>{language}</Text>
          <TouchableOpacity style={styles.audioButton}>
            <Feather name="play" size={16} color={Palette.accent} />
            <Text style={styles.audioText}>Play Audio (coming soon)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.lyricsCard}>
          {chorus ? (
            <View style={styles.chorusBox}>
              <Text style={[styles.chorusLabel, { fontSize: getScaledSize(15) }]}>Chorus</Text>
              <Text style={[styles.chorusText, { fontSize: getScaledSize(15) }]}>
                {chorus}
              </Text>
            </View>
          ) : null}
          {verses.length === 0 && !chorus ? (
            <Text style={[styles.lyrics, { fontSize: getScaledSize(14) }]}>No lyrics available.</Text>
          ) : (
            verses.map((verse, idx) => {
              const isChorusLine = verse.type === "chorus";
              if (isChorusLine && verse.text) {
                return (
                  <View key={idx} style={[styles.chorusBox, { marginTop: idx === 0 && chorus ? Spacing.sm : Spacing.sm }]}>
                    <Text style={[styles.chorusLabel, { fontSize: getScaledSize(15) }]}>
                      Chorus
                    </Text>
                    <Text style={[styles.chorusText, { fontSize: getScaledSize(15) }]}>
                      {verse.text}
                    </Text>
                  </View>
                );
              }
              return (
                <Text key={idx} style={[styles.lyrics, { fontSize: getScaledSize(14), marginBottom: Spacing.sm }]}>
                  {verse.label ? `${verse.label}. ` : ""}{verse.text}
                </Text>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// -----------------------
// STYLES
// -----------------------
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e4e8f3",
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#eef1f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  fontSizeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#eef1f6",
    alignItems: "center",
    justifyContent: "center",
  },
  toneButton: {
    backgroundColor: Palette.accent,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  infoCard: {
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    ...Shadow.card,
    gap: Spacing.sm,
  },
  infoLabel: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  audioButton: {
    marginTop: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: "#dfe4f3",
    padding: Spacing.sm,
    borderRadius: Radii.md,
  },
  audioText: {
    fontSize: 13,
    color: Palette.textMuted,
  },
  lyricsCard: {
    backgroundColor: "#fff",
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    ...Shadow.cardSoft,
  },
  chorusBox: {
    borderLeftWidth: 3,
    borderLeftColor: Palette.accent,
    backgroundColor: "#e8f0ff",
    padding: Spacing.md,
    borderRadius: Radii.md,
    marginBottom: Spacing.md,
  },
  chorusLabel: {
    color: Palette.accent,
    fontWeight: "700",
    marginBottom: 4,
  },
  chorusText: {
    color: Palette.textDefault,
    fontWeight: "600",
    lineHeight: 22,
  },
  lyrics: {
    lineHeight: 24,
    color: Palette.textDefault,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    color: Palette.textMuted,
  },
});
