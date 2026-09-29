import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authService, AuthResponse } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    age?: number;
    currency?: string;
    monthly_allowance?: number;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('teenspend_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('teenspend_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate active session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('teenspend_token');
      if (storedToken) {
        try {
          const currentUser = await authService.getMe();
          setUser(currentUser);
          localStorage.setItem('teenspend_user', JSON.stringify(currentUser));
        } catch {
          localStorage.removeItem('teenspend_token');
          localStorage.removeItem('teenspend_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    localStorage.setItem('teenspend_token', data.token);
    localStorage.setItem('teenspend_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (credentials: { email: string; password: string }) => {
    const data = await authService.login(credentials);
    handleAuthSuccess(data);
  };

  const loginAsDemo = async () => {
    const data = await authService.login({
      email: 'alex@teenspend.io',
      password: 'Alex123!',
    });
    handleAuthSuccess(data);
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    age?: number;
    currency?: string;
    monthly_allowance?: number;
  }) => {
    const data = await authService.register(userData);
    handleAuthSuccess(data);
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    localStorage.setItem('teenspend_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        loginAsDemo,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
