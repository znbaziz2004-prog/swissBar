import React from 'react';
import { useData } from '../context/DataContext';
import { useAsync } from '../components/hooks';
import { getNotifications } from '../services/barberService';
import { State, Pill, dayLabel, hhmm } from '../components/ui';

export default function Notifications() {
  const { appts } = useData();
  const { data, loading, error, reload } = useAsync(getNotifications, []);
  // keep only notifications that belong to this shop's appointments
  const ids = new Set(appts.map(a => a.id));
  const list = (data || []).filter(n => n.appointment_id && ids.has(n.appointment_id));
  const icon = c => (c === 'email' ? '✉' : c === 'sms' ? '💬' : '🔔');

  return (
    <State loading={loading} error={error} onRetry={reload}>
      <div className="card">
        {list.map(n => (
          <div className="nt" key={n.id}>
            <i>{icon(n.channel)}</i>
            <div style={{ flex: 1 }}>
              <b>{n.subject || (n.type || 'notification').replace(/_/g, ' ')}</b><br />
              <small className="muted">{n.message}</small><br />
              <small className="muted">{n.recipient}{n.appointment_date ? ` · ${dayLabel(n.appointment_date)} ${hhmm(n.start_time)}` : ''}</small>
            </div>
            <Pill s={n.status} />
          </div>
        ))}
        {!list.length && <p className="muted">No notifications yet.</p>}
      </div>
    </State>
  );
}
