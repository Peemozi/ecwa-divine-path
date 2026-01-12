import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useSegments, useLocalSearchParams } from 'expo-router';

const APP_STATE_STORAGE_KEY = 'app_navigation_state';
const STATE_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes

interface NavigationState {
  pathname: string;
  segments: string[];
  params: Record<string, any>;
  timestamp: number;
}

interface AppStateContextType {
  saveAppState: () => Promise<void>;
  restoreAppState: () => Promise<NavigationState | null>;
  clearAppState: () => Promise<void>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Helper functions that don't depend on hooks
async function saveNavigationState(state: NavigationState): Promise<void> {
  try {
    await AsyncStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch (_error) {
    // Error saving app state
  }
}

async function restoreNavigationState(): Promise<NavigationState | null> {
  try {
    const stored = await AsyncStorage.getItem(APP_STATE_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const state: NavigationState = JSON.parse(stored);
    
    // Check if state is still valid (not expired)
    const isExpired = Date.now() - state.timestamp > STATE_EXPIRY_TIME;
    if (isExpired) {
      await AsyncStorage.removeItem(APP_STATE_STORAGE_KEY);
      return null;
    }

    // Don't restore auth-related routes
    const authRoutes = ['/auth', '/login-email-password', '/login-email-only', '/create-account', '/verify-token'];
    if (authRoutes.some(route => state.pathname.includes(route))) {
      await AsyncStorage.removeItem(APP_STATE_STORAGE_KEY);
      return null;
    }

    return state;
  } catch (_error) {
    return null;
  }
}

async function clearNavigationState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(APP_STATE_STORAGE_KEY);
  } catch (_error) {
    // Error clearing app state
  }
}

// Internal component that tracks navigation state
function AppStateTracker({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = useSegments();
  const params = useLocalSearchParams();
  const appState = useRef(AppState.currentState);
  const lastSavedPathname = useRef<string | null>(null);

  // Save current navigation state
  const saveAppState = useCallback(async () => {
    // Don't save auth-related routes or index route (user should re-authenticate or app is initializing)
    // Also check for exact match to prevent saving index
    if (pathname === '/' || pathname === '/index') {
      return;
    }
    
    const authRoutes = ['/auth', '/login-email-password', '/login-email-only', '/create-account', '/verify-token'];
    if (authRoutes.some(route => pathname === route || pathname.includes(route))) {
      return;
    }

    // Don't save if pathname hasn't changed (prevent unnecessary saves)
    if (lastSavedPathname.current === pathname) {
      return;
    }

    const state: NavigationState = {
      pathname,
      segments: segments.slice(),
      params: { ...params },
      timestamp: Date.now(),
    };

    await saveNavigationState(state);
    lastSavedPathname.current = pathname;
  }, [pathname, segments, params]);

  // Save state periodically and when navigation changes
  useEffect(() => {
    // Don't track state for index/auth routes - check exact match first
    if (pathname === '/' || pathname === '/index') {
      return;
    }
    
    const authRoutes = ['/auth', '/login-email-password', '/login-email-only', '/create-account', '/verify-token'];
    if (authRoutes.some(route => pathname === route || pathname.includes(route))) {
      return;
    }

    // Save state every 10 seconds (debounced)
    let saveInterval: NodeJS.Timeout;
    let lastSaveTime = 0;
    const SAVE_INTERVAL = 10000; // 10 seconds

    const debouncedSave = () => {
      const now = Date.now();
      if (now - lastSaveTime > SAVE_INTERVAL) {
        saveAppState();
        lastSaveTime = now;
      }
    };

    saveInterval = setInterval(debouncedSave, SAVE_INTERVAL);

    // Also save when pathname changes (navigation) - but only if pathname actually changed
    if (lastSavedPathname.current !== pathname) {
      saveAppState();
    }

    return () => {
      clearInterval(saveInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App going to background - save state immediately
        // Don't save if on auth/index routes - check exact match first
        if (pathname === '/' || pathname === '/index') {
          return;
        }
        
        const authRoutes = ['/auth', '/login-email-password', '/login-email-only', '/create-account', '/verify-token'];
        if (!authRoutes.some(route => pathname === route || pathname.includes(route))) {
          saveAppState();
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <>{children}</>;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const value: AppStateContextType = {
    saveAppState: async () => {
      // This will be called by components, but actual saving is done by AppStateTracker
      // Components can call this to force save
    },
    restoreAppState: restoreNavigationState,
    clearAppState: clearNavigationState,
  };

  return (
    <AppStateContext.Provider value={value}>
      <AppStateTracker>
        {children}
      </AppStateTracker>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
