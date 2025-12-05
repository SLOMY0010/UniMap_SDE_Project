import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Simple mock authentication - in production, this would call an API
    if (email && password) {
      // For demo purposes, extract username from email
      const username = email.split("@")[0];
      setUser({ username, email });
      return true;
    }
    return false;
  };

  const register = (username, email, password) => {
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
