import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, AlertTriangle, ClipboardList, Hospital, MapPin, Mic, Stethoscope, Upload, Users, Wifi, WifiOff
} from 'lucide-react';
import DashboardLayout, { NavItem } from '../components/DashboardLayout';
import RiskBadge from '../components/RiskBadge';
import { createPatient, fetchPatients, skinDetect } from '../services/api';
import { useOfflineQueue } from '../hooks/useOfflineQueue';
import { wsAlertsUrl } from '../services/api';

export default function AshaDashboard({ onLogout }) {
  const userName = localStorage.getItem('userName');
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [credentials, setCredentials] = useState(null);
  const [form, setForm] = useState({ name: '', age: '', phone: '', village: '' });
  const { online, queue, syncing, enqueue } = useOfflineQueue();

  const load = () => fetchPatients(search).then(setPatients).catch((e) => setError(e.message));

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    const ws = new WebSocket(wsAlertsUrl());
    ws.onmessage = () => load();
    return () => ws.close();
  }, []);

  const addPatient = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setCredentials(null);
    const body = { ...form, age: form.age ? Number(form.age) : null };
    if (!online) {
      enqueue('create_patient', body);
      setError('Saved offline — will sync when online');
      return;
    }
    try {
      const result = await createPatient(body);
      setForm({ name: '', age: '', phone: '', village: '' });
      load();
      if (result?.credentials) {
        setCredentials({ ...result.credentials, phone: body.phone });
        setSuccessMessage('Patient registered successfully. Copy or print credentials to share with the patient.');
      } else {
        setSuccessMessage('Patient registered successfully.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const onSkinUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await skinDetect(file);
      alert('Skin analysis complete — check AI reports');
    } catch (err) {
      setError(err.message);
    }
  };

  const nav = (
    <>
      <NavItem to="/asha" end icon={Activity} label="Overview" />
      <NavItem to="/symptom-checker" icon={Stethoscope} label="Symptom checker" />
      <NavItem to="/emergency-sos" icon={AlertTriangle} label="Emergency SOS" />
      <NavItem to="/voice-assistant" icon={Mic} label="Voice assistant" />
      <NavItem to="/hospital-finder" icon={MapPin} label="Hospital finder" />
      <NavItem to="/settings" icon={ClipboardList} label="Settings" />
    </>
  );

  return (
    <DashboardLayout title={`Welcome, ${userName || 'ASHA Worker'}`} subtitle="ASHA worker command center" nav={nav} onLogout={onLogout}>
      {error && <div className="mb-4 rounded-2xl bg-rose-500/10 p-4 text-rose-100">{error}</div>}
      {successMessage && (
        <div className="mb-4 rounded-2xl bg-emerald-500/10 p-4 text-emerald-100">
          <p>{successMessage}</p>
          {credentials && (
            <div className="mt-3 space-y-2 rounded-2xl bg-slate-950 p-3">
              <div className="grid gap-2 sm:grid-cols-3">
                <div><span className="text-xs uppercase text-slate-400">Username</span><p className="text-sm text-white">{credentials.username}</p></div>
                <div><span className="text-xs uppercase text-slate-400">Password</span><p className="text-sm text-white">{credentials.password}</p></div>
                <div><span className="text-xs uppercase text-slate-400">Health ID</span><p className="text-sm text-white">{credentials.health_id}</p></div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => navigator.clipboard.writeText(`Username: ${credentials.username}\nPassword: ${credentials.password}\nHealth ID: ${credentials.health_id}`)} className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-white">Copy credentials</button>
                <button type="button" onClick={() => window.print()} className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-white">Print patient slip</button>
                {credentials?.phone && (
                  <a href={`sms:${credentials.phone}?body=${encodeURIComponent(`Username: ${credentials.username}\nPassword: ${credentials.password}\nHealth ID: ${credentials.health_id}`)}`} className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-white">Send SMS</a>
                )}
                {credentials?.phone && (
                  <a href={`https://wa.me/${credentials.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Username: ${credentials.username}\nPassword: ${credentials.password}\nHealth ID: ${credentials.health_id}`)}`} target="_blank" rel="noreferrer" className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-white">Send WhatsApp</a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${online ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-200'}`}>
          {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {online ? 'Online' : 'Offline mode'}
        </span>
        {queue.length > 0 && <span className="text-xs text-slate-400">{queue.length} pending sync {syncing && '(syncing...)'}</span>}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-white">Patient registry</h2>
            <div className="flex gap-2">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white" />
              <button type="button" onClick={load} className="rounded-2xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Search</button>
            </div>
          </div>
          <div className="mt-6 space-y-3 max-h-[420px] overflow-auto">
            {patients.map((p) => (
              <Link key={p.id} to={`/patient/${p.id}`} className="block rounded-3xl border border-slate-800 bg-slate-900/80 p-4 hover:border-brand-500/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{p.name}</p>
                    <p className="text-sm text-slate-400">{p.village || p.district || '—'}</p>
                  </div>
                  <RiskBadge level={p.risk_level} />
                </div>
              </Link>
            ))}
            {!patients.length && <p className="text-slate-500">No patients yet.</p>}
          </div>
        </motion.div>

        <div className="space-y-5">
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
            <h3 className="flex items-center gap-2 font-semibold text-white"><Users className="h-4 w-4" /> Register patient</h3>
            <form onSubmit={addPatient} className="mt-4 space-y-3">
              {['name', 'age', 'phone', 'village'].map((f) => (
                <input key={f} placeholder={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white" required={f === 'name'} />
              ))}
              <button type="submit" className="w-full rounded-2xl bg-brand-500 py-2.5 text-sm font-semibold text-white">Add patient</button>
            </form>
          </div>
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
            <h3 className="font-semibold text-white">Quick actions</h3>
            <div className="mt-4 grid gap-2">
              <Link to="/symptom-checker" className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-white hover:bg-slate-700">AI symptom analysis</Link>
              <Link to="/emergency-sos" className="rounded-2xl bg-rose-500/20 px-4 py-3 text-sm text-rose-100">SOS emergency</Link>
              <label className="flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm text-white hover:bg-slate-700">
                <Upload className="h-4 w-4" /> Skin image upload
                <input type="file" accept="image/*" className="hidden" onChange={onSkinUpload} />
              </label>
              <Link to="/hospital-finder" className="flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm text-white"><Hospital className="h-4 w-4" /> Nearby hospitals</Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
