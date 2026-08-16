import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await apiRequest('/auth/me', 'GET');
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            // Token is invalid or expired — clear storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('activeUserEmail');
          }
        } catch (err) {
          console.error('Failed to restore user session:', err);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('activeUserEmail');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  /**
   * Login — returns { success: true, user } or { success: false, message }
   */
  const login = async (email, password) => {
    try {
      const res = await apiRequest('/auth/login', 'POST', { email, password });

      // Validate response structure before accessing nested properties
      if (res.success && res.data && res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken || '');
        localStorage.setItem('activeUserEmail', email);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }

      // success=true but missing data — treat as failure with the server message
      return {
        success: false,
        message: res.message || 'Login failed: Unexpected server response. Please try again.',
      };
    } catch (err) {
      return { success: false, message: err.message || 'An unexpected error occurred.' };
    }
  };

  /**
   * Register — automatically assigns 'patient' role.
   * Returns { success: true, user } or { success: false, message }
   */
  const register = async (userData) => {
    try {
      const res = await apiRequest('/auth/register', 'POST', userData);

      console.log('[Register] Server response:', JSON.stringify(res));

      // Validate response structure before accessing nested properties
      if (res.success && res.data && res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken || '');
        localStorage.setItem('activeUserEmail', userData.email);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }

      // success=true but no tokens — server registered but didn't return tokens
      if (res.success) {
        return {
          success: false,
          message: 'Account may have been created, but the server did not return login credentials. Please try logging in.',
        };
      }

      return { success: false, message: res.message || 'Registration failed. Please try again.' };
    } catch (err) {
      console.error('[Register] Error:', err);
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
