import axios from 'axios';
import { BASE } from '../data/config';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const TOKEN_KEY = 'swiss_barber_panel_token';
export const USER_KEY = 'swiss_barber_panel_user';

const store = () => (localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage);
export const getToken = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
export const readUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
};
export const saveSession = (token, user, remember) => {
  clearSession();
  const s = remember ? localStorage : sessionStorage;
  s.setItem(TOKEN_KEY, token);
  s.setItem(USER_KEY, JSON.stringify(user));
};
export const clearSession = () => {
  [localStorage, sessionStorage].forEach(s => { s.removeItem(TOKEN_KEY); s.removeItem(USER_KEY); });
};

const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use(config => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(r => r, error => {
  const isLogin = error?.config?.url?.includes('/auth/login');
  if (error?.response?.status === 401 && !isLogin) {
    clearSession();
    if (!window.location.pathname.endsWith('/login')) window.location.href = `${BASE}/login`;
  }
  return Promise.reject(error);
});

export const errMsg = (e, fallback = 'Something went wrong') =>
  e?.response?.data?.message || (e?.code === 'ERR_NETWORK' ? 'Cannot reach the server. Is the backend running?' : e?.message) || fallback;

export const unwrap = r => r?.data?.data ?? r?.data;
export default api;
