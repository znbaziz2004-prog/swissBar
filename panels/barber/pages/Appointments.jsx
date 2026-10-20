import React from 'react';
import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Table, Person, Pill, State, chf, dayLabel, hhmm, diffDays } from '../components/ui';

const TABS = ['All', 'Today', 'Upcoming', 'Pending', 'Completed', 'Cancelled'];

export default function Appointments() {
  const { appts, loading, error, reload, setStatus } = useData();
  const [tab, setTab] = useState('All');
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(null);

  const list = appts.filter(a => {
    const d = diffDays(a.appointment_date);
    const ok = tab === 'All' || (tab === 'Today' && d === 0) || (tab === 'Upcoming' && d > 0 && ['pending', 'confirmed'].includes(a.status))
      || (tab === 'Pending' && a.status === 'pending') || (tab === 'Completed' && a.status === 'completed') || (tab === 'Cancelled' && ['cancelled', 'no_show'].includes(a.status));
    return ok && (a.customer_name || '').toLowerCase().includes(q.toLowerCase());
  }).sort((a, b) => (b.appointment_date + b.start_time).localeCompare(a.appointment_date + a.start_time));

  const act = async (id, status) => { setBusy(id); await setStatus(id, status); setBusy(null); };
  const Btn = ({ a, to, label, cls = '' }) => <button className={`btn sm ${cls}`} disabled={busy === a.id} onClick={() => act(a.id, to)}>{label}</button>;
  const actions = a => a.status === 'pending' ? (<><Btn a={a} to="confirmed" label="Confirm" /> <Btn a={a} to="cancelled" label="Cancel" cls="red" /></>)
    : a.status === 'confirmed' ? (<><Btn a={a} to="completed" label="Complete" cls="ghost" /> <Btn a={a} to="no_show" label="No-show" cls="red" /></>) : '—';

  return (
    <State loading={loading && !appts.length} error={error} onRetry={reload}>
      <div className="row">
        <div className="tabs">{TABS.map(t => <button key={t} className={t === tab ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
        <input placeholder="Search customer…" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="card">
        <Table cols={['Customer', 'Contact', 'Barber', 'When', 'Price', 'Status', 'Action']} rows={list.map(a => (
          <tr key={a.id}>
            <td><Person name={a.customer_name} /></td>
            <td className="muted">{a.customer_phone || a.customer_email}</td>
            <td>{a.staff_name}</td>
            <td>{dayLabel(a.appointment_date)}, {hhmm(a.start_time)}</td>
            <td>{chf(a.total_amount)}</td><td><Pill s={a.status} /></td><td>{actions(a)}</td>
          </tr>
        ))} />
      </div>
    </State>
  );
}
