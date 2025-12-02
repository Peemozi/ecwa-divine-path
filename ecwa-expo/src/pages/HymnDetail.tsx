import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

// -----------------------
// MOCK HYMN DATA
// -----------------------
const mockHymnData: Record<string, any> = {
  "1": {
    number: 1,
    title: "Holy, Holy, Holy",
    language: "EN",
    lyrics: `Holy, holy, holy! Lord God Almighty!
Early in the morning our song shall rise to Thee;
Holy, holy, holy, merciful and mighty!
God in three Persons, blessed Trinity!

Holy, holy, holy! All the saints adore Thee,
Casting down their golden crowns around the glassy sea;
Cherubim and seraphim falling down before Thee,
Which wert, and art, and evermore shalt be.

Holy, holy, holy! though the darkness hide Thee,
Though the eye of sinful man Thy glory may not see;
Only Thou art holy; there is none beside Thee,
Perfect in power, in love, and purity.

Holy, holy, holy! Lord God Almighty!
All Thy works shall praise Thy Name, in earth, and sky, and sea;
Holy, holy, holy; merciful and mighty!
God in three Persons, blessed Trinity!`,
  },
  "234": {
    number: 234,
    title: "Jọwọ wa sọdọ wa",
    language: "YO",
    lyrics: `Jọwọ wa sọdọ wa, Olúwa Jésù,
Jọwọ gbọ adura wa nínú ọjọ yìí.
À ń bẹ Ọ, jọwọ wa sọdọ wa,
Má fi wá sílẹ lọ, Olúwa Jésù.

Ẹnití ó ṣe ẹmi wa lómìnira,
Má jẹ ká padà sí ẹrú ẹṣẹ mọ.
À ń bẹ Ọ, jọwọ wa sọdọ wa,
Má fi wá sílẹ lọ, Olúwa Jésù.`,
  },
};

// -----------------------
// ROUTE TYPE
// -----------------------
export default function HymnDetail() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(idParam) ? idParam[0] ?? "1" : idParam ?? "1";
  const hymn = useMemo(() => mockHymnData[id] ?? mockHymnData["1"], [id]);
  const [fontSize, setFontSize] = useState(16);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={{ fontSize: 16 }}>←</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{hymn.title}</Text>
          <Text style={styles.headerSubtitle}>Hymn #{hymn.number}</Text>
        </View>

        <TouchableOpacity
          style={styles.toneButton}
          onPress={() => setFontSize((size) => Math.min(size + 2, 28))}
        >
          <Feather name="plus" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toneButton, { marginLeft: 6 }]}
          onPress={() => setFontSize((size) => Math.max(size - 2, 12))}
        >
          <Feather name="minus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Language</Text>
          <Text style={styles.infoValue}>{hymn.language}</Text>
          <TouchableOpacity style={styles.audioButton}>
            <Feather name="play" size={16} color={Palette.accent} />
            <Text style={styles.audioText}>Play Audio (coming soon)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.lyricsCard}>
          <Text style={[styles.lyrics, { fontSize }]}>{hymn.lyrics}</Text>
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
  lyrics: {
    lineHeight: 24,
    color: Palette.textDefault,
  },
});
