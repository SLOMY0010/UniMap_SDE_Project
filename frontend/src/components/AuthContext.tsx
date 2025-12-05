import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Simple mock authentication - in production, this would call an API
    if (email && password) {
      // For demo purposes, extract username from email
      const username = email.split("@")[0];
      setUser({ username, email });
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string): boolean => {
    // Simple mock registration - in production, this would call an API
    if (username && email && password) {
      setUser({ username, email });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
