import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  User,
  CreditCard,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  History,
} from "lucide-react-native";
import { Palette, Spacing, Radii, Shadow } from "@/constants/theme";

const ecwaLogo = require("../assets/ecwa-logo.png");

export default function MenuPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("Guest");

  useEffect(() => {
    const getEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      if (email) setUserEmail(email);
    };

    getEmail();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("userEmail");
            router.replace("/auth");
          },
        },
      ]
    );
  };

  const menuItems = [
    { icon: User, label: "Profile", action: () => router.push("/profile") },
    { icon: History, label: "Quiz History", action: () => router.push("/quiz-history") },
    { icon: CreditCard, label: "Payment History", action: () => router.push("/payment-history") },
    { icon: Settings, label: "Settings", action: () => router.push("/settings") },
    { icon: HelpCircle, label: "Help & Support", action: () => router.push("/help-support") },
    { icon: Info, label: "About", action: () => router.push("/about") },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={ecwaLogo} style={styles.logo} resizeMode="contain" />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>ECWA Divine Path</Text>
          <Text style={styles.headerSubtitle}>{userEmail}</Text>
        </View>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.menuCard, Shadow.cardSoft]}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={item.action}
                  style={styles.menuItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconContainer}>
                    <Icon size={22} color={Palette.textMuted} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <ChevronRight size={20} color={Palette.textMuted} />
                </TouchableOpacity>
                {index < menuItems.length - 1 && <View style={styles.separator} />}
              </View>
            );
          })}
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutButton, Shadow.card]}
          activeOpacity={0.8}
        >
          <LogOut size={20} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Palette.background,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  logo: {
    width: 64,
    height: 64,
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Palette.textMuted,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  menuCard: {
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    backgroundColor: Palette.canvas,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: Palette.textDefault,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginLeft: Spacing.md + 44 + Spacing.md, // icon width + padding
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dc2626",
    padding: Spacing.md,
    borderRadius: Radii.md,
    gap: Spacing.sm,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
