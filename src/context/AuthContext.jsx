import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { apiClient, setAccessToken } from '../utils/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasRunInit = useRef(false);

  // Hydrate session on app mount
  useEffect(() => {
    if (hasRunInit.current) return;
    hasRunInit.current = true;

    async function initAuth() {
      try {
        // Try to refresh token silently if there is a valid httpOnly cookie
        const BASE_URL = import.meta.env.VITE_API_URL || '';
        const res = await apiClient(`${BASE_URL}/api/v1/auth/refresh`, { method: 'POST' });
        if (res.success && res.data) {
          setAccessToken(res.data.accessToken);
          setUser(res.data.user);
        }
      } catch (err) {
        // No valid session, stay logged out
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiClient('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, error: 'Login failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid email or password' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await apiClient('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      if (res.success) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed. Please check your inputs.' };
    }
  };

  const logout = async () => {
    try {
      await apiClient('/api/v1/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

