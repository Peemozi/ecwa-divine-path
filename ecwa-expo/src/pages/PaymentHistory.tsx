import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { ArrowLeft, CreditCard, Calendar, CheckCircle2 } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Palette, Spacing, Radii, Shadow } from "@/constants/theme";

const ecwaLogo = require("../assets/ecwa-logo.png");

interface PaymentRecord {
  id: string;
  amount: string;
  date: string;
  status: "completed" | "pending" | "failed";
  description: string;
}

const PaymentHistory = () => {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [backPressed, setBackPressed] = useState(false);

  useEffect(() => {
    // Load payment history from AsyncStorage
    const loadPayments = async () => {
      try {
        const raw = await AsyncStorage.getItem("paymentHistory");
        if (raw) {
          const parsed: PaymentRecord[] = JSON.parse(raw);
          setPayments(parsed);
        }
      } catch (err) {
        console.error("Error loading payment history:", err);
      }
    };
    loadPayments();
  }, []);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#16a34a";
      case "pending":
        return "#ca8a04";
      case "failed":
        return "#dc2626";
      default:
        return Palette.textMuted;
    }
  };

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
          <Text style={styles.headerTitle}>Payment History</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {payments.length === 0 ? (
          <View style={[styles.card, styles.emptyCard, Shadow.cardSoft]}>
            <View style={styles.emptyIconContainer}>
              <CreditCard size={32} color={Palette.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Payment History</Text>
            <Text style={styles.emptyDescription}>
              Your payment history will appear here once you make a payment.
            </Text>
            <TouchableOpacity
              style={[styles.button, Shadow.card]}
              onPress={() => router.push("/payment")}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Make a Payment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          payments.map((payment) => (
            <View key={payment.id} style={[styles.card, Shadow.cardSoft]}>
              <View style={styles.paymentHeader}>
                <View style={styles.paymentInfo}>
                  <View style={styles.paymentIconContainer}>
                    <CreditCard size={20} color={Palette.accent} />
                  </View>
                  <View style={styles.paymentDetails}>
                    <Text style={styles.paymentDescription}>{payment.description}</Text>
                    <View style={styles.dateContainer}>
                      <Calendar size={12} color={Palette.textMuted} />
                      <Text style={styles.dateText}>{formatDate(payment.date)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.paymentAmountContainer}>
                  <Text style={styles.paymentAmount}>₦{payment.amount}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(payment.status) + "20" },
                    ]}
                  >
                    <CheckCircle2
                      size={12}
                      color={getStatusColor(payment.status)}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(payment.status) },
                      ]}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default PaymentHistory;

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
  card: {
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.canvas,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Palette.textDefault,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: 14,
    color: Palette.textMuted,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  button: {
    backgroundColor: Palette.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  paymentInfo: {
    flexDirection: "row",
    flex: 1,
    gap: Spacing.md,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: "#E0F7FA",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentDetails: {
    flex: 1,
  },
  paymentDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  dateText: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  paymentAmountContainer: {
    alignItems: "flex-end",
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.md,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

