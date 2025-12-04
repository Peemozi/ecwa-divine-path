import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getAuthUser, logout as authLogout, isAuthenticated } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async (): Promise<boolean> => {
    if (!isAuthenticated()) {
      setUser(null);
      setIsLoading(false);
      return false;
    }

    try {
      const userData = await getAuthUser();
      setUser(userData);
      setIsLoading(false);
      return true;
    } catch {
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        setUser,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
