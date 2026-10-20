import React from 'react';
import { useAsync } from '../components/hooks';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { canManage } from '../data/config';
import { errMsg } from '../services/api';
import { getReviewSummary, getReviews, updateReviewStatus } from '../services/barberService';
import { Pill, State } from '../components/ui';

const load = async () => { const [reviews, summary] = await Promise.all([getReviews(), getReviewSummary().catch(() => null)]); return { reviews, summary }; };

export default function Reviews() {
  const { user } = useAuth();
  const { toast } = useData();
  const { data, loading, error, reload } = useAsync(load, []);
  const set = async (id, status) => { try { await updateReviewStatus(id, status); toast(`Review ${status}`); reload(); } catch (e) { toast(errMsg(e)); } };

  return (
    <State loading={loading} error={error} onRetry={reload}>
      {data && (<>
        <div className="grid g4"><div className="card stat hero"><span>Average rating</span><b>{Number(data.summary?.average_rating || 0).toFixed(1)}</b><em>{data.summary?.total_reviews || 0} approved reviews</em></div></div>
        <div className="grid g3" style={{ marginTop: 18 }}>
          {data.reviews.map(r => (
            <div className="card" key={r.id}>
              <div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)} <Pill s={r.status} /></div>
              <p style={{ margin: '10px 0' }}>{r.comment || <span className="muted">No comment</span>}</p>
              <small className="muted">{r.customer_name}</small>
              {canManage(user.role) && r.status === 'pending' && (
                <p style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button className="btn sm" onClick={() => set(r.id, 'approved')}>Approve</button>
                  <button className="btn red sm" onClick={() => set(r.id, 'rejected')}>Reject</button>
                </p>
              )}
            </div>
          ))}
          {!data.reviews.length && <p className="muted">No reviews yet.</p>}
        </div>
      </>)}
    </State>
  );
}
