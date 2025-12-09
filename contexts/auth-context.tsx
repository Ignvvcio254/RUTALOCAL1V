"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/auth/auth.service";
import { TokenManager } from "@/lib/auth/token-manager";
import type { AuthUser, LoginCredentials, RegisterCredentials } from "@/lib/auth/types";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = async () => {
      console.log('🔄 AuthContext: Loading user...');
      try {
        if (AuthService.hasActiveSession()) {
          console.log('✅ AuthContext: Active session found');
          const currentUser = await AuthService.getCurrentUser();
          console.log('👤 AuthContext: User loaded:', currentUser?.email);
          setUser(currentUser);
        } else {
          console.log('❌ AuthContext: No active session');
        }
      } catch (error) {
        console.error('❌ AuthContext: Error loading user:', error);
        TokenManager.clearTokens();
      } finally {
        setIsLoading(false);
        console.log('✅ AuthContext: Loading complete');
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { user: loggedUser } = await AuthService.login(credentials);
      setUser(loggedUser);

      // Redirigir a la página principal
      console.log('✅ Login exitoso - Redirigiendo a página principal');
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const { user: registeredUser } = await AuthService.register(credentials);
      setUser(registeredUser);
      // Redirigir a la página principal (landing)
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch {
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
