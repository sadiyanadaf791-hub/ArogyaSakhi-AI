import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, BarChart3, ClipboardList, Users } from 'lucide-react';
import DashboardLayout, { NavItem } from '../components/DashboardLayout';
import { fetchAlerts, fetchDashboard, alertAction } from '../services/api';
import { wsAlertsUrl } from '../services/api';

export default function DoctorDashboard({ onLogout }) {
  const [analytics, setAnalytics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    fetchDashboard().then(setAnalytics).catch((e) => setError(e.message));
    fetchAlerts().then(setAlerts).catch(() => {});
  };

  const handleAlertAction = async (alertId, action) => {
    try {
      await alertAction(alertId, { action });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
    const ws = new WebSocket(wsAlertsUrl());
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'emergency' || msg.type === 'sos') load();
      } catch (_) { /* ignore */ }
    };
    return () => ws.close();
  }, []);

  const chartData = analytics
    ? [
        { name: 'High', value: analytics.highRiskCount || 0 },
        { name: 'Medium', value: analytics.mediumRiskCount || 0 },
        { name: 'Low', value: analytics.lowRiskCount || 0 }
      ]
    : [];

  const nav = (
    <>
      <NavItem to="/doctor" end icon={BarChart3} label="Overview" />
      <NavItem to="/ai-analytics" icon={BarChart3} label="AI analytics" />
      <NavItem to="/ai-reports" icon={ClipboardList} label="AI reports" />
      <NavItem to="/settings" icon={Users} label="Settings" />
    </>
  );

  return (
    <DashboardLayout title="Doctor workspace" subtitle="Live emergency monitoring" nav={nav} onLogout={onLogout}>
      {error && <div className="mb-4 rounded-2xl bg-rose-500/10 p-4 text-rose-100">{error}</div>}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-[28px] border border-slate-800 bg-slate-950/80 p-6"><p className="text-sm text-slate-400">Critical cases</p><p className="mt-2 text-4xl font-bold text-rose-300">{analytics?.criticalCases ?? 0}</p></div>
        <div className="rounded-[28px] border border-slate-800 bg-slate-950/80 p-6"><p className="text-sm text-slate-400">Pending reviews</p><p className="mt-2 text-4xl font-bold text-amber-300">{analytics?.pendingReviews ?? 0}</p></div>
        <div className="rounded-[28px] border border-slate-800 bg-slate-950/80 p-6"><p className="text-sm text-slate-400">Closed today</p><p className="mt-2 text-4xl font-bold text-emerald-300">{analytics?.closedCasesToday ?? 0}</p></div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white"><AlertTriangle className="h-5 w-5 text-rose-400" /> Live emergency alerts</h2>
          <div className="mt-4 space-y-3 max-h-80 overflow-auto">
            {alerts.map((a) => (
              <div key={a.id} className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{a.patient?.name || a.message || a.alert_type}</p>
                    <p className="text-xs text-slate-400">
                      {a.patient ? `${a.patient.health_id || a.patient.id} · ${a.patient.age || '-'}y · ${a.patient.gender || '-'}` : ''}
                      {a.patient && a.assigned_doctor ? ` · Doctor: ${a.assigned_doctor.name}` : ''}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">{a.status}</span>
                </div>
                <p className="mt-3 text-sm text-slate-200">{a.message || 'Review patient emergency details and respond.'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {a.status === 'open' && (
                    <>
                      <button type="button" onClick={() => handleAlertAction(a.id, 'accept')} className="rounded-2xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400">
                        Accept
                      </button>
                      <button type="button" onClick={() => handleAlertAction(a.id, 'reject')} className="rounded-2xl bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400">
                        Reject
                      </button>
                      <button type="button" onClick={() => handleAlertAction(a.id, 'resolve')} className="rounded-2xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">
                        Resolve
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {!alerts.length && <p className="text-sm text-slate-500">No active emergencies</p>}
          </div>
        </div>
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6 h-80">
          <h2 className="text-lg font-semibold text-white">Risk distribution</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Bar dataKey="value" fill="#5d63ff" radius={[8, 8, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
