import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Wallet, CreditCard, Minus, Plus, CheckCircle2, AlertCircle, User } from "lucide-react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { paymentApi, authApi } from "@/src/lib/api";
import Toast from "react-native-toast-message";

const MANUAL_PRICE = 300; // ₦300 per copy

export default function PurchaseManual() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    manual_id?: string | string[];
    year?: string | string[];
    language?: string | string[];
  }>();

  const manualId = Array.isArray(params.manual_id)
    ? params.manual_id[0]
    : params.manual_id;
  const year = Array.isArray(params.year) ? params.year[0] : params.year;
  const language = Array.isArray(params.language)
    ? params.language[0]
    : params.language;

  const [copies, setCopies] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "wallet" | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  const total = MANUAL_PRICE * copies;
  const totalInKobo = total * 100;

  // Function to check if user profile is complete
  const checkProfileComplete = useCallback(async () => {
    setIsCheckingProfile(true);
    try {
      // First check AsyncStorage for quick access
      const userName = await AsyncStorage.getItem("userName");
      const userPhone = await AsyncStorage.getItem("userPhone");
      
      // If both are available in storage, profile is complete
      if (userName && userPhone && userName.trim() && userPhone.trim()) {
        setIsProfileComplete(true);
        setIsCheckingProfile(false);
        return;
      }

      // If not in storage, check API with timeout
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile check timeout')), 5000)
        );
        
        const userPromise = authApi.getAuthUser();
        const user = await Promise.race([userPromise, timeoutPromise]) as any;
        
        const hasName = user?.name && user.name.trim() !== "";
        const hasPhone = user?.appUser?.mobile && user.appUser.mobile.trim() !== "";
        
        if (hasName && hasPhone) {
          setIsProfileComplete(true);
          // Update AsyncStorage for future quick checks
          await AsyncStorage.setItem("userName", user.name);
          await AsyncStorage.setItem("userPhone", user.appUser.mobile);
        } else {
          setIsProfileComplete(false);
        }
      } catch (_error) {
        // If API check fails or times out, use storage values or default to incomplete
        setIsProfileComplete(userName && userPhone && userName.trim() && userPhone.trim() ? true : false);
      }
    } catch (_error) {
      // On any error, default to incomplete (safer)
      setIsProfileComplete(false);
    } finally {
      setIsCheckingProfile(false);
    }
  }, []);

  // Check profile completion on mount and when screen comes into focus
  useEffect(() => {
    checkProfileComplete();
  }, [checkProfileComplete]);

  // Re-check profile when screen comes into focus (e.g., after returning from profile page)
  useFocusEffect(
    useCallback(() => {
      checkProfileComplete();
    }, [checkProfileComplete])
  );

  useEffect(() => {
    const loadWalletBalance = async () => {
      try {
        const balance = await paymentApi.getWalletBalance();
        setWalletBalance(balance.balance);
      } catch (_error) {
        // Wallet balance is optional - continue without it
      } finally {
        setIsLoadingBalance(false);
      }
    };
    loadWalletBalance();
  }, []);

  const handlePurchase = async () => {
    // Check profile completion before allowing payment
    if (isProfileComplete === false) {
      Toast.show({
        type: "error",
        text1: "Profile Incomplete",
        text2: "Please complete your profile (name and phone number) before making a payment.",
        visibilityTime: 5000,
      });
      return;
    }

    if (!paymentMethod || !manualId) {
      Toast.show({
        type: "error",
        text1: "Please select a payment method",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (paymentMethod === "wallet") {
        // Pay from wallet
        await paymentApi.payWithWallet({
          manual_id: parseInt(manualId, 10),
          copy: copies,
        });

        // Save payment to local history
        try {
          const paymentRecord = {
            id: `payment-${Date.now()}-${Math.random()}`,
            manual_id: parseInt(manualId, 10),
            year: year || "",
            language: language || "",
            copies: copies,
            amount: total,
            currency: "NGN",
            status: "completed" as const,
            paidAt: new Date().toISOString(),
            description: `${year || ""} ${language || ""} Manual${copies > 1 ? ` (${copies} copies)` : ""}`.trim() || "Sunday School Manual",
          };
          
          const existing = await AsyncStorage.getItem("paymentHistory");
          const payments = existing ? JSON.parse(existing) : [];
          payments.unshift(paymentRecord); // Add to beginning
          await AsyncStorage.setItem("paymentHistory", JSON.stringify(payments));
        } catch (_error) {
          // Ignore storage errors
        }

        Toast.show({
          type: "success",
          text1: "Purchase Successful",
          text2: "You now have access to this manual.",
        });

        // Navigate to manual lessons page
        router.replace({
          pathname: "/(tabs)/manuals/lessons" as any,
          params: {
            type: "sunday-school",
            year: year || "",
            language: language || "",
          },
        });
      } else if (paymentMethod === "paystack") {
        // Navigate to Paystack payment screen
        router.push({
          pathname: "/paystack-payment" as any,
          params: {
            manual_id: manualId,
            year: year || "",
            language: language || "",
            copies: String(copies),
            total: String(total),
            total_kobo: String(totalInKobo),
          },
        });
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Could not process payment";
      const status = error?.status;
      
      // Format error message based on status code and message
      let errorTitle = "Payment Failed";
      let errorText = errorMessage;
      
      // Handle specific error cases
      if (status === 404) {
        errorTitle = "Service Unavailable";
        errorText = "Payment service is currently unavailable. Please try again later or contact support.";
      } else if (status === 500) {
        errorTitle = "Server Error";
        errorText = "An error occurred while processing your payment. Please try again later or contact support.";
      } else if (errorMessage.toLowerCase().includes("insufficient") || errorMessage.toLowerCase().includes("balance")) {
        errorTitle = "Insufficient Balance";
        errorText = "You don't have enough balance in your wallet. Please top up your wallet or use Paystack payment.";
      } else if (errorMessage.toLowerCase().includes("not found") || errorMessage.toLowerCase().includes("could not be found")) {
        errorTitle = "Service Unavailable";
        errorText = "Payment service endpoint not found. Please contact support.";
      } else if (errorMessage.toLowerCase().includes("network") || errorMessage.toLowerCase().includes("fetch")) {
        errorTitle = "Connection Error";
        errorText = "Cannot connect to server. Please check your internet connection and try again.";
      }
      
      Toast.show({
        type: "error",
        text1: errorTitle,
        text2: errorText,
        visibilityTime: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canUseWallet = walletBalance !== null && walletBalance >= total;
  const manualInfo = `${year || ""} ${language || ""}`.trim() || "Manual";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // Navigate back to manual language selection
            router.back();
          }}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Palette.textDefault} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Purchase Manual</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Completion Warning */}
        {isCheckingProfile ? (
          <View style={[styles.card, styles.profileCheckCard]}>
            <ActivityIndicator size="small" color={Palette.accent} />
            <Text style={styles.profileCheckText}>Checking profile...</Text>
          </View>
        ) : isProfileComplete === false ? (
          <View style={[styles.card, styles.profileWarningCard]}>
            <View style={styles.profileWarningHeader}>
              <AlertCircle size={24} color="#dc2626" />
              <Text style={styles.profileWarningTitle}>Profile Incomplete</Text>
            </View>
            <Text style={styles.profileWarningText}>
              Please complete your profile by setting your name and phone number before you can proceed to make payments for any Sunday School manual.
            </Text>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push("/(tabs)/profile")}
              activeOpacity={0.7}
            >
              <User size={18} color="#fff" />
              <Text style={styles.profileButtonText}>Go to Profile</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Manual Info */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <Text style={styles.cardTitle}>Manual</Text>
          <Text style={styles.manualInfo}>{manualInfo}</Text>
          <Text style={styles.price}>₦{MANUAL_PRICE} per copy</Text>
        </View>

        {/* Quantity Selection */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <Text style={styles.cardTitle}>Number of Copies</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setCopies(Math.max(1, copies - 1))}
              activeOpacity={0.7}
              disabled={copies <= 1}
            >
              <Minus size={20} color={copies <= 1 ? Palette.textMuted : Palette.textDefault} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{copies}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setCopies(copies + 1)}
              activeOpacity={0.7}
            >
              <Plus size={20} color={Palette.textDefault} />
            </TouchableOpacity>
          </View>
          <Text style={styles.total}>Total: ₦{total}</Text>
        </View>

        {/* Payment Method */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <Text style={styles.cardTitle}>Payment Method</Text>

          {/* Wallet Option */}
          {isLoadingBalance ? (
            <ActivityIndicator size="small" color={Palette.accent} style={styles.loading} />
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === "wallet" && styles.paymentOptionSelected,
                  !canUseWallet && styles.paymentOptionDisabled,
                ]}
                onPress={() => canUseWallet && setPaymentMethod("wallet")}
                activeOpacity={0.7}
                disabled={!canUseWallet}
              >
                <View style={styles.paymentOptionLeft}>
                  <Wallet
                    size={24}
                    color={canUseWallet ? Palette.accent : Palette.textMuted}
                  />
                  <View style={styles.paymentOptionText}>
                    <Text
                      style={[
                        styles.paymentOptionTitle,
                        !canUseWallet && styles.paymentOptionTitleDisabled,
                      ]}
                    >
                      Pay from Wallet
                    </Text>
                    <Text style={styles.paymentOptionSubtitle}>
                      {walletBalance !== null
                        ? `Balance: ₦${walletBalance.toFixed(2)}`
                        : "Balance unavailable"}
                      {!canUseWallet && walletBalance !== null && (
                        <Text style={styles.insufficientText}>
                          {" "}
                          (Insufficient balance)
                        </Text>
                      )}
                    </Text>
                  </View>
                </View>
                {paymentMethod === "wallet" && (
                  <CheckCircle2 size={24} color={Palette.accent} />
                )}
              </TouchableOpacity>

              {/* Paystack Option */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === "paystack" && styles.paymentOptionSelected,
                ]}
                onPress={() => setPaymentMethod("paystack")}
                activeOpacity={0.7}
              >
                <View style={styles.paymentOptionLeft}>
                  <CreditCard
                    size={24}
                    color={Palette.accent}
                  />
                  <View style={styles.paymentOptionText}>
                    <Text style={styles.paymentOptionTitle}>Pay with Paystack</Text>
                    <Text style={styles.paymentOptionSubtitle}>
                      Transfer to dedicated account
                    </Text>
                  </View>
                </View>
                {paymentMethod === "paystack" && (
                  <CheckCircle2 size={24} color={Palette.accent} />
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          style={[
            styles.purchaseButton,
            (!paymentMethod || isLoading || isProfileComplete === false) && styles.purchaseButtonDisabled,
            Shadow.card,
          ]}
          onPress={handlePurchase}
          disabled={!paymentMethod || isLoading || isProfileComplete === false}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.purchaseButtonText}>
              Purchase - ₦{total}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

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
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  card: {
    backgroundColor: Palette.background,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
    marginBottom: Spacing.sm,
  },
  manualInfo: {
    fontSize: 16,
    color: Palette.textDefault,
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.accent,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
    marginVertical: Spacing.md,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.canvas,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  quantityText: {
    fontSize: 24,
    fontWeight: "700",
    color: Palette.textDefault,
    minWidth: 40,
    textAlign: "center",
  },
  total: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    marginBottom: Spacing.sm,
  },
  paymentOptionSelected: {
    borderColor: Palette.accent,
    backgroundColor: "#f0f7ff",
  },
  paymentOptionDisabled: {
    opacity: 0.5,
  },
  paymentOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  paymentOptionText: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.textDefault,
    marginBottom: 2,
  },
  paymentOptionTitleDisabled: {
    color: Palette.textMuted,
  },
  paymentOptionSubtitle: {
    fontSize: 14,
    color: Palette.textMuted,
  },
  insufficientText: {
    color: "#dc2626",
    fontWeight: "600",
  },
  loading: {
    padding: Spacing.md,
  },
  purchaseButton: {
    backgroundColor: Palette.accent,
    padding: Spacing.md,
    borderRadius: Radii.md,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  profileCheckCard: {
    backgroundColor: "#f0f9ff",
    borderColor: "#bae6fd",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  profileCheckText: {
    fontSize: 14,
    color: Palette.textDefault,
  },
  profileWarningCard: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    marginBottom: Spacing.md,
  },
  profileWarningHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  profileWarningTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#dc2626",
  },
  profileWarningText: {
    fontSize: 14,
    color: Palette.textDefault,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  profileButton: {
    backgroundColor: Palette.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radii.md,
  },
  profileButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
