"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    setEmail(localStorage.getItem("registeredEmail"));
    setAuthChecked(true);
  }, []);

  const login = (userEmail) => {
    setIsAuthenticated(true);
    if (userEmail) setEmail(userEmail);
  };
  const logout = () => {
    setIsAuthenticated(false);
    setEmail(null);
  };

  if (!authChecked) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, authChecked, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}