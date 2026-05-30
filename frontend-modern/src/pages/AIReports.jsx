import { useEffect, useState } from 'react';
import { fetchAlerts } from '../services/api';

export default function AIReports() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => { fetchAlerts().then(setAlerts).catch(() => {}); }, []);

  return (
    <div className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
      <h2 className="text-xl font-semibold text-white">AI & emergency reports</h2>
      <div className="mt-6 space-y-3">
        {alerts.map((a) => (
          <div key={a.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="font-medium text-white">{a.alert_type || 'Report'}</p>
            <p className="text-sm text-slate-400">{a.message}</p>
          </div>
        ))}
        {!alerts.length && <p className="text-slate-500">No reports yet.</p>}
      </div>
    </div>
  );
}
