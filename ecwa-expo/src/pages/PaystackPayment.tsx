import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  AppState,
  AppStateStatus,
} from "react-native";
import { WebView } from "react-native-webview";
import { ArrowLeft, AlertCircle, User } from "lucide-react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { paymentApi, authApi } from "@/src/lib/api";
import Toast from "react-native-toast-message";

const PAYMENT_STATE_STORAGE_KEY = 'paystack_payment_state';

export default function PaystackPayment() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    manual_id?: string | string[];
    year?: string | string[];
    language?: string | string[];
    copies?: string | string[];
    total?: string | string[];
    total_kobo?: string | string[];
  }>();

  const manualId = Array.isArray(params.manual_id)
    ? params.manual_id[0]
    : params.manual_id;
  const copies = parseInt(
    Array.isArray(params.copies) ? params.copies[0] : params.copies || "1",
    10
  );
  const total = parseFloat(
    Array.isArray(params.total) ? params.total[0] : params.total || "300"
  );
  const totalInKobo = parseInt(
    Array.isArray(params.total_kobo)
      ? params.total_kobo[0]
      : params.total_kobo || "30000",
    10
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [paystackPublicKey, setPaystackPublicKey] = useState<string>("");
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const appState = useRef(AppState.currentState);

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
    loadUserData();
    loadPaystackPublicKey();
    restorePaymentState();
    
    // Handle app state changes (background/foreground)
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save payment state when popup is shown or payment is processing
  useEffect(() => {
    if (showPopup || isProcessing || paymentReference) {
      savePaymentState();
    } else {
      clearPaymentState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopup, isProcessing, paymentReference, manualId, copies, total, totalInKobo]);

  const savePaymentState = async () => {
    try {
      const state = {
        manualId,
        copies,
        total,
        totalInKobo,
        year: Array.isArray(params.year) ? params.year[0] : params.year || "",
        language: Array.isArray(params.language) ? params.language[0] : params.language || "",
        showPopup,
        isProcessing,
        paymentReference,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(PAYMENT_STATE_STORAGE_KEY, JSON.stringify(state));
    } catch (_error) {
    }
  };

  const restorePaymentState = async () => {
    try {
      const stored = await AsyncStorage.getItem(PAYMENT_STATE_STORAGE_KEY);
      if (stored) {
        const state = JSON.parse(stored);
        // Only restore if state is recent (within last 30 minutes)
        const isRecent = Date.now() - state.timestamp < 30 * 60 * 1000;
        
        if (isRecent && state.manualId === manualId) {
          // Restore state if user was in middle of payment
          if (state.showPopup || state.isProcessing) {
            // Don't auto-restore popup (user needs to retry)
            // But restore reference in case payment completed
            if (state.paymentReference) {
              setPaymentReference(state.paymentReference);
              // Check if payment was successful (this would be handled by webhook normally)
              // For now, just clear the state and let user retry
              await clearPaymentState();
              Toast.show({
                type: "info",
                text1: "Payment Interrupted",
                text2: "Your payment session was interrupted. Please try again.",
              });
            }
          }
        } else {
          // State is old or for different manual, clear it
          await clearPaymentState();
        }
      }
    } catch (_error) {
    }
  };

  const clearPaymentState = async () => {
    try {
      await AsyncStorage.removeItem(PAYMENT_STATE_STORAGE_KEY);
    } catch (_error) {
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App came to foreground
      if (showPopup || isProcessing) {
        // WebView might have lost state, close popup and let user retry
        if (showPopup) {
          setShowPopup(false);
          setIsProcessing(false);
          Toast.show({
            type: "info",
            text1: "Payment Interrupted",
            text2: "Please try the payment again.",
          });
        }
      }
    }
    
    appState.current = nextAppState;
  };

  const loadPaystackPublicKey = async () => {
    // Get Paystack public key from environment variable
    const publicKey = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_47df0e5a57e3e82902a4d75629068aececcb9917';
    setPaystackPublicKey(publicKey);
  };

  const loadUserData = async () => {
    try {
      // Get user email from AsyncStorage
      const email = await AsyncStorage.getItem("userEmail");
      if (email) {
        setUserEmail(email);
      }

      // Get user ID from API
      try {
        const user = await authApi.getAuthUser();
        if (user?.id) {
          setUserId(user.id);
        }
        if (user?.email && !email) {
          setUserEmail(user.email);
        }
      } catch (_error) {
        // Error loading user data
      }
    } catch (_error) {
      // Error loading user data
    }
  };

  const handlePaystackPayment = () => {
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

    if (!manualId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Manual ID is required",
      });
      return;
    }

    if (!userEmail) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "User email is required for payment",
      });
      return;
    }

    // Generate unique payment reference (no backend call needed)
    const timestamp = Date.now();
    const reference = `MANUAL_${manualId}_${userId || 'user'}_${timestamp}`;


    // Store reference for later use
    setPaymentReference(reference);
    
    // Open Paystack popup directly (no backend initialization)
    setShowPopup(true);
  };

  // Create HTML page with Paystack Inline JS
  const getPaystackHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://js.paystack.co/v1/inline.js"></script>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f5f5f5;
            }
            .container {
              text-align: center;
            }
            .loading {
              color: #666;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="loading">Opening payment window...</p>
          </div>
          <script>
            (function() {
              try {
                // Paystack popup setup
                const handler = PaystackPop.setup({
                  key: '${paystackPublicKey}',
                  email: '${userEmail}',
                  amount: ${totalInKobo},
                  currency: 'NGN',
                  ref: '${paymentReference}',
                  callback: function(response) {
                    // Payment successful - popup closes automatically
                    // Send success message to React Native
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'success',
                      reference: response.reference
                    }));
                  },
                  onClose: function() {
                    // User closed popup - payment cancelled
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'cancel'
                    }));
                  }
                });
                
                // Open popup immediately
                handler.openIframe();
              } catch (error) {
                // Error opening popup
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'error',
                  message: error.message || 'Failed to open payment window'
                }));
              }
            })();
          </script>
        </body>
      </html>
    `;
  };

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'success') {
        // Payment successful - popup closes automatically
        setShowPopup(false);
        await handlePaymentSuccess(data.reference);
      } else if (data.type === 'cancel') {
        // User closed popup
        setShowPopup(false);
        setIsProcessing(false);
        Toast.show({
          type: "info",
          text1: "Payment Cancelled",
          text2: "You cancelled the payment",
        });
      } else if (data.type === 'error') {
        // Error opening popup
        setShowPopup(false);
        setIsProcessing(false);
        Toast.show({
          type: "error",
          text1: "Payment Error",
          text2: data.message || "Failed to open payment window. Please try again.",
        });
      }
    } catch (_error) {
    }
  };

  const handlePaymentSuccess = async (reference: string) => {
    try {
      setIsProcessing(true);

      // Send payment reference to backend to complete purchase
      await paymentApi.payWithPaystack({
        reference: reference,
        amount: totalInKobo,
        manual_id: parseInt(manualId || "0", 10),
        copy: copies,
      });

      // Save payment to local history
      try {
        const yearParam = Array.isArray(params.year) ? params.year[0] : params.year || "";
        const languageParam = Array.isArray(params.language) ? params.language[0] : params.language || "";
        
        const paymentRecord = {
          id: `payment-${Date.now()}-${Math.random()}`,
          reference: reference,
          manual_id: parseInt(manualId || "0", 10),
          year: yearParam,
          language: languageParam,
          copies: copies,
          amount: total,
          currency: "NGN",
          status: "completed" as const,
          paidAt: new Date().toISOString(),
          description: `${yearParam} ${languageParam} Manual${copies > 1 ? ` (${copies} copies)` : ""}`.trim() || "Sunday School Manual",
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
        text1: "Payment Successful",
        text2: "Your purchase has been completed successfully.",
      });

      // Navigate to manual lessons page
      const yearParam = Array.isArray(params.year) ? params.year[0] : params.year || "";
      const languageParam = Array.isArray(params.language) ? params.language[0] : params.language || "";
      
      router.replace({
        pathname: "/(tabs)/manuals/lessons" as any,
        params: {
          type: "sunday-school",
          year: yearParam,
          language: languageParam,
        },
      });
    } catch (error: any) {

      const errorMessage = error?.message || "Could not verify payment";
      Toast.show({
        type: "error",
        text1: "Payment Verification Failed",
        text2: errorMessage,
        visibilityTime: 5000,
      });
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Palette.textDefault} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paystack Payment</Text>
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

        {/* Amount Card */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <Text style={styles.cardTitle}>Payment Amount</Text>
          <Text style={styles.amount}>₦{total}</Text>
          <Text style={styles.amountNote}>
            {copies} {copies === 1 ? "copy" : "copies"} × ₦300
          </Text>
        </View>

        {/* Instructions Card */}
        <View style={[styles.card, styles.instructionsCard]}>
          <Text style={styles.instructionsTitle}>Payment Instructions</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>
              Click the button below to open Paystack payment popup
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>
              Complete payment in the popup window
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>
              Popup closes automatically after successful payment
            </Text>
          </View>
        </View>

        {/* Payment Button */}
        <TouchableOpacity
          style={[styles.paymentButton, (isProcessing || isProfileComplete === false) && styles.paymentButtonDisabled, Shadow.card]}
          onPress={handlePaystackPayment}
          disabled={isProcessing || !userEmail || isProfileComplete === false}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.paymentButtonText}>
              Pay ₦{total} with Paystack
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isProcessing}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Paystack Popup Modal */}
      <Modal
        visible={showPopup}
        transparent
        animationType="fade"
        onRequestClose={() => {
          // Prevent closing by back button during payment
        }}
      >
        <View style={styles.popupContainer}>
          <WebView
            source={{ html: getPaystackHTML() }}
            style={styles.webView}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            onError={(_syntheticEvent) => {
              setShowPopup(false);
              setIsProcessing(false);
              Toast.show({
                type: "error",
                text1: "Payment Error",
                text2: "Failed to load payment window. Please try again.",
              });
            }}
          />
        </View>
      </Modal>
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
  amount: {
    fontSize: 32,
    fontWeight: "700",
    color: Palette.accent,
    textAlign: "center",
    marginVertical: Spacing.sm,
  },
  amountNote: {
    fontSize: 14,
    color: Palette.textMuted,
    textAlign: "center",
  },
  instructionsCard: {
    backgroundColor: "#f0f9ff",
    borderColor: "#bae6fd",
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.textDefault,
    marginBottom: Spacing.sm,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: Spacing.xs,
  },
  instructionBullet: {
    fontSize: 16,
    color: Palette.textDefault,
    marginRight: Spacing.sm,
    fontWeight: "700",
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: Palette.textDefault,
    lineHeight: 20,
  },
  paymentButton: {
    backgroundColor: Palette.accent,
    padding: Spacing.md,
    borderRadius: Radii.md,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  paymentButtonDisabled: {
    opacity: 0.6,
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  cancelButton: {
    padding: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  cancelButtonText: {
    color: Palette.textMuted,
    fontSize: 16,
    fontWeight: "600",
  },
  popupContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent",
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
