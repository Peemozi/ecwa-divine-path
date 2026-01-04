import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { ArrowLeft, Info, Globe, Mail, ExternalLink } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Palette, Spacing, Radii, Shadow } from "@/constants/theme";

const ecwaLogo = require("../assets/ecwa-logo.png");

const About = () => {
  const router = useRouter();
  const [backPressed, setBackPressed] = useState(false);

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
          <Text style={styles.headerTitle}>About</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* App Logo & Name */}
        <View style={styles.logoSection}>
          <Image source={ecwaLogo} style={styles.appLogo} resizeMode="contain" />
          <Text style={styles.appName}>ECWA Media Center</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>

        {/* About Section */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <View style={styles.cardHeader}>
            <Info size={20} color={Palette.accent} />
            <Text style={styles.cardTitle}>About</Text>
          </View>
          <Text style={styles.description}>
            ECWA Media Center is a comprehensive mobile application designed to provide
            access to Sunday School lessons, Bible study materials, hymns, and interactive
            quizzes for members of the Evangelical Church Winning All (ECWA).
          </Text>
        </View>

        {/* Contact Section */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <View style={styles.cardHeader}>
            <Mail size={20} color={Palette.accent} />
            <Text style={styles.cardTitle}>Contact</Text>
          </View>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => Linking.openURL("mailto:info@ecwa-divine-path.com")}
            activeOpacity={0.7}
          >
            <Text style={styles.contactLabel}>Email</Text>
            <View style={styles.contactValue}>
              <Text style={styles.contactText}>info@ecwa-divine-path.com</Text>
              <ExternalLink size={16} color={Palette.textMuted} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Links Section */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <View style={styles.cardHeader}>
            <Globe size={20} color={Palette.accent} />
            <Text style={styles.cardTitle}>Links</Text>
          </View>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => {
              // Open privacy policy
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.linkLabel}>Privacy Policy</Text>
            <ExternalLink size={18} color={Palette.textMuted} />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => {
              // Open terms of service
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.linkLabel}>Terms of Service</Text>
            <ExternalLink size={18} color={Palette.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} ECWA Media Center. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
};

export default About;

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
  logoSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  appLogo: {
    width: 120,
    height: 120,
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  appVersion: {
    fontSize: 14,
    color: Palette.textMuted,
  },
  card: {
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  description: {
    fontSize: 14,
    color: Palette.textMuted,
    lineHeight: 20,
  },
  contactItem: {
    marginTop: Spacing.sm,
  },
  contactLabel: {
    fontSize: 14,
    color: Palette.textMuted,
    marginBottom: Spacing.xs,
  },
  contactValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  contactText: {
    fontSize: 16,
    fontWeight: "500",
    color: Palette.accent,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Palette.textDefault,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: Spacing.sm,
  },
  copyright: {
    fontSize: 12,
    color: Palette.textMuted,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});

