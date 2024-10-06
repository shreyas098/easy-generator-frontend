import { useState, useEffect, useCallback } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    return {
      isAuthenticated: !!token,
      token: token,
    };
  });

  const login = useCallback((token: string) => {
    localStorage.setItem('token', token);
    setAuthState({ isAuthenticated: true, token });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({ isAuthenticated: false, token: null });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthState(prevState => ({
      ...prevState,
      isAuthenticated: !!token,
      token: token,
    }));
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    token: authState.token,
    login,
    logout,
  };
};