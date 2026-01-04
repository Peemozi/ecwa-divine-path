import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { Lock, Mail, UserPlus } from "lucide-react-native";

export default function Auth() {
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.setItem("sundaySchoolPaid", "false");
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.logoContainer}>
        <Image 
          source={require("../assets/ecwa-logo.png")}
          style={styles.logo}
        />
      </Animated.View>

      <Animated.View entering={ZoomIn} style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Choose how you'd like to continue</Text>
        </View>

        <View style={styles.form}>
          <TouchableOpacity
            style={styles.optionButtonPrimary}
            onPress={() => router.push("/login-email-password")}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <Lock size={18} color="#fff" />
              <Text style={styles.optionPrimaryText}>Login with Email & Password</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButtonSecondary}
            onPress={() => router.push({ pathname: "/login-email-only" })}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <Mail size={18} color={Palette.textDefault} />
              <Text style={styles.optionSecondaryText}>Login with Email Only</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>NEW HERE?</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => router.push("/create-account")}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <UserPlus size={18} color={Palette.textDefault} />
              <Text style={styles.createAccountText}>Create Account</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 96,
    height: 96,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    textAlign: "center",
    color: Palette.textMuted,
    fontSize: 14,
  },
  form: {
    gap: Spacing.md,
  },
  inputContainer: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  input: {
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D1D5DB",
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    color: Palette.textDefault,
    backgroundColor: Palette.background,
  },
  optionButtonPrimary: {
    height: 56,
    backgroundColor: "#0B3B8F",
    borderRadius: Radii.md,
    justifyContent: "center",
    alignItems: "center",
    ...Shadow.cardSoft,
  },
  optionPrimaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  optionButtonSecondary: {
    height: 56,
    backgroundColor: "#fff",
    borderRadius: Radii.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  optionSecondaryText: {
    color: Palette.textDefault,
    fontWeight: "700",
    fontSize: 16,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    color: Palette.textMuted,
    fontSize: 12,
  },
  createAccountButton: {
    paddingVertical: Spacing.md,
    alignItems: "center",
    backgroundColor: "#F5F6F7",
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  createAccountText: {
    color: Palette.textDefault,
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginBottom: Spacing.sm,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: Palette.accent,
    fontSize: 14,
    fontWeight: "500",
  },
});
