import React from 'react';
import { useData } from '../context/DataContext';
import { useAsync } from '../components/hooks';
import { getPayments } from '../services/barberService';
import { Stat, Table, Person, Pill, State, chf, dayLabel, addDays, todayStr } from '../components/ui';

export default function Earnings() {
  const { appts } = useData();
  const { data, loading, error, reload } = useAsync(getPayments, []);

  const done = appts.filter(a => a.status === 'completed');
  const sum = from => done.filter(a => a.appointment_date >= from && a.appointment_date <= todayStr()).reduce((s, a) => s + Number(a.total_amount || 0), 0);
  const t = todayStr();
  const mondayOff = (new Date().getDay() + 6) % 7;

  return (
    <>
      <div className="grid g4">
        <Stat hero label="Today" value={Math.round(sum(t))} note="CHF · completed" />
        <Stat label="This week" value={Math.round(sum(addDays(t, -mondayOff)))} note="CHF · since Monday" />
        <Stat label="This month" value={Math.round(sum(`${t.slice(0, 8)}01`))} note="CHF · completed" />
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <h2>Payments</h2>
        <State loading={loading} error={error} onRetry={reload}>
          <Table cols={['Customer', 'Appointment', 'Method', 'Amount', 'Status']} rows={(data || []).map(p => (
            <tr key={p.id}><td><Person name={p.customer_name} /></td><td>{dayLabel(p.appointment_date)}</td><td style={{ textTransform: 'capitalize' }}>{p.method || '—'}</td><td>{chf(p.amount)}</td><td><Pill s={p.status} /></td></tr>
          ))} />
        </State>
      </div>
    </>
  );
}
