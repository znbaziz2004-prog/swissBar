import React from 'react';
import { useState } from 'react';
import { useAsync } from '../components/hooks';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { canManage } from '../data/config';
import { errMsg } from '../services/api';
import { createService, deleteService, getServices, getShopProfile, updateServiceStatus } from '../services/barberService';
import { Table, State, chf } from '../components/ui';

export default function Services() {
  const { toast } = useData();
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(getServices, []);
  const [adding, setAdding] = useState(false);
  const [s, setS] = useState({ name: '', price: '', mins: '', description: '' });
  const owner = user.role === 'owner';

  const run = async (fn, ok) => { try { await fn(); toast(ok); await reload(); return true; } catch (e) { toast(errMsg(e)); return false; } };

  const save = async e => {
    e.preventDefault();
    const shop = await getShopProfile();
    const done = await run(() => createService({ shopId: shop.id, name: s.name, description: s.description, durationMinutes: Number(s.mins), price: Number(s.price), currency: 'CHF' }), 'Service added');
    if (done) { setS({ name: '', price: '', mins: '', description: '' }); setAdding(false); }
  };

  if (!owner) return <div className="card errbox"><b>Only the shop owner can manage services.</b></div>;
  return (
    <>
      <div className="row"><button className="btn" onClick={() => setAdding(a => !a)}>{adding ? 'Close' : 'Add service'}</button></div>
      {adding && (
        <form className="card form" style={{ marginBottom: 18 }} onSubmit={save}>
          <label>Service name<input required value={s.name} onChange={e => setS({ ...s, name: e.target.value })} /></label>
          <label>Price (CHF)<input required type="number" min="0" step="0.05" value={s.price} onChange={e => setS({ ...s, price: e.target.value })} /></label>
          <label>Duration (min)<input required type="number" min="5" value={s.mins} onChange={e => setS({ ...s, mins: e.target.value })} /></label>
          <label>Description<input value={s.description} onChange={e => setS({ ...s, description: e.target.value })} /></label>
          <div style={{ alignSelf: 'end' }}><button className="btn">Save service</button></div>
        </form>
      )}
      <div className="card">
        <State loading={loading} error={error} onRetry={reload}>
          <Table cols={['Service', 'Duration', 'Price', 'Active', '']} rows={(data || []).map(v => (
            <tr key={v.id}>
              <td>{v.name}<br /><small className="muted">{v.description}</small></td><td>{v.duration_minutes} min</td><td>{chf(v.price)}</td>
              <td><label className="sw"><input type="checkbox" checked={v.status === 'active'} onChange={() => run(() => updateServiceStatus(v.id, v.status === 'active' ? 'inactive' : 'active'), 'Service updated')} /><span /></label></td>
              <td><button className="btn red sm" onClick={() => window.confirm(`Delete "${v.name}"?`) && run(() => deleteService(v.id), 'Service deleted')}>Delete</button></td>
            </tr>
          ))} />
        </State>
      </div>
      {!canManage(user.role) && null}
    </>
  );
}
