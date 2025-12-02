import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ActivityIndicator 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.setItem("sundaySchoolPaid", "false");
  }, []);

  const handleSendToken = async () => {
    if (!email) {
      Toast.show({ type: "error", text1: "Please enter your email" });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push({ pathname: "/verify-token", params: { email } });
      Toast.show({ type: "success", text1: "Login link sent!" });

    } catch {
      Toast.show({ type: "error", text1: "Failed to send login link" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      <Animated.View entering={FadeIn} style={{ marginBottom: 40 }}>
        <Image 
          source={require("../assets/ecwa-logo.png")}
          style={{ width: 95, height: 95 }}
        />
      </Animated.View>

      <Animated.View entering={ZoomIn} style={styles.card}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Enter your email to receive a login link</Text>

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.6 }]}
          onPress={handleSendToken}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Login Link</Text>
          )}
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
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    textAlign: "center",
    color: Palette.textMuted,
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.xs,
    color: Palette.textDefault,
  },
  input: {
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D1D5DB",
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    fontSize: 16,
    color: Palette.textDefault,
    backgroundColor: Palette.background,
  },
  button: {
    height: 48,
    backgroundColor: Palette.accent,
    borderRadius: Radii.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xs,
    ...Shadow.cardSoft,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
