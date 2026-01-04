import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Image } from "expo-image";
import { Mail, ArrowLeft } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { useAuthFlow } from "@/src/lib/auth-flow-state";

export default function ResetPasswordOtp() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string | string[] }>();
  const { state, setField } = useAuthFlow();
  const email = useMemo(() => {
    if (!params.email) return "";
    return Array.isArray(params.email) ? params.email[0] : params.email;
  }, [params.email]);

  useEffect(() => {
    if (email) {
      setField("email", email);
    }
  }, [email, setField]);

  const { otp } = state;
  const OTP_LENGTH = 4;
  const isOtpValid = otp.length === OTP_LENGTH;

  const handleContinue = () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Missing email",
        text2: "Please restart the reset flow.",
      });
      router.replace("/forgot-password");
      return;
    }

    if (otp.length !== OTP_LENGTH) {
      Toast.show({ type: "error", text1: `Enter the ${OTP_LENGTH}-digit code` });
      return;
    }
    router.push({ pathname: "/reset-password", params: { email, otp } });
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.logoContainer}>
        <Image source={require("../assets/ecwa-logo.png")} style={styles.logo} />
      </Animated.View>

      <Animated.View entering={ZoomIn} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Mail size={28} color="#0B3B8F" />
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
            <ArrowLeft size={18} color={Palette.accent} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Enter Reset Code</Text>
          <Text style={styles.subtitle}>We sent a reset code to your email</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reset Code</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${OTP_LENGTH}-digit code`}
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              value={otp}
              onChangeText={(value) => setField("otp", value.replace(/\D/g, ""))}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[
              styles.buttonPrimary,
              !isOtpValid && styles.buttonDisabled
            ]}
            onPress={handleContinue}
            disabled={!isOtpValid}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Continue</Text>
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
    fontSize: 18,
    letterSpacing: 4,
    color: Palette.textDefault,
    backgroundColor: Palette.background,
    textAlign: "center",
    fontWeight: "600",
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
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

