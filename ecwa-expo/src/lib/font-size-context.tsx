import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FONT_SIZE_STORAGE_KEY = 'defaultFontSize';
const DEFAULT_FONT_SIZE = 18;

interface FontSizeContextValue {
  fontSize: number;
  setFontSize: (size: number) => Promise<void>;
  getScaledSize: (baseSize: number) => number;
}

const FontSizeContext = createContext<FontSizeContextValue | null>(null);

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<number>(DEFAULT_FONT_SIZE);

  // Load font size from storage on mount
  useEffect(() => {
    const loadFontSize = async () => {
      try {
        const stored = await AsyncStorage.getItem(FONT_SIZE_STORAGE_KEY);
        if (stored) {
          const size = parseFloat(stored);
          if (!isNaN(size) && size >= 12 && size <= 24) {
            setFontSizeState(size);
          }
        }
      } catch (_error) {
        // Keep default font size on error
      }
    };
    loadFontSize();
  }, []);

  // Set font size and save to storage
  const setFontSize = useCallback(async (size: number) => {
    const clampedSize = Math.max(12, Math.min(24, size));
    setFontSizeState(clampedSize);
    try {
      await AsyncStorage.setItem(FONT_SIZE_STORAGE_KEY, clampedSize.toString());
    } catch (_error) {
      // Ignore storage errors
    }
  }, []);

  // Get scaled font size based on base size
  // This allows relative scaling: if base is 16 and fontSize is 18, 
  // a base size of 12 becomes 13.5 (12 * 18/16)
  const getScaledSize = useCallback((baseSize: number) => {
    const scaleFactor = fontSize / DEFAULT_FONT_SIZE;
    return Math.round(baseSize * scaleFactor);
  }, [fontSize]);

  const value = useMemo(
    () => ({
      fontSize,
      setFontSize,
      getScaledSize,
    }),
    [fontSize, setFontSize, getScaledSize]
  );

  return <FontSizeContext.Provider value={value}>{children}</FontSizeContext.Provider>;
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (!context) {
    // Return default values if context is not available
    return {
      fontSize: DEFAULT_FONT_SIZE,
      setFontSize: async () => {},
      getScaledSize: (baseSize: number) => baseSize,
    };
  }
  return context;
}
