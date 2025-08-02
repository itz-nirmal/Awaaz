"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  _id: string;
  email: string;
  name: string;
  userType: "admin" | "citizen";
  phoneNumber?: string;
  address?: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  userType: "admin" | "citizen";
  phoneNumber?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // SUPER SIMPLE - Just provide a mock user for testing
  const [user] = useState<User>({
    _id: "mock-user-id",
    email: "test@example.com", // This email will be used for issue submission
    name: "Test User",
    userType: "citizen",
  });

  const [loading] = useState(false); // No loading since we have mock data

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, password: string) => {
    // Mock successful login for testing
    return { success: true, message: "Login successful" };
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const register = async (data: RegisterData) => {
    // Mock successful registration for testing
    return { success: true, message: "Registration successful" };
  };

  const logout = async () => {
    // Mock logout for testing
    console.log("Mock logout");
  };

  const checkAuth = async () => {
    // Mock auth check - always authenticated
    console.log("Mock auth check - always authenticated");
  };

  const updateUser = (userData: Partial<User>) => {
    // Mock user update for testing
    console.log("Mock user update:", userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
        updateUser,
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
