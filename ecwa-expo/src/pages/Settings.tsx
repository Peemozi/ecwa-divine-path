import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Bell, Shield, Globe, FileText, Phone } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Palette, Spacing, Radii, Shadow } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "@/src/lib/api";

const ecwaLogo = require("../assets/ecwa-logo.png");

const Settings = () => {
  const router = useRouter();
  const [backPressed, setBackPressed] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [isLoadingPhone, setIsLoadingPhone] = useState(true);

  useEffect(() => {
    const loadPhoneNumber = async () => {
      try {
        const phone = await AsyncStorage.getItem("userPhone");
        if (phone) {
          setUserPhone(phone);
        }
        // Also try to fetch from API
        try {
          const user = await authApi.getAuthUser();
          if (user?.appUser?.mobile) {
            setUserPhone(user.appUser.mobile);
            await AsyncStorage.setItem("userPhone", user.appUser.mobile);
          }
        } catch (_error) {
          // API fetch failed, use stored value
        }
      } catch (_error) {
        // Ignore errors
      } finally {
        setIsLoadingPhone(false);
      }
    };
    loadPhoneNumber();
  }, []);

  const settingsSections = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Push Notifications", description: "Receive updates and reminders" },
        { label: "Email Notifications", description: "Get updates via email" },
      ],
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      items: [
        { label: "Privacy Policy", description: "View our privacy policy" },
        { label: "Data Management", description: "Manage your data" },
      ],
    },
    {
      title: "General",
      icon: Globe,
      items: [
        { label: "Language", description: "English" },
        { label: "App Version", description: "1.0.0" },
      ],
    },
    {
      title: "Contact",
      icon: Phone,
      items: [
        { 
          label: "Phone Number", 
          description: isLoadingPhone ? "Loading..." : (userPhone || "Not set"),
          isPhone: true,
        },
      ],
    },
    {
      title: "About",
      icon: FileText,
      items: [
        { label: "Terms of Service", description: "Read our terms of service" },
        { label: "Contact Support", description: "Get help from our team" },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          onPressIn={() => setBackPressed(true)}
          onPressOut={() => setBackPressed(false)}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={24}
            color={backPressed ? Palette.accent : Palette.textDefault}
          />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Image source={ecwaLogo} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={[styles.sectionCard, Shadow.cardSoft]}>
            <View style={styles.sectionHeader}>
              <section.icon size={20} color={Palette.accent} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => {
                    // Handle setting item press
                    if ((item as any).isPhone) {
                      // Navigate to Profile page to edit phone number
                      router.push("/(tabs)/profile");
                    }
                  }}
                  activeOpacity={0.7}
                  disabled={(item as any).isPhone && isLoadingPhone}
                >
                  <View style={styles.settingContent}>
                    <View style={styles.settingLabelRow}>
                      {(item as any).isPhone && (
                        <Phone size={16} color={Palette.textMuted} style={styles.phoneIcon} />
                      )}
                      <Text style={styles.settingLabel}>{item.label}</Text>
                    </View>
                    {isLoadingPhone && (item as any).isPhone ? (
                      <ActivityIndicator size="small" color={Palette.accent} style={styles.phoneLoading} />
                    ) : (
                      <Text style={styles.settingDescription}>{item.description}</Text>
                    )}
                  </View>
                </TouchableOpacity>
                {itemIndex < section.items.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.background,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  sectionCard: {
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  settingItem: {
    paddingVertical: Spacing.sm,
  },
  settingContent: {
    flex: 1,
  },
  settingLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  phoneIcon: {
    marginRight: 2,
  },
  phoneLoading: {
    marginTop: Spacing.xs,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Palette.textDefault,
  },
  settingDescription: {
    fontSize: 14,
    color: Palette.textMuted,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: Spacing.sm,
  },
});

