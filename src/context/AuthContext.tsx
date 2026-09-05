"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerified?: boolean;
  avatarUrl?: string;
  address?: string;
  city?: string;
  pincode?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "signin" | "signup";
  openAuthModal: (tab?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  googleLogin: (email?: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthModalOpen: false,
  authModalTab: "signin",
  openAuthModal: () => {},
  closeAuthModal: () => {},
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  googleLogin: async () => ({ success: false }),
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    // Load persisted user session from localStorage
    try {
      const savedUser = localStorage.getItem("jijau_customer_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to load user session:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const openAuthModal = (tab: "signin" | "signup" = "signin") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      setUser(data.user);
      localStorage.setItem("jijau_customer_user", JSON.stringify(data.user));
      closeAuthModal();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Network error" };
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }
      setUser(data.user);
      localStorage.setItem("jijau_customer_user", JSON.stringify(data.user));
      closeAuthModal();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Network error" };
    }
  };

  const googleLogin = async (customEmail?: string, customName?: string) => {
    try {
      const email = customEmail || "anantwagh24@gmail.com";
      const name = customName || "Anant Wagh";
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Google auth failed" };
      }
      setUser(data.user);
      localStorage.setItem("jijau_customer_user", JSON.stringify(data.user));
      closeAuthModal();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem("jijau_customer_user");
  };

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("jijau_customer_user", JSON.stringify(data.user));
      } else if (res.status === 401) {
        setUser(null);
        localStorage.removeItem("jijau_customer_user");
      }
    } catch (e) {
      console.error("Refresh user failed:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        googleLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
