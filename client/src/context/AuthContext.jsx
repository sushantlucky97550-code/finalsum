import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const DEMO_CREDENTIALS = {
  hr: {
    email: 'hr@staffsync.com',
    password: 'password123',
    label: 'HR Admin (Sarah Jenkins)',
    role: 'hr',
  },
  manager: {
    email: 'manager@staffsync.com',
    password: 'password123',
    label: 'Manager (Marcus Vance)',
    role: 'manager',
  },
  employee: {
    email: 'employee@staffsync.com',
    password: 'password123',
    label: 'Employee (Alex Rivera)',
    role: 'employee',
  },
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('staffsync_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('staffsync_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Validate session on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const savedToken = localStorage.getItem('staffsync_token');
      if (!savedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('staffsync_user', JSON.stringify(response.data.user));
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session validation error:', err.response?.data?.message || err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const response = await api.post('/auth/login', { email: cleanEmail, password });
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('staffsync_token', newToken);
        localStorage.setItem('staffsync_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        setLoading(false);
        return { success: true, user: userData };
      }
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials or server unreachable';
      return { success: false, message: msg };
    }
  };

  const quickLogin = async (roleKey) => {
    const creds = DEMO_CREDENTIALS[roleKey];
    if (creds) {
      return await login(creds.email, creds.password);
    }
    return { success: false, message: 'Invalid demo role selected' };
  };

  const logout = () => {
    localStorage.removeItem('staffsync_token');
    localStorage.removeItem('staffsync_user');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedUser };
      localStorage.setItem('staffsync_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        quickLogin,
        logout,
        updateUser,
        isAuthenticated: !!user && !!token,
        isHR: user?.role === 'hr',
        isManager: user?.role === 'manager',
        isEmployee: user?.role === 'employee',
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
