import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api } from './api.js';

const AuthContext = createContext(null);
const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const login = useCallback(async (identifier, password) => {
    const res = await api.login({ identifier, password });
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    setToken(res.accessToken);
    return res.user;
  }, []);

  // Clears the local token (used directly when the server already says the token is invalid).
  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) await api.logout(token);
    } catch {
      /* token may already be invalid - still log out locally */
    }
    clearSession();
  }, [token, clearSession]);

  const value = useMemo(
    () => ({ token, isAuthenticated: !!token, login, logout, clearSession }),
    [token, login, logout, clearSession]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
