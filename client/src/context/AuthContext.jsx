import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mini_ecom_user');
    return savedUser ? JSON.parse(savedUser) : {
      _id: 'admin_demo_id',
      name: 'Store Admin',
      email: 'admin@demo.com',
      role: 'admin',
    };
  });
  const [token, setToken] = useState(() => localStorage.getItem('mini_ecom_token') || 'demo_admin_jwt_token');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mini_ecom_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mini_ecom_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('mini_ecom_token', token);
    } else {
      localStorage.removeItem('mini_ecom_token');
    }
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Attempt live backend API login
      const response = await authApi.login({ email, password });
      setUser(response.user);
      setToken(response.token);
      return { success: true, user: response.user };
    } catch (error) {
      // Fallback local admin login for demo / isolated frontend development
      if (email === 'admin@demo.com' && password === 'admin123') {
        const demoAdmin = {
          _id: 'admin_demo_id',
          name: 'Store Admin',
          email: 'admin@demo.com',
          role: 'admin',
        };
        setUser(demoAdmin);
        setToken('demo_admin_jwt_token');
        return { success: true, user: demoAdmin };
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(formData);
      setUser(response.user);
      setToken(response.token);
      return { success: true, user: response.user };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mini_ecom_user');
    localStorage.removeItem('mini_ecom_token');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
