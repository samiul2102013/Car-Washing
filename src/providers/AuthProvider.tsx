'use strict';
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage, setAuthFailureHandler, ApiError } from '../services/api';
import { authService } from '../services/auth/service';

interface AuthUser {
  name: string;
  email: string;
  role: 'admin';
  avatarUrl?: string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const SESSION_KEY = 'carwash_admin_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setAuthFailureHandler(() => {
      setUser(null);
      router.push('/auth/login');
    });
  }, [router]);

  useEffect(() => {
    if (tokenStorage.getAccess()) {
      const savedSession = typeof window !== 'undefined' ? localStorage.getItem(SESSION_KEY) : null;
      if (savedSession) {
        try {
          setUser(JSON.parse(savedSession));
        } catch {
          tokenStorage.clear();
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (!result) return false;

      tokenStorage.set(result.tokens.access, result.tokens.refresh);
      localStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
      setUser(result.user);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        return false;
      }
      console.error('Login failed:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout(tokenStorage.getRefresh());
    tokenStorage.clear();
    setUser(null);
    router.push('/auth/login');
  };

  const updateUser = (partial: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    updateUser,
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
