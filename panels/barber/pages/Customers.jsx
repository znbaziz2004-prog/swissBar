import React from 'react';
import { useEffect, useState } from 'react';
import { useAsync } from '../components/hooks';
import { getCustomers } from '../services/barberService';
import { Table, Person, State, dayLabel } from '../components/ui';

export default function Customers() {
  const [q, setQ] = useState('');
  const [term, setTerm] = useState('');
  useEffect(() => { const t = setTimeout(() => setTerm(q.trim()), 350); return () => clearTimeout(t); }, [q]);
  const { data, loading, error, reload } = useAsync(() => getCustomers(term), [term]);

  return (
    <>
      <div className="row"><input placeholder="Search name, phone or email…" value={q} onChange={e => setQ(e.target.value)} /></div>
      <div className="card">
        <State loading={loading} error={error} onRetry={reload}>
          <Table cols={['Customer', 'Phone', 'Email', 'Visits', 'Last visit']} rows={(data || []).map(c => (
            <tr key={c.id}><td><Person name={c.name} /></td><td>{c.phone || '—'}</td><td className="muted">{c.email || '—'}</td><td>{c.total_appointments}</td><td>{c.last_appointment_date ? dayLabel(c.last_appointment_date) : '—'}</td></tr>
          ))} />
        </State>
      </div>
    </>
  );
}
