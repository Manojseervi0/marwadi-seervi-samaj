"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, [apiUrl]);

  const login = (userData) => {
    setIsAuthenticated(true);
    if (userData) setUser(userData);
  };
  
  const logout = async () => {
    try {
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!authChecked) return null;

  const email = user ? user.email : null;
  const role = user ? user.role : null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, authChecked, email, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}