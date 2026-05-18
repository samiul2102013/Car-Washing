'use strict';
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_PROFILE } from '../constants/mockData';

interface AuthUser {
  name: string;
  email: string;
  role: 'admin';
  avatarUrl: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user session exists in localStorage
    const savedSession = localStorage.getItem('carwash_admin_session');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch {
        localStorage.removeItem('carwash_admin_session');
      }
    } else {
      // By default, pre-populate Sarah Jessie to make testing smooth
      localStorage.setItem('carwash_admin_session', JSON.stringify(ADMIN_PROFILE));
      setUser(ADMIN_PROFILE);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate real auth call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simple mock check
    if (email.toLowerCase() === ADMIN_PROFILE.email.toLowerCase() && password === 'admin123') {
      const sessionUser = { ...ADMIN_PROFILE };
      localStorage.setItem('carwash_admin_session', JSON.stringify(sessionUser));
      setUser(sessionUser);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('carwash_admin_session');
    setUser(null);
    router.push('/auth/login');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
