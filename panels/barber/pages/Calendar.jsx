import React from 'react';
import { useState } from 'react';
import { useAsync } from '../components/hooks';
import { getCalendar } from '../services/barberService';
import { State, addDays, todayStr, hhmm } from '../components/ui';

const monday = str => { const d = new Date(`${str}T00:00:00`); const off = (d.getDay() + 6) % 7; return addDays(str, -off); };

export default function Calendar() {
  const [start, setStart] = useState(monday(todayStr()));
  const { data, loading, error, reload } = useAsync(() => getCalendar(start, 'week'), [start]);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const label = d => new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="card">
      <h2>
        Week of {label(start)}
        <span className="row" style={{ margin: 0 }}>
          <button className="btn ghost sm" onClick={() => setStart(addDays(start, -7))}>← Prev</button>
          <button className="btn ghost sm" onClick={() => setStart(monday(todayStr()))}>Today</button>
          <button className="btn ghost sm" onClick={() => setStart(addDays(start, 7))}>Next →</button>
        </span>
      </h2>
      <State loading={loading} error={error} onRetry={reload}>
        <div className="cal" style={{ gridTemplateColumns: 'repeat(7,minmax(130px,1fr))' }}>
          {days.map(d => {
            const list = (data || []).filter(a => a.appointment_date === d && a.status !== 'cancelled');
            return (
              <div key={d} className={d === todayStr() ? 'today' : ''}>
                <h3>{label(d)}</h3>
                {list.length ? list.map(a => <div className="chip" key={a.id}><b>{hhmm(a.start_time)} · {a.customer_name}</b>{a.staff_name} · {a.status}</div>) : <small className="muted">Free</small>}
              </div>
            );
          })}
        </div>
      </State>
    </div>
  );
}
