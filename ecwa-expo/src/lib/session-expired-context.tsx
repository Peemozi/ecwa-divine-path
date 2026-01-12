import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

type SessionExpiredContextValue = {
  isSessionExpired: boolean;
  showSessionExpired: () => void;
  hideSessionExpired: () => void;
};

const SessionExpiredContext = createContext<SessionExpiredContextValue | null>(null);

// Global function that can be called from outside React components (e.g., API)
let globalShowSessionExpired: (() => void) | null = null;

export function triggerSessionExpired() {
  if (globalShowSessionExpired) {
    globalShowSessionExpired();
  }
}

export function SessionExpiredProvider({ children }: { children: React.ReactNode }) {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const showSessionExpired = useCallback(() => {
    setIsSessionExpired(true);
  }, []);

  const hideSessionExpired = useCallback(() => {
    setIsSessionExpired(false);
  }, []);

  // Set global function on mount
  useEffect(() => {
    globalShowSessionExpired = showSessionExpired;
    return () => {
      globalShowSessionExpired = null;
    };
  }, [showSessionExpired]);

  const value: SessionExpiredContextValue = {
    isSessionExpired,
    showSessionExpired,
    hideSessionExpired,
  };

  return (
    <SessionExpiredContext.Provider value={value}>
      {children}
    </SessionExpiredContext.Provider>
  );
}

export function useSessionExpired() {
  const ctx = useContext(SessionExpiredContext);
  if (!ctx) {
    throw new Error("useSessionExpired must be used within SessionExpiredProvider");
  }
  return ctx;
}
