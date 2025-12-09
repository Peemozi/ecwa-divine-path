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
import { UserPlus, ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

export default function CreateAccount() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState<"English" | "Yoruba" | "Hausa" | "Igbo">("English");
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !email || !password) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }

    setIsLoading(true);

    // Mock create account flow
    setTimeout(async () => {
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userName", name);
      await AsyncStorage.setItem("apiToken", "mock-token-temp");
      setIsLoading(false);
      Toast.show({ type: "success", text1: "Account created!" });
      router.replace("/(tabs)/dashboard");
    }, 900);
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
          <TouchableOpacity onPress={() => router.replace("/auth")} style={styles.backButton} activeOpacity={0.8}>
            <ArrowLeft size={18} color={Palette.accent} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Fill in your details to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              onChangeText={setName}
              value={name}
            />
          </View>

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
                placeholder="Create a password"
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Preferred Language</Text>
            <TouchableOpacity
              style={styles.select}
              activeOpacity={0.8}
              onPress={() => setShowLanguageOptions(!showLanguageOptions)}
            >
              <Text style={styles.selectText}>{language}</Text>
              <Text style={styles.selectArrow}>{showLanguageOptions ? "▲" : "▼"}</Text>
            </TouchableOpacity>
            {showLanguageOptions && (
              <View style={styles.options}>
                {(["English", "Yoruba", "Hausa", "Igbo"] as const).map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.optionItem,
                      language === opt && styles.optionItemActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setLanguage(opt);
                      setShowLanguageOptions(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        language === opt && styles.optionTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.buttonPrimary, isLoading && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <UserPlus size={18} color="#fff" />
                <Text style={styles.buttonText}>Create Account</Text>
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
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
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
  select: {
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D1D5DB",
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Palette.background,
    flexDirection: "row",
  },
  selectText: {
    fontSize: 16,
    color: Palette.textDefault,
  },
  selectArrow: {
    fontSize: 14,
    color: Palette.textMuted,
  },
  options: {
    marginTop: Spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D1D5DB",
    borderRadius: Radii.md,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  optionItem: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  optionItemActive: {
    backgroundColor: "#E8F0FF",
  },
  optionText: {
    fontSize: 16,
    color: Palette.textDefault,
  },
  optionTextActive: {
    fontWeight: "700",
    color: "#0B3B8F",
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

