import { useState } from 'react';
import { fetchHospitalsNearby } from '../services/api';

export default function HospitalFinder() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (emergency = false) => {
    setLoading(true);
    try {
      const pos = await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => resolve({ lat: 18.52, lng: 73.85 })
        );
      });
      const data = await fetchHospitalsNearby(pos.lat, pos.lng, emergency);
      setHospitals(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => search(false)} className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white">{loading ? 'Searching...' : 'Find nearby hospitals'}</button>
        <button type="button" onClick={() => search(true)} className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white">Emergency routing</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {hospitals.map((h) => (
          <div key={h.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <h3 className="font-semibold text-white">{h.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{h.city} · {h.distance_km} km</p>
            <p className="mt-2 text-sm text-slate-300">{h.phone}</p>
            {h.recommend_ambulance && <p className="mt-2 text-xs font-semibold text-rose-300">Ambulance recommended</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
