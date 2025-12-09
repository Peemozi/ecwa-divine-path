import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import Animated, { FadeInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

export default function VerifyToken() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string | string[] }>();
  const email = useMemo(() => {
    if (!params.email) return "";
    return Array.isArray(params.email) ? params.email[0] : params.email;
  }, [params.email]);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Backend temporarily disabled - skip token check
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const apiToken = await AsyncStorage.getItem('apiToken');
  //     if (apiToken) {
  //       // Already verified, redirect to dashboard
  //       router.replace('/(tabs)/dashboard');
  //     }
  //   };
  //   checkAuth();
  // }, [router]);

  const handleVerify = async () => {
    if (!token) {
      Toast.show({ type: "error", text1: "Please enter the verification code" });
      return;
    }

    setIsLoading(true);

    // Simulate API call delay (backend temporarily disabled)
    setTimeout(async () => {
      // Mock successful login - store user data locally
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userName", email.split("@")[0]); // Use email prefix as name
      await AsyncStorage.setItem("apiToken", "mock-token-temp"); // Temporary mock token
      
      setIsLoading(false);
      Toast.show({ type: "success", text1: "Login successful!" });
      router.replace("/(tabs)/dashboard");
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp} style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            Enter the verification code sent to {email}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={6}
              value={token}
              onChangeText={setToken}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            disabled={isLoading}
            onPress={handleVerify}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <Text style={styles.buttonText}>Verifying...</Text>
            ) : (
              <Text style={styles.buttonText}>Verify & Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/auth")}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>Back to Login</Text>
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
    backgroundColor: Palette.canvas,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: Palette.background,
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
    marginBottom: Spacing.xs,
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
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 4,
    color: Palette.textDefault,
    backgroundColor: Palette.background,
    fontWeight: "500",
  },
  button: {
    height: 48,
    backgroundColor: Palette.accent,
    borderRadius: Radii.md,
    justifyContent: "center",
    alignItems: "center",
    ...Shadow.cardSoft,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  backButton: {
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  backText: {
    color: Palette.accent,
    fontWeight: "500",
    fontSize: 14,
  },
});
