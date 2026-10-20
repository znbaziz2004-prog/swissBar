import React from 'react';
import { useEffect, useState } from 'react';
import { CURRENCY } from '../data/config';

export const chf = n => `${CURRENCY} ${Number(n || 0).toLocaleString('de-CH', { maximumFractionDigits: 2 })}`;
export const ini = n => (n || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
export const hhmm = t => (t ? String(t).slice(0, 5) : '');

const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const todayStr = () => ymd(new Date());
export const addDays = (str, n) => { const d = new Date(`${str}T00:00:00`); d.setDate(d.getDate() + n); return ymd(d); };
export const diffDays = str => Math.round((new Date(`${str}T00:00:00`) - new Date(`${todayStr()}T00:00:00`)) / 864e5);
export const dayLabel = str => {
  if (!str) return '';
  const d = diffDays(str);
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  if (d === -1) return 'Yesterday';
  return new Date(`${str}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const PILL = { pending: 'Pending', confirmed: 'Confirmed', completed: 'Completed', paid: 'Paid', active: 'Active', approved: 'Active', inactive: 'Inactive', cancelled: 'Cancelled', rejected: 'Cancelled', failed: 'Cancelled', refunded: 'Pending', no_show: 'Cancelled' };
export const Pill = ({ s }) => {
  const key = String(s || '').toLowerCase();
  const label = key.replace('_', ' ').replace(/^./, c => c.toUpperCase());
  return <span className={`pill ${PILL[key] || 'Pending'}`}>{label || '—'}</span>;
};
export const Person = ({ name }) => <div className="who2"><span className="av">{ini(name)}</span>{name || 'Unknown'}</div>;

export function CountUp({ to }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (typeof to !== 'number') return;
    let raf; const t0 = performance.now();
    const f = t => { const p = Math.min((t - t0) / 900, 1); setV(Math.round(to * (1 - (1 - p) ** 3))); if (p < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return typeof to === 'number' ? v.toLocaleString('de-CH') : to;
}

export const Stat = ({ label, value, note, hero }) => (
  <div className={`card stat ${hero ? 'hero' : ''}`}>
    <span>{label}</span><b><CountUp to={value} /></b><em>{note}</em>
  </div>
);

export const Table = ({ cols, rows }) => (
  <div className="tw"><table>
    <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
    <tbody>{rows.length ? rows : <tr><td colSpan={cols.length} className="muted">Nothing here yet.</td></tr>}</tbody>
  </table></div>
);

/* loading / error wrapper: <State loading error onRetry>content</State> */
export function State({ loading, error, onRetry, children }) {
  if (loading) return <div className="loader" role="status"><i className="spin" />Loading…</div>;
  if (error) return <div className="card errbox" role="alert"><b>{error}</b>{onRetry && <button className="btn ghost sm" onClick={onRetry}>Try again</button>}</div>;
  return children;
}
