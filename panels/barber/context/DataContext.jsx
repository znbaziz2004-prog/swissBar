import React from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { getAppointments, updateAppointmentStatus } from '../services/barberService';
import { errMsg } from '../services/api';

const DataCtx = createContext(null);
export const useData = () => useContext(DataCtx);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const timer = useRef();

  const toast = useCallback(m => {
    setToastMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(''), 2600);
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setAppts(await getAppointments()); } catch (e) { setError(errMsg(e, 'Failed to load appointments')); } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (user) reload(); else setAppts([]); }, [user, reload]);

  const setStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      toast(`Appointment ${status.replace('_', ' ')}`);
      await reload();
    } catch (e) { toast(errMsg(e, 'Could not update appointment')); }
  };

  return (
    <DataCtx.Provider value={{ appts, loading, error, reload, setStatus, toast }}>
      {children}
      <div className="bp"><div className={`toast ${toastMsg ? 'show' : ''}`}>{toastMsg}</div></div>
    </DataCtx.Provider>
  );
}
