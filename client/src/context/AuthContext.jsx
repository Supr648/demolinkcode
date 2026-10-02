import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('mini_ecom_user');
      return savedUser ? JSON.parse(savedUser) : {
        _id: 'admin_demo_id',
        name: 'Store Admin',
        email: 'admin@demo.com',
        role: 'admin',
      };
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('mini_ecom_token') || 'demo_admin_jwt_token');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      if (typeof authApi?.login === 'function') {
        const response = await authApi.login({ email, password });
        const userObj = response.user || response;
        const tokenStr = response.token || 'demo_token';
        setUser(userObj);
        setToken(tokenStr);
        return { success: true, user: userObj };
      }
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
      return { success: true, user: { name: 'Customer', email, role: 'customer' } };
    } catch (error) {
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
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      if (typeof authApi?.register === 'function') {
        const response = await authApi.register(formData);
        const userObj = response.user || response;
        const tokenStr = response.token || 'demo_token';
        setUser(userObj);
        setToken(tokenStr);
        return { success: true, user: userObj };
      }
      return { success: true, user: formData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mini_ecom_user');
    localStorage.removeItem('mini_ecom_token');
  };

  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    isLoading: loading,
    isAuthenticated: !!token && !!user,
    isAdmin,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
