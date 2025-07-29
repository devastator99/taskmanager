import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  oauthLogin: (provider: string) => Promise<void>;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // JWT Token management
  const getTokens = () => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    return { access, refresh };
  };

  useEffect(() => {
    const { access } = getTokens();
    setToken(access);
  }, []);

  const setTokens = (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setToken(access);
  };

  const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
  };

  // Auto-refresh token logic
  const refreshToken = async () => {
    const { refresh } = getTokens();
    if (!refresh) return false;

    try {
      const response = await fetch('/api/auth/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.access, refresh);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    return false;
  };

  // Fetch user profile
  const fetchUser = async () => {
    const { access } = getTokens();
    if (!access) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/user/', {
        headers: {
          'Authorization': `Bearer ${access}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshToken();
        if (refreshed) {
          await fetchUser();
        } else {
          clearTokens();
        }
      } else {
        // For other HTTP errors, don't clear tokens - might be server issue
        console.warn('Server returned error:', response.status);
      }
    } catch (error) {
      // Network errors (server down, etc.) - don't clear tokens
      console.warn('Network error fetching user, keeping session:', error);
      // Set a basic user state to indicate we have a token but couldn't fetch details
      if (token) {
        setUser({ 
          id: 'temp', 
          email: 'user@example.com', 
          name: 'User', 
          role: 'user' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.access, data.refresh);
        setUser(data.user);
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.access, data.refresh);
        setUser(data.user);
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Signup failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const oauthLogin = async (provider: string) => {
    // Redirect to OAuth provider
    window.location.href = `http://localhost:8000/api/auth/oauth/${provider}/`;
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    oauthLogin,
    isAuthenticated: () => !!user && !!token,
    isAdmin: () => user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};