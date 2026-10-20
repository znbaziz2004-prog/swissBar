export const BASE = '/barber'; // route jahan BarberPanel mount hai (vite base se match karta hai)
export const CURRENCY = 'CHF';
export const SHOP_ROLES = ['owner', 'manager', 'receptionist', 'barber'];
export const canManage = role => role === 'owner' || role === 'manager';
