import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import { ArrowLeft, HelpCircle, Mail, BookOpen, ExternalLink } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Palette, Spacing, Radii, Shadow } from "@/constants/theme";

const ecwaLogo = require("../assets/ecwa-logo.png");

const HelpSupport = () => {
  const router = useRouter();
  const [backPressed, setBackPressed] = useState(false);

  const helpSections = [
    {
      title: "Get Help",
      icon: HelpCircle,
      items: [
        {
          label: "FAQs",
          description: "Frequently asked questions",
          action: () => {
            // Navigate to FAQs or show modal
          },
        },
        {
          label: "Contact Support",
          description: "Get in touch with our team",
          action: () => {
            Linking.openURL("mailto:support@ecwa-divine-path.com");
          },
        },
        {
          label: "Live Chat",
          description: "Chat with us in real-time",
          action: () => {
            // Open live chat
          },
        },
      ],
    },
    {
      title: "Resources",
      icon: BookOpen,
      items: [
        {
          label: "User Guide",
          description: "Learn how to use the app",
          action: () => {
            // Open user guide
          },
        },
        {
          label: "Video Tutorials",
          description: "Watch step-by-step tutorials",
          action: () => {
            // Open video tutorials
          },
        },
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
          <Text style={styles.headerTitle}>Help & Support</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {helpSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={[styles.sectionCard, Shadow.cardSoft]}>
            <View style={styles.sectionHeader}>
              <section.icon size={20} color={Palette.accent} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex}>
                <TouchableOpacity
                  style={styles.helpItem}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <View style={styles.helpContent}>
                    <Text style={styles.helpLabel}>{item.label}</Text>
                    <Text style={styles.helpDescription}>{item.description}</Text>
                  </View>
                  <ExternalLink size={18} color={Palette.textMuted} />
                </TouchableOpacity>
                {itemIndex < section.items.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Contact Info */}
        <View style={[styles.contactCard, Shadow.cardSoft]}>
          <View style={styles.contactHeader}>
            <Mail size={20} color={Palette.accent} />
            <Text style={styles.contactTitle}>Contact Us</Text>
          </View>
          <Text style={styles.contactText}>
            Email: support@ecwa-divine-path.com
          </Text>
          <Text style={styles.contactText}>
            We typically respond within 24 hours.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpSupport;

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
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  helpContent: {
    flex: 1,
  },
  helpLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  helpDescription: {
    fontSize: 14,
    color: Palette.textMuted,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: Spacing.sm,
  },
  contactCard: {
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: Spacing.lg,
    marginTop: Spacing.sm,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  contactText: {
    fontSize: 14,
    color: Palette.textMuted,
    marginBottom: Spacing.xs,
  },
});

