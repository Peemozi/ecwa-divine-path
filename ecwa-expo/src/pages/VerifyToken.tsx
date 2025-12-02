import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import Animated, { FadeInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
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

  // Check if already verified on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        // Already verified, redirect to dashboard
        router.replace('/(tabs)/dashboard');
      }
    };
    checkAuth();
  }, [router]);

  const handleVerify = async () => {
    if (!token) {
      Toast.show({ type: "error", text1: "Please enter the verification code" });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await AsyncStorage.setItem("authToken", "demo-token-" + Date.now());
      await AsyncStorage.setItem("userEmail", email);

      Toast.show({ type: "success", text1: "Login successful!" });
      router.replace("/(tabs)/dashboard");
    } catch {
      Toast.show({ type: "error", text1: "Invalid verification code" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* LOGO */}
      <Animated.View entering={FadeInUp} style={{ marginBottom: 35 }}>
        <Image
          source={require("../assets/ecwa-logo.png")}
          style={{ width: 95, height: 95 }}
        />
      </Animated.View>

      {/* CARD */}
      <Animated.View entering={FadeInUp} style={styles.card}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
        <Text style={styles.email}>{email}</Text>

        <TextInput
          style={styles.input}
          placeholder="123456"
          keyboardType="number-pad"
          maxLength={6}
          value={token}
          onChangeText={setToken}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.6 }]}
          disabled={isLoading}
          onPress={handleVerify}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
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
  title: {
    fontSize: 24,
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
  email: {
    textAlign: "center",
    fontWeight: "600",
    marginTop: Spacing.xs / 2,
    marginBottom: Spacing.lg,
    color: Palette.textDefault,
    fontSize: 15,
  },
  input: {
    height: 55,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D1D5DB",
    borderRadius: Radii.md,
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 7,
    marginBottom: Spacing.lg,
    color: Palette.textDefault,
    backgroundColor: Palette.background,
  },
  button: {
    height: 50,
    backgroundColor: Palette.accent,
    borderRadius: Radii.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
    ...Shadow.cardSoft,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  backButton: {
    paddingVertical: Spacing.sm,
  },
  backText: {
    textAlign: "center",
    color: Palette.accent,
    fontWeight: "500",
    fontSize: 14,
  },
});
