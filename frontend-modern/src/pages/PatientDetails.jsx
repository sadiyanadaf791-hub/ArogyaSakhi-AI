import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import RiskBadge from '../components/RiskBadge';

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    api.get(`/patients/${id}`).then((r) => setPatient(r.data));
  }, [id]);

  if (!patient) return <p className="text-slate-400">Loading patient...</p>;

  return (
    <div className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">{patient.name}</h1>
        <RiskBadge level={patient.risk_level} />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-900 p-4"><span className="text-slate-500">Age</span><p className="text-white">{patient.age}</p></div>
        <div className="rounded-2xl bg-slate-900 p-4"><span className="text-slate-500">Phone</span><p className="text-white">{patient.phone}</p></div>
        <div className="rounded-2xl bg-slate-900 p-4"><span className="text-slate-500">Village</span><p className="text-white">{patient.village}</p></div>
        <div className="rounded-2xl bg-slate-900 p-4"><span className="text-slate-500">Health ID</span><p className="text-white">{patient.health_id}</p></div>
      </div>
    </div>
  );
}
