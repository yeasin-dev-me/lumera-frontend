"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, ApiError } from "@/lib/api/client";
import { LoginPayload, RegisterPayload, UserProfile } from "@/types/api";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_KEY = "lumera_customer_refresh";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleAuthSuccess = useCallback((access: string, refresh: string, profile: UserProfile) => {
    api.setAccessToken(access);
    setUser(profile);
    setError(null);
    if (typeof window !== "undefined" && refresh) {
      localStorage.setItem(REFRESH_KEY, refresh);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedRefresh = typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null;
      if (storedRefresh) {
        await api.logout(storedRefresh);
      }
    } catch {
      // Ignore logout errors
    } finally {
      api.setAccessToken(null);
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem(REFRESH_KEY);
      }
      setIsLoading(false);
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    let isMounted = true;
    async function restoreSession() {
      if (typeof window === "undefined") return;
      const storedRefresh = localStorage.getItem(REFRESH_KEY);
      if (!storedRefresh) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const tokenResp = await api.refresh(storedRefresh);
        api.setAccessToken(tokenResp.access);
        if (tokenResp.refresh) {
          localStorage.setItem(REFRESH_KEY, tokenResp.refresh);
        }
        const profile = await api.getMe();
        if (isMounted) {
          setUser(profile);
          setIsLoading(false);
        }
      } catch {
        // Failed to restore session - clean up state
        if (isMounted) {
          api.setAccessToken(null);
          setUser(null);
          localStorage.removeItem(REFRESH_KEY);
          setIsLoading(false);
        }
      }
    }

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.login(credentials);
      handleAuthSuccess(response.access, response.refresh, response.user);
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : "Failed to log in";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthSuccess]);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.register(payload);
      handleAuthSuccess(response.access, response.refresh, response.user);
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : "Registration failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthSuccess]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
