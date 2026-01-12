import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import { Brain, GraduationCap } from "lucide-react-native";
import { Palette, Spacing, Radii, Shadow } from "@/constants/theme";
import Toast from "react-native-toast-message";

const ecwaLogo = require("../assets/ecwa-logo.png");

const Quiz = () => {

  const quizTypes = [
    {
      id: "sunday-school",
      title: "Sunday School Quiz",
      icon: Brain,
      description: "Test your Sunday School knowledge",
      iconBg: "#FFF7E0",
      iconColor: "#FFE9B3",
    },
    {
      id: "bible-study",
      title: "Bible Study Quiz",
      icon: GraduationCap,
      description: "Test your Bible Study knowledge",
      iconBg: "#E0F7FA",
      iconColor: "#B3E5FC",
    },
  ];

  const goToYears = (_id: string) => {
    // Show coming soon for all quiz types
    Toast.show({
      type: "success",
      text1: "Coming Soon",
      text2: "Quiz features will be available soon.",
      visibilityTime: 3000,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={ecwaLogo} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Quiz</Text>
        </View>
      </View>

      {/* Quiz Cards */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {quizTypes.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, Shadow.cardSoft]}
              onPress={() => goToYears(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                <View style={[styles.iconInner, { backgroundColor: item.iconColor }]}>
                  <Icon size={28} color={Palette.accent} />
                </View>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  container: {
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
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  iconContainer: {
    height: 56,
    width: 56,
    borderRadius: Radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  iconInner: {
    height: 48,
    width: 48,
    borderRadius: Radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    fontSize: 14,
    color: Palette.textMuted,
  },
});
