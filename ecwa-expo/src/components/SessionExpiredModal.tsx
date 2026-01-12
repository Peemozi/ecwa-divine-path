import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { useSessionExpired } from "@/src/lib/session-expired-context";
import { removeTokens, clearAllUserData } from "@/src/lib/api";

export default function SessionExpiredModal() {
  const { isSessionExpired, hideSessionExpired } = useSessionExpired();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear all tokens and user data
      await removeTokens();
      await clearAllUserData();
      // Hide modal
      hideSessionExpired();
      // Navigate to auth screen
      router.replace("/auth");
    } catch (_error) {
      // Even if there's an error, try to navigate
      hideSessionExpired();
      router.replace("/auth");
    }
  };

  return (
    <Modal
      visible={isSessionExpired}
      transparent
      animationType="fade"
      onRequestClose={() => {
        // Prevent closing by back button - user must logout
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.iconContainer}>
            <LogOut size={32} color="#fff" />
          </View>
          
          <Text style={styles.title}>Session Expired</Text>
          
          <Text style={styles.message}>
            For your security, your session has ended. Please log in again to continue using the app.
          </Text>
          
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Palette.textDefault,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: Palette.textMuted,
    textAlign: "center",
    lineHeight: 22,
    marginTop: Spacing.xs,
  },
  logoutButton: {
    marginTop: Spacing.sm,
    backgroundColor: "#DC2626",
    borderRadius: Radii.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    width: "100%",
    alignItems: "center",
    ...Shadow.cardSoft,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
