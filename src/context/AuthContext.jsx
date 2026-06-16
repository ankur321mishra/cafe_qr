import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'brewhouse_auth';

// Demo credentials
const DEMO_EMAIL = 'admin@brewhouse.com';
const DEMO_PASSWORD = 'demo123';

function loadAuth() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadAuth);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email, password) => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const userData = {
        email: DEMO_EMAIL,
        name: 'Admin',
        role: 'admin',
        cafeName: 'The Brew House',
        token: 'demo-jwt-token-' + Date.now(),
      };
      setUser(userData);
      return { success: true, user: userData };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
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
