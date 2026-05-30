import { useEffect, useState } from 'react';
import { fetchDashboard } from '../services/api';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard()
      .then(setAnalytics)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">Enterprise healthcare hub</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">AI health command center</h1>
            </div>
            <div className="rounded-3xl bg-slate-950/90 px-5 py-3 text-sm text-slate-300 shadow-lg shadow-slate-950/40">
              Live status: <span className="font-semibold text-emerald-300">connected</span>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>
        )}

        <section className="grid gap-5 lg:grid-cols-3">
          {analytics ? [
            { label: 'Active cases', value: analytics.totalCases || 0 },
            { label: 'Patients tracked', value: analytics.totalPatients || 0 },
            { label: 'Pending follow-ups', value: analytics.pendingFollowUps || 0 }
          ].map((card) => (
            <div key={card.label} className="rounded-[28px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/30">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
              <p className="mt-4 text-5xl font-semibold text-white">{card.value}</p>
            </div>
          )) : (
            <div className="rounded-[28px] border border-slate-800 bg-slate-950/80 p-8 text-center text-slate-400">Loading analytics...</div>
          )}
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Patient risk distribution</p>
            </div>
            <div className="mt-6 grid gap-3">
              <div className="rounded-3xl bg-slate-950/90 p-6 text-slate-200">
                <p className="text-sm text-slate-400">High risk</p>
                <p className="mt-2 text-3xl font-semibold text-rose-300">{analytics?.highRiskCount ?? 0}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/90 p-6 text-slate-200">
                <p className="text-sm text-slate-400">Moderate risk</p>
                <p className="mt-2 text-3xl font-semibold text-amber-300">{analytics?.mediumRiskCount ?? 0}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/90 p-6 text-slate-200">
                <p className="text-sm text-slate-400">Low risk</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-300">{analytics?.lowRiskCount ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
            <h2 className="text-xl font-semibold text-white">Latest alerts</h2>
            <p className="mt-3 text-sm text-slate-400">Priority events from emergency and follow-up pipelines.</p>
            <div className="mt-6 space-y-4">
              {(analytics?.recentAlerts || []).slice(0, 3).map((alert, idx) => (
                <div key={idx} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-white">{alert.title}</p>
                    <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs text-rose-200">{alert.priority}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{alert.details}</p>
                </div>
              ))}
              {!analytics?.recentAlerts?.length && <p className="text-sm text-slate-500">No active alerts right now.</p>}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
