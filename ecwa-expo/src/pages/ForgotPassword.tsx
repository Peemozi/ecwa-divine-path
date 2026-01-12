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
import Toast from "react-native-toast-message";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Image } from "expo-image";
import { Mail, ArrowLeft } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { authApi } from "@/src/lib/api";
import { useAuthFlow } from "@/src/lib/auth-flow-state";

export default function ForgotPassword() {
  const router = useRouter();
  const { state, setField } = useAuthFlow();
  const { email } = state;
  const [isLoading, setIsLoading] = useState(false);

  const handleSendReset = async () => {
    if (!email) {
      Toast.show({ type: "error", text1: "Please enter your email" });
      return;
    }
    setIsLoading(true);
    try {
      await authApi.sendPasswordResetCode(email);
      Toast.show({ type: "success", text1: "Reset code sent! Check your email." });
      router.push({ pathname: "/reset-password-otp", params: { email } });
    } catch (error) {
      // Extract error message - backend errors are already formatted
      let errorMessage = "Failed to send reset code";
      let errorTitle = "Request Failed";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Format common error messages for better UX
        if (errorMessage.toLowerCase().includes('not found') || 
            errorMessage.toLowerCase().includes('does not exist')) {
          errorTitle = "Email Not Found";
          errorMessage = "No account found with this email address. Please check your email or create an account.";
        } else if (errorMessage.toLowerCase().includes('invalid') && 
                   errorMessage.toLowerCase().includes('email')) {
          errorTitle = "Invalid Email";
          errorMessage = "Please enter a valid email address.";
        } else if (errorMessage.includes('Network request failed') || errorMessage.includes('fetch')) {
          errorTitle = "Connection Error";
          errorMessage = "Cannot connect to server. Please check your internet connection and try again.";
        } else if (errorMessage.toLowerCase().includes('too many') || 
                   errorMessage.toLowerCase().includes('rate limit')) {
          errorTitle = "Too Many Requests";
          errorMessage = "Please wait a few minutes before requesting another reset code.";
        }
      }
      
      Toast.show({ 
        type: "error", 
        text1: errorTitle,
        text2: errorMessage,
        visibilityTime: 5000
      });
    } finally {
      setIsLoading(false);
    }
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
          <TouchableOpacity onPress={() => router.replace("/login-email-password")} style={styles.backButton} activeOpacity={0.8}>
            <ArrowLeft size={18} color={Palette.accent} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email to receive a reset code</Text>
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
              onChangeText={(value) => setField("email", value)}
              value={email}
            />
          </View>

          <TouchableOpacity
            style={[styles.buttonPrimary, isLoading && styles.buttonDisabled]}
            onPress={handleSendReset}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Mail size={18} color="#fff" />
                <Text style={styles.buttonText}>Send Reset Code</Text>
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

