import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const savedEmail = localStorage.getItem('activeUserEmail');
      if (token && savedEmail) {
        try {
          const res = await apiRequest('/auth/me', 'GET');
          if (res.success) {
            setUser(res.data);
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('activeUserEmail');
          }
        } catch (err) {
          console.error('Failed to restore user session:', err);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Returns { success: true, user } or { success: false, message }
  const login = async (email, password) => {
    try {
      const res = await apiRequest('/auth/login', 'POST', { email, password });
      if (res.success) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('activeUserEmail', email);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      } else {
        return { success: false, message: res.message || 'Login failed. Please check your credentials.' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'An unexpected error occurred.' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiRequest('/auth/register', 'POST', userData);
      if (res.success) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('activeUserEmail', userData.email);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.message || 'Registration failed.' };
    } catch (err) {
      return { success: false, message: err.message || 'An unexpected error occurred.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('activeUserEmail');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
