import { useEffect, useState } from 'react';
import { Calendar, FileText, Heart } from 'lucide-react';
import DashboardLayout, { NavItem } from '../components/DashboardLayout';
import { fetchDashboard, fetchPatientMe } from '../services/api';

export default function PatientDashboard({ onLogout }) {
  const userName = localStorage.getItem('userName');
  const [analytics, setAnalytics] = useState(null);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetchDashboard().then(setAnalytics).catch(() => {});
    fetchPatientMe().then(setPatient).catch(() => {});
  }, []);

  const nav = (
    <>
      <NavItem to="/patient" end icon={Heart} label="My health" />
      <NavItem to="/emergency-sos" icon={Calendar} label="Emergency" />
      <NavItem to="/ai-reports" icon={FileText} label="Reports" />
      <NavItem to="/settings" icon={FileText} label="Settings" />
    </>
  );

  return (
    <DashboardLayout title={`Hello, ${userName || 'Patient'}`} subtitle="Your health portal" nav={nav} onLogout={onLogout}>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-[28px] border border-slate-800 bg-slate-950/80 p-6"><p className="text-sm text-slate-400">Health score</p><p className="mt-2 text-4xl font-bold text-emerald-300">{analytics?.patientHealthScore ?? 72}%</p></div>
        <div className="rounded-[28px] border border-slate-800 bg-slate-950/80 p-6"><p className="text-sm text-slate-400">Risk level</p><p className="mt-2 text-lg font-semibold text-white">{patient?.risk_level || 'Green'}</p></div>
        <div className="rounded-[28px] border border-slate-800 bg-slate-950/80 p-6"><p className="text-sm text-slate-400">Next appointment</p><p className="mt-2 text-lg font-semibold text-white">{analytics?.nextAppointment || 'None scheduled'}</p></div>
      </div>
      {patient && (
        <section className="mt-8 rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
          <h2 className="text-xl font-semibold text-white">Patient profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <PatientField label="Name" value={patient.name} />
            <PatientField label="Age" value={patient.age || 'N/A'} />
            <PatientField label="Gender" value={patient.gender || 'N/A'} />
            <PatientField label="Village" value={patient.village || 'N/A'} />
            <PatientField label="Phone" value={patient.phone || 'N/A'} />
            <PatientField label="Health ID" value={patient.health_id || 'N/A'} />
          </div>
        </section>
      )}
      <section className="mt-8 rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
        <h2 className="text-xl font-semibold text-white">AI recommendations</h2>
        <div className="mt-4 space-y-3">
          {(analytics?.recommendations || []).map((r, i) => (
            <div key={i} className="rounded-2xl bg-slate-900 p-4"><p className="font-medium text-white">{r.title}</p><p className="text-sm text-slate-400">{r.description}</p></div>
          ))}
          {!analytics?.recommendations?.length && <p className="text-slate-500">Complete a symptom check for personalized guidance.</p>}
        </div>
      </section>
    </DashboardLayout>
  );
}

function PatientField({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-900/80 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}
