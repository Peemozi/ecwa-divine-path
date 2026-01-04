import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

type Language = "English" | "Yoruba" | "Hausa" | "Igbo";

type AuthFlowState = {
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
  loginCode: string;
  name: string;
  language: Language;
};

type AuthFlowContextValue = {
  state: AuthFlowState;
  setField: <K extends keyof AuthFlowState>(key: K, value: AuthFlowState[K]) => void;
  resetAuthFlow: () => void;
};

const initialState: AuthFlowState = {
  email: "",
  password: "",
  confirmPassword: "",
  otp: "",
  loginCode: "",
  name: "",
  language: "English",
};

const AuthFlowContext = createContext<AuthFlowContextValue | null>(null);

export function AuthFlowProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthFlowState>(initialState);

  const setField: AuthFlowContextValue["setField"] = useCallback((key, value) => {
    setState((prev) => {
      if (prev[key] === value) return prev;
      return { ...prev, [key]: value };
    });
  }, []);

  const resetAuthFlow = useCallback(() => setState(initialState), []);

  const value = useMemo(
    () => ({ state, setField, resetAuthFlow }),
    [state, setField, resetAuthFlow]
  );

  return <AuthFlowContext.Provider value={value}>{children}</AuthFlowContext.Provider>;
}

export function useAuthFlow() {
  const ctx = useContext(AuthFlowContext);
  if (!ctx) {
    throw new Error("useAuthFlow must be used within AuthFlowProvider");
  }
  return ctx;
}


