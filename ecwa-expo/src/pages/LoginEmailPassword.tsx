import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Image } from "expo-image";
import { Lock, ArrowLeft, Mail, Eye, EyeOff } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

export default function LoginEmailPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: "error", text1: "Please enter both email and password" });
      return;
    }

    setIsLoading(true);

    // Mock login flow (backend disabled)
    setTimeout(async () => {
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userName", email.split("@")[0]);
      await AsyncStorage.setItem("apiToken", "mock-token-temp");
      setIsLoading(false);
      Toast.show({ type: "success", text1: "Login successful!" });
      router.replace("/(tabs)/dashboard");
    }, 800);
  };

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
          <View style={styles.iconCircle}>
            <Mail size={28} color="#0B3B8F" />
          </View>
          <TouchableOpacity onPress={() => router.replace("/auth")} style={styles.backButton} activeOpacity={0.8}>
            <ArrowLeft size={18} color={Palette.accent} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Enter your credentials to login</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              onChangeText={setEmail}
              value={email}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={[styles.input, styles.inputGrow]}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                onChangeText={setPassword}
                value={password}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((p) => !p)}
                activeOpacity={0.8}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={18} color={Palette.textMuted} />
                ) : (
                  <Eye size={18} color={Palette.textMuted} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleForgotPassword}
            activeOpacity={0.8}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonPrimary, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Lock size={18} color="#fff" />
                <Text style={styles.buttonText}>Login</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/auth")}
            activeOpacity={0.8}
            style={styles.backToOptions}
          >
            <ArrowLeft size={16} color={Palette.textDefault} />
            <Text style={styles.backOptionsText}>Back to Login Options</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Toast />
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
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -Spacing.xs,
  },
  forgotText: {
    color: Palette.accent,
    fontWeight: "600",
    fontSize: 14,
  },
  logoContainer: {
    marginBottom: 24,
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
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadow.card,
  },
  header: {
    marginBottom: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  backText: {
    color: Palette.accent,
    fontSize: 14,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: Palette.textDefault,
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
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D1D5DB",
    borderRadius: Radii.md,
    backgroundColor: Palette.background,
  },
  inputGrow: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: Spacing.md,
  },
  eyeButton: {
    paddingHorizontal: Spacing.md,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPrimary: {
    height: 56,
    backgroundColor: "#0B3B8F",
    borderRadius: Radii.md,
    justifyContent: "center",
    alignItems: "center",
    ...Shadow.cardSoft,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  backToOptions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    alignSelf: "center",
    marginTop: Spacing.lg,
  },
  backOptionsText: {
    color: Palette.textDefault,
    fontSize: 14,
    fontWeight: "500",
  },
});

