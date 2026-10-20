import React from 'react';
import { useState } from 'react';
import { useAsync } from '../components/hooks';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { errMsg } from '../services/api';
import { createWorkingHour, deleteWorkingHour, getBranches, getShopProfile, getWorkingHours, updateWorkingHour } from '../services/barberService';
import { State, hhmm } from '../components/ui';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ORDER = [1, 2, 3, 4, 5, 6, 0];

const load = async () => {
  const shop = await getShopProfile();
  const [hours, branches] = await Promise.all([getWorkingHours(shop.id), getBranches().catch(() => [])]);
  return { shop, hours, branches };
};

export default function Availability() {
  const { user } = useAuth();
  const { toast } = useData();
  const { data, loading, error, reload } = useAsync(load, []);
  const [edit, setEdit] = useState({});
  const [n, setN] = useState({ day: 1, start: '09:00', end: '18:00', branch: '' });

  const run = async (fn, ok) => { try { await fn(); toast(ok); setEdit({}); await reload(); } catch (e) { toast(errMsg(e)); } };
  const val = (h, k) => edit[h.id]?.[k] ?? (k === 'is_available' ? !!h.is_available : hhmm(h[k]));
  const set = (h, k, v) => setEdit({ ...edit, [h.id]: { ...edit[h.id], [k]: v } });
  const save = h => run(() => updateWorkingHour(h.id, {
    start_time: val(h, 'start_time'), end_time: val(h, 'end_time'), is_available: val(h, 'is_available') ? 1 : 0,
  }), 'Hours saved');

  if (user.role !== 'owner') return <div className="card errbox"><b>Only the shop owner can manage working hours.</b></div>;
  return (
    <State loading={loading} error={error} onRetry={reload}>
      {data && (<>
        <form className="card form" style={{ marginBottom: 18 }} onSubmit={e => { e.preventDefault(); run(() => createWorkingHour({ shopId: data.shop.id, branchId: n.branch ? Number(n.branch) : null, dayOfWeek: Number(n.day), startTime: n.start, endTime: n.end }), 'Hours added'); }}>
          <label>Day<select value={n.day} onChange={e => setN({ ...n, day: e.target.value })}>{ORDER.map(d => <option key={d} value={d}>{DAYS[d]}</option>)}</select></label>
          <label>Opens<input type="time" value={n.start} onChange={e => setN({ ...n, start: e.target.value })} /></label>
          <label>Closes<input type="time" value={n.end} onChange={e => setN({ ...n, end: e.target.value })} /></label>
          <label>Branch<select value={n.branch} onChange={e => setN({ ...n, branch: e.target.value })}><option value="">Whole shop</option>{data.branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
          <div style={{ alignSelf: 'end' }}><button className="btn">Add hours</button></div>
        </form>
        <div className="card">
          <h2>Weekly hours</h2>
          <div className="days">
            {ORDER.flatMap(d => data.hours.filter(h => h.day_of_week === d)).map(h => (
              <div key={h.id} style={{ gridTemplateColumns: '110px 50px 1fr 1fr auto auto' }}>
                <span>{DAYS[h.day_of_week]}<br /><small className="muted">{h.staff_name || h.branch_name || 'Whole shop'}</small></span>
                <label className="sw"><input type="checkbox" checked={val(h, 'is_available')} onChange={e => set(h, 'is_available', e.target.checked)} /><span /></label>
                <input type="time" value={val(h, 'start_time')} onChange={e => set(h, 'start_time', e.target.value)} />
                <input type="time" value={val(h, 'end_time')} onChange={e => set(h, 'end_time', e.target.value)} />
                <button className="btn sm" disabled={!edit[h.id]} onClick={() => save(h)}>Save</button>
                <button className="btn red sm" onClick={() => window.confirm('Delete these hours?') && run(() => deleteWorkingHour(h.id), 'Hours deleted')}>Delete</button>
              </div>
            ))}
            {!data.hours.length && <p className="muted">No working hours set yet. Add your first day above.</p>}
          </div>
        </div>
      </>)}
    </State>
  );
}
