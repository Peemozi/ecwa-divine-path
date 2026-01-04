// src/assets/pages/Manuals.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { BookOpen, GraduationCap, ArrowLeft } from "lucide-react-native";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { userApi, isSubscriptionError } from "@/src/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const manuals = [
  {
    id: "sunday-school",
    title: "Sunday School",
    subtitle: "Weekly lessons & devotionals",
    icon: BookOpen,
    card: "#fff8e8",
    iconBg: "#ffe3ad",
  },
  {
    id: "bible-study",
    title: "Bible Study",
    subtitle: "Dig deeper into scripture",
    icon: GraduationCap,
    card: "#edf4ff",
    iconBg: "#cfe0ff",
  },
];

export default function Manuals() {
  const router = useRouter();
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  const handleManualPress = async (manualId: string) => {
    // For Bible Study, show coming soon message
    if (manualId === "bible-study") {
      Toast.show({
        type: "success",
        text1: "Coming Soon",
        text2: "Bible Study manuals will be available soon.",
        visibilityTime: 3000,
      });
      return;
    }
    
    // For Sunday School, check payment before navigating
    if (manualId === "sunday-school") {
      setIsCheckingPayment(true);
      try {
        const dash: any = await userApi.getDashboard();
        const hasAccess = dash?.user?.subscription?.hasAccess === true;
        await AsyncStorage.setItem("sundaySchoolPaid", hasAccess ? "true" : "false");
        
        if (!hasAccess) {
          setIsCheckingPayment(false);
          router.push("/payment");
          return;
        }
      } catch (error) {
        console.error("[Manuals] Payment check error:", error);
        setIsCheckingPayment(false);
        if (isSubscriptionError(error)) {
          await AsyncStorage.setItem("sundaySchoolPaid", "false");
          router.push("/payment");
          return;
        }
        // For server errors (500), check stored value as fallback
        const apiError = error as any;
        if (apiError?.status === 500) {
          // Server error - using stored value as fallback
        }
        // For network or server errors, check stored value as fallback
        try {
          const stored = await AsyncStorage.getItem("sundaySchoolPaid");
          if (stored !== "true") {
            router.push("/payment");
            return;
          }
          // If stored value says paid, allow navigation
        } catch (storageError) {
          // If we can't check storage, allow navigation
        }
      } finally {
        setIsCheckingPayment(false);
      }
    }
    
    // Navigate to manual years (within tabs structure)
    router.push({
      pathname: "/(tabs)/manuals/years",
      params: { type: manualId },
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>Manuals</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {manuals.map((manual) => {
          const Icon = manual.icon;
          return (
            <TouchableOpacity
              key={manual.id}
              style={[styles.card, { backgroundColor: manual.card }]}
              onPress={() => handleManualPress(manual.id)}
            >
              <View
                style={[styles.iconWrap, { backgroundColor: manual.iconBg }]}
              >
                <Icon size={26} color={Palette.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{manual.title}</Text>
                <Text style={styles.cardSubtitle}>{manual.subtitle}</Text>
              </View>
              <ArrowLeft
                size={18}
                color={Palette.textMuted}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e4e7f2",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef1f6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    ...Shadow.cardSoft,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Palette.textMuted,
    marginTop: 2,
  },
});
