import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import Slider from "@react-native-community/slider";
import { ArrowLeft, User, Type } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Palette, Spacing, Radii, Shadow } from "@/constants/theme";
import { authApi, removeTokens } from "@/src/lib/api";
import { useFontSize } from "@/src/lib/font-size-context";

const ecwaLogo = require("../assets/ecwa-logo.png");

const Profile = () => {
  const router = useRouter();
  const { fontSize, setFontSize } = useFontSize();
  const [userEmail, setUserEmail] = useState("Guest");
  const [backPressed, setBackPressed] = useState(false);

  useEffect(() => {
    const loadUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      if (email) setUserEmail(email);
    };
    loadUserEmail();
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout().catch(() => undefined);
    } finally {
      await removeTokens();
      await AsyncStorage.multiRemove(["userEmail", "userName"]);
      router.replace("/auth");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          onPressIn={() => setBackPressed(true)}
          onPressOut={() => setBackPressed(false)}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={24}
            color={backPressed ? Palette.accent : Palette.textDefault}
          />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Image source={ecwaLogo} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Profile & Settings</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ACCOUNT CARD */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <View style={styles.cardHeader}>
            <User size={20} color={Palette.accent} />
            <Text style={styles.cardTitle}>Account</Text>
          </View>
          <View style={styles.accountRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{userEmail}</Text>
          </View>
        </View>

        {/* APPEARANCE CARD */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Appearance</Text>
          </View>
          <Text style={styles.cardSubtitle}>Customize your reading experience</Text>

          {/* FONT SIZE */}
          <View style={styles.fontSizeContainer}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Type size={20} color={Palette.textMuted} />
                <Text style={styles.settingLabel}>Default Font Size</Text>
              </View>
              <Text style={styles.fontSizeValue}>{fontSize}px</Text>
            </View>
            <Slider
              value={fontSize}
              minimumValue={12}
              maximumValue={24}
              step={2}
              onValueChange={(value: number) => setFontSize(value)}
              minimumTrackTintColor={Palette.accent}
              maximumTrackTintColor="#d1d5db"
              thumbTintColor={Palette.accent}
              style={styles.slider}
            />
          </View>
        </View>

        {/* SUBSCRIPTION */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Subscription</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Manage your Sunday School access
          </Text>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => router.push("/payment-history")}
            activeOpacity={0.7}
          >
            <Text style={styles.outlineBtnText}>View Payment History</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={[styles.logoutBtn, Shadow.card]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.background,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  card: {
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Palette.textMuted,
    marginBottom: Spacing.md,
  },
  accountRow: {
    marginTop: Spacing.sm,
  },
  label: {
    fontSize: 14,
    color: Palette.textMuted,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: Spacing.sm,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  settingLabel: {
    fontSize: 16,
    color: Palette.textDefault,
  },
  fontSizeContainer: {
    marginTop: Spacing.sm,
  },
  fontSizeValue: {
    fontSize: 14,
    color: Palette.textMuted,
    fontWeight: "500",
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: Spacing.sm,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: Palette.accent,
    padding: Spacing.md,
    borderRadius: Radii.md,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  outlineBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.accent,
  },
  logoutBtn: {
    backgroundColor: "#dc2626",
    padding: Spacing.md,
    borderRadius: Radii.md,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
