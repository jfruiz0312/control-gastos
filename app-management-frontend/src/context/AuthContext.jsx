import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { iniciarSesion } from '../api/authApi';
import { registerAuthHandlers } from '../api/axiosConfig';
import {
  clearStoredAuthSession,
  getStoredAuthSession,
  isAuthenticatedSession,
  persistAuthSession,
} from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredAuthSession());

  const login = useCallback(async ({ username, password }) => {
    const response = await iniciarSesion({ username, password });
    persistAuthSession(response);
    setSession(response);
    return response;
  }, []);

  const logout = useCallback(() => {
    clearStoredAuthSession();
    setSession(null);
  }, []);

  useEffect(() => {
    const unregister = registerAuthHandlers({
      onUnauthorized: () => {
        clearStoredAuthSession();
        setSession(null);
      },
    });

    return unregister;
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.username || '',
      tokenType: session?.tokenType || 'Bearer',
      accessToken: session?.accessToken || '',
      isAuthenticated: isAuthenticatedSession(session),
      login,
      logout,
    }),
    [login, logout, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  }

  return context;
}
