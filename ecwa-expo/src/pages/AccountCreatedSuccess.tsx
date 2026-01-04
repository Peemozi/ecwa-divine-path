import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";

export default function AccountCreatedSuccess() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.circle}>
          <Check size={42} color="#fff" />
        </View>
        <Text style={styles.title}>Account has been created successfully</Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => router.replace("/auth")}
        >
          <Text style={styles.buttonText}>Go to Login Page</Text>
        </TouchableOpacity>
      </View>
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
    maxWidth: 420,
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.lg,
    ...Shadow.card,
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  button: {
    marginTop: Spacing.sm,
    backgroundColor: Palette.accent,
    borderRadius: Radii.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    width: "100%",
    alignItems: "center",
    ...Shadow.cardSoft,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

