import React from 'react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BASE } from '../data/config';
import { errMsg } from '../services/api';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', pass: '', rem: true });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);

  if (user) return <Navigate to={`${BASE}/dashboard`} replace />;

  const fail = m => { setErr(m); setShake(n => n + 1); };
  const submit = async e => {
    e.preventDefault();
    if (!f.email.trim() || !f.pass) return fail('Enter your email and password.');
    setBusy(true); setErr('');
    try {
      await login(f.email.trim(), f.pass, f.rem);
      nav(`${BASE}/dashboard`);
    } catch (ex) { fail(errMsg(ex, 'Login failed')); } finally { setBusy(false); }
  };

  return (
    <div className="bp lg">
      <section className="art">
        <div className="brand">Swiss Barber</div>
        <h2>Run your shop,<br />not your inbox.</h2>
        <p>Bookings, staff, services and earnings in one calm place.</p>
        <span className="blob b1" /><span className="blob b2" />
      </section>
      <main className="pane">
        <form key={shake} className={`box ${shake ? 'shake' : ''}`} onSubmit={submit} noValidate>
          <h1>Welcome back</h1>
          <p className="muted">Log in to your barber panel.</p>
          <label>Email<input type="email" autoComplete="username" placeholder="you@shop.ch" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></label>
          <label>Password
            <span className="pw">
              <input type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" value={f.pass} onChange={e => setF({ ...f, pass: e.target.value })} />
              <button type="button" onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'}</button>
            </span>
          </label>
          <div className="between">
            <label className="chk"><input type="checkbox" checked={f.rem} onChange={e => setF({ ...f, rem: e.target.checked })} /> Keep me logged in</label>
          </div>
          <p className="err" role="alert">{err}</p>
          <button className="btn big" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        </form>
      </main>
    </div>
  );
}
