import { useEffect, useState } from 'react';
import { fetchPatients, triggerSOS } from '../services/api';

export default function EmergencySOS() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const PATIENT_STORAGE_KEY = 'asha_selected_patient';

  useEffect(() => {
    fetchPatients().then((data) => {
      const patientList = data || [];
      setPatients(patientList);
      const storedPatient = localStorage.getItem(PATIENT_STORAGE_KEY);
      if (storedPatient && patientList.find((p) => p.id === storedPatient)) {
        setSelectedPatient(storedPatient);
      } else if (patientList.length) {
        setSelectedPatient(patientList[0].id);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      localStorage.setItem(PATIENT_STORAGE_KEY, selectedPatient);
    }
  }, [selectedPatient]);

  const send = async () => {
    setLoading(true);
    setStatus('');
    try {
      const pos = await new Promise((resolve) => {
        if (!navigator.geolocation) return resolve({ latitude: 18.52, longitude: 73.85 });
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
          () => resolve({ latitude: 18.52, longitude: 73.85 })
        );
      });
      const data = await triggerSOS({ patient_id: selectedPatient, message: 'Emergency SOS from ASHA worker', ...pos });
      setStatus(`SOS dispatched. Alert ID: ${data.alert_id}`);
    } catch (e) {
      setStatus(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[32px] border border-rose-500/30 bg-gradient-to-br from-rose-950/80 to-slate-950/80 p-10 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-rose-300">Emergency</p>
      <h2 className="mt-4 text-3xl font-bold text-white">One-tap SOS</h2>
      <p className="mx-auto mt-3 max-w-md text-slate-400">Notifies doctors, admins, and suggests nearest hospitals instantly.</p>
      {patients.length > 0 && (
        <div className="mx-auto mt-6 max-w-sm text-left">
          <label className="block text-sm text-slate-300">Select patient</label>
          <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white">
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>{patient.name}{patient.health_id ? ` • ${patient.health_id}` : ''}</option>
            ))}
          </select>
        </div>
      )}
      <button
        type="button"
        onClick={send}
        disabled={loading}
        className="mt-8 rounded-full bg-rose-500 px-12 py-6 text-lg font-bold text-white shadow-xl shadow-rose-500/40 hover:bg-rose-400 disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'TRIGGER SOS'}
      </button>
      {status && <p className="mt-6 text-sm text-emerald-300">{status}</p>}
    </div>
  );
}
