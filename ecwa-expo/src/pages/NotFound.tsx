import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const NotFound = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.message}>Oops! Page not found</Text>

        <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")}>
          <Text style={styles.link}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    alignItems: "center",
  },
  code: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 12,
  },
  message: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 12,
  },
  link: {
    fontSize: 16,
    color: "#1D4ED8",
    textDecorationLine: "underline",
  },
});
