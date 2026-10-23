
import React from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  loginRequest,
  exchangeHandoffRequest,
} from '../services/barberService';
import {
  clearSession,
  getToken,
  readUser,
  saveSession,
} from '../services/api';
import { BASE, SHOP_ROLES } from '../data/config';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? readUser() : null));

  const establishSession = useCallback((data, remember = true) => {
    if (!data?.token) {
      throw new Error('Login failed. No token received.');
    }

    if (!SHOP_ROLES.includes(data.user?.role)) {
      throw new Error('This account cannot use the barber panel.');
    }

    saveSession(data.token, data.user, remember);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async (email, password, remember) => {
    const data = await loginRequest({ email, password });
    return establishSession(data, remember);
  }, [establishSession]);

  const completeHandoff = useCallback(async (code) => {
    if (!code) {
      throw new Error('Login handoff code is missing.');
    }

    const data = await exchangeHandoffRequest(code);
    return establishSession(data, true);
  }, [establishSession]);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    window.location.href = `${BASE}/login`;
  }, []);

  const value = useMemo(
    () => ({ user, login, completeHandoff, logout }),
    [user, login, completeHandoff, logout]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
