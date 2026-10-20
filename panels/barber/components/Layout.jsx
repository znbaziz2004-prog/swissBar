import React from 'react';
import { useState } from 'react';
import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BASE } from '../data/config';
import { ini } from './ui';

export const NAV = [
  ['dashboard', 'Dashboard', '▦'], ['appointments', 'Appointments', '✂'], ['calendar', 'Calendar', '▤'],
  ['customers', 'Customers', '☺'], ['services', 'Services', '✦'], ['staff', 'Staff', '☰'],
  ['shop', 'Shop / Branch', '⌂'], ['availability', 'Availability', '◷'], ['earnings', 'Earnings', '$'],
  ['reviews', 'Reviews', '★'],
['testimonials', 'Platform Testimonial', '💬'], ['notifications', 'Notifications', '🔔'], ['settings', 'Settings', '⚙'],
];

export function ProtectedRoute() {
  const { user } = useAuth();

  return user
    ? <Outlet />
    : <Navigate to={`${BASE}/login`} replace />;
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { appts } = useData();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const title = (NAV.find(n => pathname.endsWith(n[0])) || NAV[0])[1];
  const pending = appts.filter(a => a.status === 'Pending').length;

  return (
    <div className="bp">
      <div className="app">
        <aside className={`side ${open ? 'open' : ''}`}>
          <div className="brand">Swiss Barber<small>Barber panel</small></div>
          <nav>
            {NAV.map(([k, label, icon]) => (
              <NavLink key={k} to={`${BASE}/${k}`} className={({ isActive }) => (isActive ? 'on' : '')} onClick={() => setOpen(false)}>
                <i>{icon}</i>{label}{k === 'appointments' && pending > 0 && <span className="dot">{pending}</span>}
              </NavLink>
            ))}
          </nav>
          <a className="logout" href="#logout" onClick={e => { e.preventDefault(); logout(); }}>Log out</a>
        </aside>
        <div className={`scrim ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
        <main className="main">
          <header className="top">
            <button className="burger" aria-label="Menu" onClick={() => setOpen(true)}>☰</button>
            <h1>{title}</h1>
            <div className="who"><span className="av">{ini(user.name)}</span><div><b>{user.name}</b><small style={{textTransform:'capitalize'}}>{user.role}</small></div></div>
          </header>
          <section className="view swap" key={pathname}><Outlet /></section>
        </main>
      </div>
    </div>
  );
}
