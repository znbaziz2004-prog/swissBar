import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../components/hooks';
import { getMe } from '../services/barberService';
import { Pill, State } from '../components/ui';

export default function Settings() {
  const { user, logout } = useAuth();
  const { data, loading, error, reload } = useAsync(getMe, []);
  const me = data?.user || data || user;
  const rows = [['Name', me?.name], ['Email', me?.email], ['Phone', me?.phone || '—'], ['Role', me?.role]];

  return (
    <State loading={loading} error={error} onRetry={reload}>
      <div className="card">
        <h2>My account {me?.status && <Pill s={me.status} />}</h2>
        <div className="form">
          {rows.map(([l, v]) => <label key={l}>{l}<input readOnly value={v || ''} style={{ textTransform: l === 'Role' ? 'capitalize' : 'none' }} /></label>)}
        </div>
        <p className="note">To change your password or contact details, please contact Swiss Barber support or your shop owner.</p>
        <p style={{ marginTop: 18 }}><button className="btn red" onClick={logout}>Log out</button></p>
      </div>
    </State>
  );
}
