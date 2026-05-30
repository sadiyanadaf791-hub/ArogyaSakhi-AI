import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchDashboard } from '../services/api';

export default function AIAnalytics() {
  const [data, setData] = useState(null);
  useEffect(() => { fetchDashboard().then(setData); }, []);

  const chart = [
    { name: 'High', cases: data?.highRiskCount || 0 },
    { name: 'Med', cases: data?.mediumRiskCount || 0 },
    { name: 'Low', cases: data?.lowRiskCount || 0 }
  ];

  return (
    <div className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
      <h2 className="text-xl font-semibold text-white">AI system analytics</h2>
      <p className="mt-2 text-sm text-slate-400">Engine status: {data?.engineStatus || 'online'}</p>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chart}><XAxis dataKey="name" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip /><Area type="monotone" dataKey="cases" stroke="#5d63ff" fill="#5d63ff33" /></AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
