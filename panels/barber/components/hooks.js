import { useCallback, useEffect, useState } from 'react';
import { errMsg } from '../services/api';

/* fn() -> promise. Returns { data, loading, error, reload, setData } */
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  const reload = useCallback(async () => {
    setLoading(true); setError('');
    try { setData(await run()); } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  }, [run]);

  useEffect(() => { reload(); }, [reload]);
  return { data, loading, error, reload, setData };
}
