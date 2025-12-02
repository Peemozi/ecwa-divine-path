// src/assets/pages/Splash.tsx
import React, { useEffect, useRef } from "react";
import type { ImageSourcePropType } from "react-native";
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
  Platform,
} from "react-native";

type SplashProps = {
  logoSource?: ImageSourcePropType;
};

const defaultLogo = require("../assets/ecwa-logo.png");

const Splash: React.FC<SplashProps> = ({ logoSource = defaultLogo }) => {
  const scale = useRef(new Animated.Value(0.88)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.logoWrap,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <ActivityIndicator size="small" color="#4A39E0" style={styles.loader} />
      </View>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  logo: {
    width: Platform.OS === "web" ? 192 : 160,
    height: Platform.OS === "web" ? 192 : 160,
  },
  loader: {
    marginTop: 20,
  },
});
