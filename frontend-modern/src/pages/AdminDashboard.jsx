import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Building2, Shield, Users } from 'lucide-react';
import DashboardLayout, { NavItem } from '../components/DashboardLayout';
import { fetchAdminStats, fetchAdminUsers, fetchDashboard } from '../services/api';

const COLORS = ['#f43f5e', '#f59e0b', '#10b981'];

export default function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAdminStats().then(setStats).catch(() => {});
    fetchDashboard().then(setAnalytics).catch(() => {});
    fetchAdminUsers().then(setUsers).catch(() => {});
  }, []);

  const pie = analytics
    ? [
        { name: 'Red', value: analytics.highRiskCount || 0 },
        { name: 'Yellow', value: analytics.mediumRiskCount || 0 },
        { name: 'Green', value: analytics.lowRiskCount || 0 }
      ]
    : [];

  const nav = (
    <>
      <NavItem to="/admin" end icon={Shield} label="Overview" />
      <NavItem to="/ai-analytics" icon={Building2} label="AI analytics" />
      <NavItem to="/settings" icon={Users} label="Settings" />
    </>
  );

  return (
    <DashboardLayout title="Admin control center" subtitle="Platform monitoring" nav={nav} onLogout={onLogout}>
      <div className="grid gap-5 lg:grid-cols-4">
        <Stat label="Users" value={stats?.total_users ?? 0} />
        <Stat label="Patients" value={stats?.total_patients ?? 0} />
        <Stat label="AI predictions" value={stats?.total_predictions ?? 0} />
        <Stat label="Open alerts" value={stats?.open_alerts ?? 0} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6 h-72">
          <h2 className="text-lg font-semibold text-white">Risk distribution</h2>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart><Pie data={pie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
          <h2 className="text-lg font-semibold text-white">User management</h2>
          <div className="mt-4 max-h-64 overflow-auto space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex justify-between rounded-2xl bg-slate-900 px-4 py-3 text-sm">
                <span className="text-white">{u.name}</span>
                <span className="text-slate-400">{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-950/80 p-6">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-4xl font-bold text-white">{value}</p>
    </div>
  );
}
