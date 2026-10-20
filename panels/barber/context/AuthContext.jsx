import React from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { loginRequest } from '../services/barberService';
import { clearSession, getToken, readUser, saveSession } from '../services/api';
import { BASE, SHOP_ROLES } from '../data/config';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? readUser() : null));

  const login = useCallback(async (email, password, remember) => {
    const data = await loginRequest({ email, password });
    if (!data?.token) throw new Error('Login failed. No token received.');
    if (!SHOP_ROLES.includes(data.user?.role)) {
      throw new Error('This account cannot use the barber panel.');
    }
    saveSession(data.token, data.user, remember);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    window.location.href = `${BASE}/login`;
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
