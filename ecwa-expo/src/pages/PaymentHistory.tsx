import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, CreditCard, Calendar, CheckCircle2, FileText } from "lucide-react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Palette, Spacing, Radii, Shadow } from "@/constants/theme";
import { paymentApi } from "@/src/lib/api";
import Toast from "react-native-toast-message";

const ecwaLogo = require("../assets/ecwa-logo.png");
const PAYMENT_HISTORY_STORAGE_KEY = "paymentHistory";

interface PaymentRecord {
  id: number | string;
  reference?: string;
  manual_id?: number;
  year?: number | string;
  language?: string;
  copies?: number;
  amount: number;
  currency?: string;
  status: "success" | "completed" | "pending" | "failed";
  paidAt?: string;
  paid_at?: string;
  createdAt?: string;
  created_at?: string;
  description?: string;
}

const PaymentHistory = () => {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backPressed, setBackPressed] = useState(false);

  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load payment history from local storage
      let localPayments: PaymentRecord[] = [];
      try {
        const stored = await AsyncStorage.getItem(PAYMENT_HISTORY_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Ensure it's an array
          if (Array.isArray(parsed)) {
            localPayments = parsed;
          } else if (parsed && typeof parsed === 'object') {
            // Handle case where it might be stored as a single object
            localPayments = [parsed];
          }
        }
      } catch (_error) {
        // Ignore storage errors
      }

      // Also fetch paid manuals from API to get additional info
      let paidManuals: any[] = [];
      try {
        const apiResponse = await paymentApi.getPaidManuals();
        if (Array.isArray(apiResponse)) {
          paidManuals = apiResponse;
        } else if (apiResponse && Array.isArray(apiResponse.manuals)) {
          paidManuals = apiResponse.manuals;
        } else if (apiResponse && Array.isArray(apiResponse.data)) {
          paidManuals = apiResponse.data;
        }
      } catch (_error) {
        // If API fails, continue with local storage only
      }

      // Combine local payments with paid manuals data
      const combinedPayments: PaymentRecord[] = [];

      // Start with local payments (these have full payment details)
      if (Array.isArray(localPayments)) {
        localPayments.forEach((payment) => {
          if (payment && typeof payment === 'object') {
            combinedPayments.push(payment);
          }
        });
      }

      // Add paid manuals that aren't already in local payments
      if (Array.isArray(paidManuals) && paidManuals.length > 0) {
        paidManuals.forEach((manual: any) => {
          if (!manual || typeof manual !== 'object') return;
          
          // Check if this manual is already in local payments
          const exists = localPayments.some(
            (p) => p && (
              p.manual_id === manual.id || 
              (p.year === manual.year && p.language === manual.language && manual.year && manual.language)
            )
          );

          // Include if paid is true, or if paid field doesn't exist (assume paid if in paid-manuals list)
          const isPaid = manual.paid === true || manual.paid === undefined;
          
          if (!exists && isPaid) {
            // Create a payment record from manual data
            const year = manual.year;
            const language = manual.language || "";
            const copies = manual.copies || manual.copy || 1;
            const amount = manual.amount || manual.price || (copies * 300); // Default to 300 per copy if not available
            const description = year && language 
              ? `${year} ${language} Manual${copies > 1 ? ` (${copies} copies)` : ""}`
              : manual.name || "Sunday School Manual";

            combinedPayments.push({
              id: manual.id || `manual-${Date.now()}-${Math.random()}`,
              manual_id: manual.id,
              year: year,
              language: language,
              copies: copies,
              amount: typeof amount === 'number' ? amount : parseFloat(amount) || (copies * 300),
              currency: "NGN",
              status: "completed" as const,
              paidAt: manual.paid_at || manual.paidAt || manual.created_at || manual.createdAt || new Date().toISOString(),
              description: description,
            });
          }
        });
      }

      // Sort by date (newest first)
      combinedPayments.sort((a, b) => {
        const dateA = a.paidAt ? new Date(a.paidAt).getTime() : 0;
        const dateB = b.paidAt ? new Date(b.paidAt).getTime() : 0;
        return dateB - dateA;
      });

      setPayments(combinedPayments);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to Load Payment History",
        text2: error?.message || "Could not load payment history. Please try again.",
      });
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPayments();
    }, [loadPayments])
  );

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "Invalid date";
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
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
        {isLoading ? (
          <View style={[styles.card, styles.emptyCard, Shadow.cardSoft]}>
            <ActivityIndicator size="large" color={Palette.accent} />
            <Text style={styles.emptyDescription}>Loading payment history...</Text>
          </View>
        ) : payments.length === 0 ? (
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
              onPress={() => router.push("/(tabs)/manuals")}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Browse Manuals</Text>
            </TouchableOpacity>
          </View>
        ) : (
          payments.map((payment) => (
            <View key={payment.id} style={[styles.card, Shadow.cardSoft]}>
              <View style={styles.paymentHeader}>
                <View style={styles.paymentInfo}>
                  <View style={styles.paymentIconContainer}>
                    <FileText size={20} color={Palette.accent} />
                  </View>
                  <View style={styles.paymentDetails}>
                    <Text style={styles.paymentDescription}>
                      {payment.description || `${payment.year || ""} ${payment.language || ""} Manual`.trim() || "Sunday School Manual"}
                    </Text>
                    {payment.copies && payment.copies > 1 && (
                      <Text style={styles.copiesText}>
                        {payment.copies} {payment.copies === 1 ? "copy" : "copies"}
                      </Text>
                    )}
                    <View style={styles.dateContainer}>
                      <Calendar size={12} color={Palette.textMuted} />
                      <Text style={styles.dateText}>{formatDateTime(payment.paidAt)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.paymentAmountContainer}>
                  <Text style={styles.paymentAmount}>
                    ₦{payment.amount.toLocaleString()}
                  </Text>
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
  copiesText: {
    fontSize: 13,
    color: Palette.textMuted,
    marginTop: Spacing.xs / 2,
    fontWeight: "500",
  },
});

