import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Payment = () => {
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const PAYSTACK_PUBLIC_KEY = "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxx";

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // 1️⃣ Initialize transaction with Paystack
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAYSTACK_PUBLIC_KEY}`,
        },
        body: JSON.stringify({
          email: "user@example.com",
          amount: 500000, // ₦5000
        }),
      });

      const data = await response.json();

      if (!data?.data?.authorization_url) {
        Alert.alert("Error", "Unable to start payment");
        setIsProcessing(false);
        return;
      }

      // 2️⃣ Open browser for payment
      const result = await WebBrowser.openBrowserAsync(
        data.data.authorization_url
      );

      // result.type can be "cancel", "dismiss", "opened"

      // 3️⃣ After closing browser, mark as success
      // (You can verify from backend if needed)
      await AsyncStorage.setItem("sundaySchoolPaid", "true");
      setIsProcessing(false);
      setIsSuccess(true);

    } catch (error) {
      Alert.alert("Error", "Payment could not be completed.");
      setIsProcessing(false);
    }
  };

  // 🎉 Success UI
  if (isSuccess) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={90} color="#16a34a" />

        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successText}>
          You now have full access to all Sunday School lessons.
        </Text>

        <TouchableOpacity
          style={styles.successButton}
          onPress={async () => {
            // Check if there's a pending navigation destination
            const pendingNav = await AsyncStorage.getItem("pendingNavigation");
            if (pendingNav) {
              try {
                const navParams = JSON.parse(pendingNav);
                // Clear the pending navigation
                await AsyncStorage.removeItem("pendingNavigation");
                // Navigate to the stored destination
                router.replace(navParams);
              } catch (error) {
                console.error("Error parsing pending navigation:", error);
                // Fallback to default navigation
                router.replace("/sunday-school-years");
              }
            } else {
              // No pending navigation, go to default
              router.replace("/sunday-school-years");
            }
          }}
        >
          <Text style={styles.successButtonText}>
            View Sunday School Lessons
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Purchase</Text>
      </View>

      {/* Order Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Order Summary</Text>

        <View style={styles.row}>
          <Text>Sunday School Full Access</Text>
          <Text style={styles.bold}>₦5,000</Text>
        </View>

        <View style={styles.rowTotal}>
          <Text style={styles.bold}>Total</Text>
          <Text style={styles.bold}>₦5,000</Text>
        </View>
      </View>

      {/* Payment Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Method</Text>
        <Text style={styles.muted}>Click below to proceed to secure payment.</Text>

        <TouchableOpacity
          style={styles.payButton}
          disabled={isProcessing}
          onPress={handlePayment}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay with Paystack</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerWrapper}>
          <View style={styles.divider} />
          <Text style={styles.testLabel}>Test Mode</Text>
          <View style={styles.divider} />
        </View>

        {/* Skip Payment for Testing */}
        <TouchableOpacity
          style={styles.testButton}
          onPress={async () => {
            await AsyncStorage.setItem("sundaySchoolPaid", "true");
            setIsSuccess(true);
            // Note: Navigation will be handled in the success UI
          }}
        >
          <Text style={styles.testButtonText}>Skip Payment (Test Mode)</Text>
        </TouchableOpacity>

        <Text style={styles.smallMuted}>Secure payment powered by Paystack</Text>
      </View>
    </View>
  );
};

export default Payment;

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    marginTop: 8,
  },
  bold: {
    fontWeight: "700",
  },
  muted: {
    color: "#6b7280",
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: "#1d4ed8",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#d1d5db",
  },
  testLabel: {
    paddingHorizontal: 8,
    fontSize: 10,
    color: "#6b7280",
    textTransform: "uppercase",
  },
  testButton: {
    borderWidth: 1,
    borderColor: "#1d4ed8",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  testButtonText: {
    color: "#1d4ed8",
    fontSize: 16,
    fontWeight: "700",
  },
  smallMuted: {
    textAlign: "center",
    marginTop: 6,
    color: "#9ca3af",
    fontSize: 12,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  successText: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
  },
  successButton: {
    backgroundColor: "#1d4ed8",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  successButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
