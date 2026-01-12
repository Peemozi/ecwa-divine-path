import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Image } from "expo-image";
import { ArrowLeft, Check, Eye, EyeOff, Lock } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { authApi } from "@/src/lib/api";
import { useAuthFlow } from "@/src/lib/auth-flow-state";

export default function ResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string | string[]; otp?: string | string[] }>();
  const { state, setField, resetAuthFlow } = useAuthFlow();
  const email = useMemo(() => {
    if (!params.email) return "";
    return Array.isArray(params.email) ? params.email[0] : params.email;
  }, [params.email]);
  const otp = useMemo(() => {
    if (!params.otp) return "";
    return Array.isArray(params.otp) ? params.otp[0] : params.otp;
  }, [params.otp]);

  useEffect(() => {
    if (email) setField("email", email);
  }, [email, setField]);

  useEffect(() => {
    if (otp) setField("otp", otp);
  }, [otp, setField]);

  const OTP_LENGTH = 4;
  const otpValue = state.otp || otp;
  const isOtpValid = otpValue.length === OTP_LENGTH;
  const { password, confirmPassword } = state;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isFormValid = isOtpValid && password.length >= 6 && passwordsMatch;

  const handleReset = async () => {
    if (!email || !otp) {
      Toast.show({
        type: "error",
        text1: "Session expired",
        text2: "Please request a new reset code.",
      });
      router.replace("/forgot-password");
      return;
    }

    if (!isOtpValid) {
      Toast.show({ type: "error", text1: `Enter the ${OTP_LENGTH}-digit code` });
      router.replace({ pathname: "/reset-password-otp", params: { email } });
      return;
    }

    if (!password || !confirmPassword) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }

    if (!passwordsMatch) {
      Toast.show({ type: "error", text1: "Passwords do not match" });
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(email, otpValue, password);
      setModalVisible(true);
    } catch (error) {
      // Extract error message - backend errors are already formatted
      let errorMessage = "Password reset failed";
      let errorTitle = "Reset Failed";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Format common error messages for better UX
        if (errorMessage.toLowerCase().includes('invalid') || 
            errorMessage.toLowerCase().includes('incorrect')) {
          errorTitle = "Invalid Code";
          errorMessage = "The reset code is invalid or expired. Please request a new one.";
        } else if (errorMessage.toLowerCase().includes('expired')) {
          errorTitle = "Code Expired";
          errorMessage = "This reset code has expired. Please request a new one.";
        } else if (errorMessage.toLowerCase().includes('password') && 
                   (errorMessage.toLowerCase().includes('weak') || errorMessage.toLowerCase().includes('short'))) {
          errorTitle = "Weak Password";
          errorMessage = "Password is too weak. Please choose a stronger password (at least 8 characters).";
        } else if (errorMessage.toLowerCase().includes('validation') || 
                   errorMessage.toLowerCase().includes('required')) {
          errorTitle = "Validation Error";
          errorMessage = "Please fill all required fields correctly.";
        } else if (errorMessage.includes('Network request failed') || errorMessage.includes('fetch')) {
          errorTitle = "Connection Error";
          errorMessage = "Cannot connect to server. Please check your internet connection and try again.";
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

  const handleGoToLogin = () => {
    setModalVisible(false);
    resetAuthFlow();
    router.replace("/login-email-password");
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.logoContainer}>
        <Image source={require("../assets/ecwa-logo.png")} style={styles.logo} />
      </Animated.View>

      <Animated.View entering={ZoomIn} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Lock size={28} color="#0B3B8F" />
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
            <ArrowLeft size={18} color={Palette.accent} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Create a new password for your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={[styles.input, styles.inputGrow]}
                placeholder="Enter new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                onChangeText={(value) => setField("password", value)}
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
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={[styles.input, styles.inputGrow]}
                placeholder="Re-enter new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                onChangeText={(value) => setField("confirmPassword", value)}
                value={confirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((p) => !p)}
                activeOpacity={0.8}
                style={styles.eyeButton}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} color={Palette.textMuted} />
                ) : (
                  <Eye size={18} color={Palette.textMuted} />
                )}
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.buttonPrimary, (!isFormValid || isLoading) && styles.buttonDisabled]}
            onPress={handleReset}
            disabled={!isFormValid || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Lock size={18} color="#fff" />
                <Text style={styles.buttonText}>Reset Password</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Toast />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalCircle}>
              <Check size={42} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Your password has been reset successfully</Text>
            <TouchableOpacity
              style={styles.modalButton}
              activeOpacity={0.85}
              onPress={handleGoToLogin}
            >
              <Text style={styles.modalButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.lg,
    ...Shadow.card,
  },
  modalCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  modalButton: {
    marginTop: Spacing.sm,
    backgroundColor: Palette.accent,
    borderRadius: Radii.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    width: "100%",
    alignItems: "center",
    ...Shadow.cardSoft,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

