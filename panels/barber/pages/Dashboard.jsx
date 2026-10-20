import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAsync } from '../components/hooks';
import { getDashboard } from '../services/barberService';
import { BASE } from '../data/config';
import { Stat, Table, Person, Pill, State, chf, dayLabel, hhmm, addDays, todayStr } from '../components/ui';

export default function Dashboard() {
  const { appts } = useData();
  const { data, loading, error, reload } = useAsync(getDashboard, []);

  const week = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(todayStr(), i - 6);
    const total = appts.filter(a => a.appointment_date === date && a.status === 'completed').reduce((s, a) => s + Number(a.total_amount || 0), 0);
    return { date, total, label: new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short' }) };
  });
  const max = Math.max(1, ...week.map(w => w.total));

  return (
    <State loading={loading} error={error} onRetry={reload}>
      {data && (<>
        <div className="grid g4">
          <Stat hero label="Today's appointments" value={data.today.total_appointments} note={`${data.today.pending_appointments} waiting for confirmation`} />
          <Stat label="Upcoming" value={data.upcoming.appointments} note="pending + confirmed" />
          <Stat label="Today's earnings" value={data.today.revenue} note="CHF, completed today" />
          <Stat label="Customers" value={data.customers.total} note={`${data.staff.total} active staff`} />
        </div>
        <div className="grid g2" style={{ marginTop: 18 }}>
          <div className="card">
            <h2>Earnings, last 7 days <span className="muted">CHF</span></h2>
            <div className="bars">
              {week.map((w, i) => (
                <div key={w.date} className={i === 6 ? 'today' : ''}>
                  <span>{Math.round(w.total)}</span><i style={{ '--h': `${Math.max((w.total / max) * 100, 3)}%`, animationDelay: `${i * 0.06}s` }} />{w.label}
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h2>Next appointments</h2>
            <ul className="tl">
              {data.upcoming.list.slice(0, 6).map(a => <li key={a.id}><time>{hhmm(a.start_time)}</time><div>{a.customer_name}<small>{dayLabel(a.appointment_date)} · {a.staff_name}</small></div></li>)}
              {!data.upcoming.list.length && <li><div className="muted">No upcoming appointments.</div></li>}
            </ul>
          </div>
        </div>
        <div className="card" style={{ marginTop: 18 }}>
          <h2>Recent bookings <Link to={`${BASE}/appointments`} className="btn ghost sm" style={{ textDecoration: 'none' }}>View all</Link></h2>
          <Table cols={['Customer', 'Barber', 'When', 'Price', 'Status']} rows={data.recent.appointments.slice(0, 6).map(a => (
            <tr key={a.id}><td><Person name={a.customer_name} /></td><td>{a.staff_name}</td><td>{dayLabel(a.appointment_date)}, {hhmm(a.start_time)}</td><td>{chf(a.total_amount)}</td><td><Pill s={a.status} /></td></tr>
          ))} />
        </div>
      </>)}
    </State>
  );
}
