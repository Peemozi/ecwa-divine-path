import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { ArrowLeft, Bell, Shield, Globe, FileText } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Palette, Spacing, Radii, Shadow } from "@/constants/theme";

const ecwaLogo = require("../assets/ecwa-logo.png");

const Settings = () => {
  const router = useRouter();
  const [backPressed, setBackPressed] = useState(false);

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
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingContent}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingDescription}>{item.description}</Text>
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
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
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

