import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { ArrowLeft, User, Type, Edit2, Check, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { Palette, Spacing, Radii, Shadow } from "@/constants/theme";
import { authApi, removeTokens, userApi, clearAllUserData } from "@/src/lib/api";
import { useFontSize } from "@/src/lib/font-size-context";
import Toast from "react-native-toast-message";

const ecwaLogo = require("../assets/ecwa-logo.png");

const Profile = () => {
  const router = useRouter();
  const { fontSize, setFontSize } = useFontSize();
  const [userEmail, setUserEmail] = useState("Guest");
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userDcc, setUserDcc] = useState<string | null>(null);
  const [userLcb, setUserLcb] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [dccInput, setDccInput] = useState("");
  const [lcbInput, setLcbInput] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [backPressed, setBackPressed] = useState(false);

  const loadUserData = async () => {
    setIsLoadingProfile(true);
    try {
      // Load from AsyncStorage first for fast initial render
      const email = await AsyncStorage.getItem("userEmail");
      const name = await AsyncStorage.getItem("userName");
      const phone = await AsyncStorage.getItem("userPhone");
      const dcc = await AsyncStorage.getItem("userDcc");
      const lcb = await AsyncStorage.getItem("userLcb");
      
      if (email) setUserEmail(email);
      if (name) {
        setUserName(name);
        setNameInput(name);
      }
      if (phone) {
        setUserPhone(phone);
        setPhoneInput(phone);
      }
      if (dcc) {
        setUserDcc(dcc);
        setDccInput(dcc);
      }
      if (lcb) {
        setUserLcb(lcb);
        setLcbInput(lcb);
      }
      
      // Also try to fetch from API to get the latest data
      try {
        const user = await authApi.getAuthUser();
        if (user) {
          // Always use API data as source of truth
          setUserEmail(user.email || email || "Guest");
          
          // Update name - use API value if available, otherwise keep stored value
          const nameValue = user.name || null;
          if (nameValue) {
            setUserName(nameValue);
            setNameInput(nameValue);
            await AsyncStorage.setItem("userName", nameValue);
          } else if (name) {
            // API returned null but we have stored value - keep stored value
            // Don't clear it as it might be a new save that hasn't synced yet
            setUserName(name);
            setNameInput(name);
          } else {
            // No stored value and API returns null - clear
            setUserName(null);
            setNameInput("");
            await AsyncStorage.removeItem("userName");
          }
          
          // Update phone - use API value if available, otherwise keep stored value
          const mobile = user.appUser?.mobile || null;
          if (mobile) {
            setUserPhone(mobile);
            setPhoneInput(mobile);
            await AsyncStorage.setItem("userPhone", mobile);
          } else if (phone) {
            // API returned null but we have stored value - keep stored value
            setUserPhone(phone);
            setPhoneInput(phone);
          } else {
            // No stored value and API returns null - clear
            setUserPhone(null);
            setPhoneInput("");
            await AsyncStorage.removeItem("userPhone");
          }
          
          // Update DCC - use API value if available, otherwise keep stored value
          const dccValue = user.appUser?.dcc || null;
          if (dccValue) {
            setUserDcc(dccValue);
            setDccInput(dccValue);
            await AsyncStorage.setItem("userDcc", dccValue);
          } else if (dcc) {
            // API returned null but we have stored value - keep stored value
            setUserDcc(dcc);
            setDccInput(dcc);
          } else {
            // No stored value and API returns null - clear
            setUserDcc(null);
            setDccInput("");
            await AsyncStorage.removeItem("userDcc");
          }
          
          // Update LCB - use API value if available, otherwise keep stored value
          const lcbValue = user.appUser?.lcb || null;
          if (lcbValue) {
            setUserLcb(lcbValue);
            setLcbInput(lcbValue);
            await AsyncStorage.setItem("userLcb", lcbValue);
          } else if (lcb) {
            // API returned null but we have stored value - keep stored value
            setUserLcb(lcb);
            setLcbInput(lcb);
          } else {
            // No stored value and API returns null - clear
            setUserLcb(null);
            setLcbInput("");
            await AsyncStorage.removeItem("userLcb");
          }
        }
      } catch (_error) {
        // API fetch failed, use stored values as fallback
        // Keep all stored values if API call fails
      }
    } catch (_error) {
      // Ignore errors
      // Error handled - user data will fallback to stored values
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // Reload data when screen comes into focus (e.g., after saving)
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const handleSaveProfile = async () => {
    if (!nameInput.trim()) {
      Toast.show({
        type: "error",
        text1: "Name Required",
        text2: "Please enter your name",
      });
      return;
    }

    if (!phoneInput.trim()) {
      Toast.show({
        type: "error",
        text1: "Phone Number Required",
        text2: "Please enter a valid phone number",
      });
      return;
    }

    setIsSavingProfile(true);
    try {
      const updateData: {
        name: string;
        mobile: string;
        dcc?: string;
        lcb?: string;
      } = {
        name: nameInput.trim(),
        mobile: phoneInput.trim(),
      };
      
      // Include optional fields if provided
      if (dccInput.trim()) {
        updateData.dcc = dccInput.trim();
      }
      
      if (lcbInput.trim()) {
        updateData.lcb = lcbInput.trim();
      }
      
      // Save values before API call
      const savedName = nameInput.trim();
      const savedPhone = phoneInput.trim();
      const dccValue = dccInput.trim() || null;
      const lcbValue = lcbInput.trim() || null;
      
      // Call API to update profile
      const response = await userApi.updateProfile(updateData);
      
      // Update local state from API response (preferred) or saved values
      if (response) {
        // Use API response data if available
        const apiName = response.name || savedName;
        const apiPhone = response.appUser?.mobile || savedPhone;
        const apiDcc = response.appUser?.dcc !== undefined ? (response.appUser.dcc || null) : dccValue;
        const apiLcb = response.appUser?.lcb !== undefined ? (response.appUser.lcb || null) : lcbValue;
        
        // Update state
        setUserName(apiName);
        setUserPhone(apiPhone);
        setUserDcc(apiDcc);
        setUserLcb(apiLcb);
        
        // Update input fields to match saved values
        setNameInput(apiName);
        setPhoneInput(apiPhone);
        setDccInput(apiDcc || "");
        setLcbInput(apiLcb || "");
        
        // Update AsyncStorage with API response data
        await AsyncStorage.multiSet([
          ["userName", apiName],
          ["userPhone", apiPhone],
        ]);
        
        // Save DCC and LCB to AsyncStorage
        if (apiDcc) {
          await AsyncStorage.setItem("userDcc", apiDcc);
        } else {
          await AsyncStorage.removeItem("userDcc");
        }
        
        if (apiLcb) {
          await AsyncStorage.setItem("userLcb", apiLcb);
        } else {
          await AsyncStorage.removeItem("userLcb");
        }
      } else {
        // Fallback: use saved values if API response is empty
        setUserName(savedName);
        setUserPhone(savedPhone);
        setUserDcc(dccValue);
        setUserLcb(lcbValue);
        
        await AsyncStorage.multiSet([
          ["userName", savedName],
          ["userPhone", savedPhone],
        ]);
        
        if (dccValue) {
          await AsyncStorage.setItem("userDcc", dccValue);
        } else {
          await AsyncStorage.removeItem("userDcc");
        }
        
        if (lcbValue) {
          await AsyncStorage.setItem("userLcb", lcbValue);
        } else {
          await AsyncStorage.removeItem("userLcb");
        }
      }
      
      setIsEditingProfile(false);
      
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been saved successfully",
      });
      
      // Reload data to ensure everything is in sync
      await loadUserData();
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || "Failed to update profile. Please try again.";
      
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: errorMessage,
        visibilityTime: 5000,
      });
      
      // Don't clear the input fields on error - let user retry
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setNameInput(userName || "");
    setPhoneInput(userPhone || "");
    setDccInput(userDcc || "");
    setLcbInput(userLcb || "");
    setIsEditingProfile(false);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout().catch(() => undefined);
    } finally {
      await removeTokens();
      await clearAllUserData();
      router.replace("/auth");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // Check if we can go back, otherwise navigate to dashboard
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)/dashboard");
            }
          }}
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
          <Text style={styles.headerTitle}>Profile & Settings</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ACCOUNT CARD */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <View style={styles.cardHeader}>
            <User size={20} color={Palette.accent} />
            <Text style={styles.cardTitle}>Account</Text>
          </View>
          
          {isLoadingProfile ? (
            <ActivityIndicator size="small" color={Palette.accent} style={styles.loading} />
          ) : (
            <>
              {/* Edit Button */}
              <View style={styles.editHeaderRow}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                {!isEditingProfile && (
                  <TouchableOpacity
                    onPress={() => {
                      // Initialize input fields with current values when entering edit mode
                      setNameInput(userName || "");
                      setPhoneInput(userPhone || "");
                      setDccInput(userDcc || "");
                      setLcbInput(userLcb || "");
                      setIsEditingProfile(true);
                    }}
                    style={styles.editButton}
                    activeOpacity={0.7}
                  >
                    <Edit2 size={18} color={Palette.accent} />
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Name Field */}
              <View style={styles.accountRow}>
                <Text style={styles.label}>Full Name *</Text>
                {isEditingProfile ? (
                  <TextInput
                    style={styles.input}
                    value={nameInput}
                    onChangeText={setNameInput}
                    placeholder="Enter your full name"
                    placeholderTextColor={Palette.textMuted}
                    autoCapitalize="words"
                  />
                ) : (
                  <Text style={styles.value}>{userName || "Not set"}</Text>
                )}
              </View>
              
              {/* Email Field (Read-only) */}
              <View style={styles.accountRow}>
                <Text style={styles.label}>Email</Text>
                <Text style={[styles.value, styles.readOnlyValue]}>{userEmail}</Text>
                <Text style={styles.helperText}>Email cannot be changed</Text>
              </View>
              
              {/* Phone Number Field */}
              <View style={styles.accountRow}>
                <Text style={styles.label}>Phone Number *</Text>
                {isEditingProfile ? (
                  <TextInput
                    style={styles.input}
                    value={phoneInput}
                    onChangeText={setPhoneInput}
                    placeholder="Enter phone number"
                    placeholderTextColor={Palette.textMuted}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.value}>{userPhone || "Not set"}</Text>
                )}
              </View>
              
              {/* DCC Field */}
              <View style={styles.accountRow}>
                <Text style={styles.label}>DCC (District Church Council)</Text>
                {isEditingProfile ? (
                  <TextInput
                    style={styles.input}
                    value={dccInput}
                    onChangeText={setDccInput}
                    placeholder="Enter your DCC"
                    placeholderTextColor={Palette.textMuted}
                    autoCapitalize="words"
                  />
                ) : (
                  <Text style={styles.value}>{userDcc || "Not set"}</Text>
                )}
              </View>
              
              {/* LCB Field */}
              <View style={styles.accountRow}>
                <Text style={styles.label}>LCB (Local Church Branch)</Text>
                {isEditingProfile ? (
                  <TextInput
                    style={styles.input}
                    value={lcbInput}
                    onChangeText={setLcbInput}
                    placeholder="Enter your LCB"
                    placeholderTextColor={Palette.textMuted}
                    autoCapitalize="words"
                  />
                ) : (
                  <Text style={styles.value}>{userLcb || "Not set"}</Text>
                )}
              </View>
              
              {/* Save/Cancel Buttons */}
              {isEditingProfile && (
                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    style={[styles.actionButton, styles.cancelButton]}
                    activeOpacity={0.7}
                    disabled={isSavingProfile}
                  >
                    <X size={18} color={Palette.textMuted} />
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveProfile}
                    style={[styles.actionButton, styles.saveButton]}
                    activeOpacity={0.7}
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Check size={18} color="#fff" />
                        <Text style={styles.saveButtonText}>Save</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        {/* APPEARANCE CARD */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Appearance</Text>
          </View>
          <Text style={styles.cardSubtitle}>Customize your reading experience</Text>

          {/* FONT SIZE */}
          <View style={styles.fontSizeContainer}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Type size={20} color={Palette.textMuted} />
                <Text style={styles.settingLabel}>Default Font Size</Text>
              </View>
              <Text style={styles.fontSizeValue}>{fontSize}px</Text>
            </View>
            <Slider
              value={fontSize}
              minimumValue={12}
              maximumValue={24}
              step={2}
              onValueChange={(value: number) => setFontSize(value)}
              minimumTrackTintColor={Palette.accent}
              maximumTrackTintColor="#d1d5db"
              thumbTintColor={Palette.accent}
              style={styles.slider}
            />
          </View>
        </View>

        {/* SUBSCRIPTION */}
        <View style={[styles.card, Shadow.cardSoft]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Subscription</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Manage your Sunday School access
          </Text>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => router.push("/(tabs)/payment-history")}
            activeOpacity={0.7}
          >
            <Text style={styles.outlineBtnText}>View Payment History</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={[styles.logoutBtn, Shadow.card]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;

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
  scrollContent: {
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Palette.textMuted,
    marginBottom: Spacing.md,
  },
  accountRow: {
    marginTop: Spacing.sm,
  },
  label: {
    fontSize: 14,
    color: Palette.textMuted,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  editHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.textDefault,
  },
  editButton: {
    padding: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Palette.accent,
    borderRadius: Radii.md,
    padding: Spacing.sm,
    fontSize: 16,
    color: Palette.textDefault,
    backgroundColor: Palette.canvas,
    marginTop: Spacing.xs,
  },
  readOnlyValue: {
    opacity: 0.7,
  },
  helperText: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: Spacing.xs / 2,
    fontStyle: "italic",
  },
  editActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.md,
    minWidth: 100,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Palette.canvas,
    borderWidth: 1,
    borderColor: Palette.textMuted,
  },
  cancelButtonText: {
    color: Palette.textMuted,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: Palette.accent,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loading: {
    padding: Spacing.md,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: Spacing.sm,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  settingLabel: {
    fontSize: 16,
    color: Palette.textDefault,
  },
  fontSizeContainer: {
    marginTop: Spacing.sm,
  },
  fontSizeValue: {
    fontSize: 14,
    color: Palette.textMuted,
    fontWeight: "500",
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: Spacing.sm,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: Palette.accent,
    padding: Spacing.md,
    borderRadius: Radii.md,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  outlineBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.accent,
  },
  logoutBtn: {
    backgroundColor: "#dc2626",
    padding: Spacing.md,
    borderRadius: Radii.md,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
