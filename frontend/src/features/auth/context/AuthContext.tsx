"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { User } from "@/types";
import { login as loginApi, logout as logoutApi, getMe } from "@/lib/api/auth";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const load = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const login = async (email: string, password: string) => {
    const { user: loggedInUser, token } = await loginApi({ email, password });
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        isAdmin: user?.role === "admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthはAuthProvider内で使用してください");
  }
  return context;
};
