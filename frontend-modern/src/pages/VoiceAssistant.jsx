import { useEffect, useState } from 'react';
import { fetchPatients, voiceIntent } from '../services/api';

export default function VoiceAssistant() {
  const PATIENT_STORAGE_KEY = 'asha_selected_patient';
  const [lang, setLang] = useState('en');
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');

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

  const start = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setResult({ intent: 'unsupported', action: 'Use Chrome for speech recognition' });
      return;
    }
    const rec = new SR();
    rec.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
    rec.onresult = async (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      const res = await voiceIntent(text, lang, selectedPatient);
      setResult(res);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.start();
    setListening(true);
  };

  return (
    <div className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-6">
      <h2 className="text-xl font-semibold text-white">Multilingual Voice Assistant</h2>
      <p className="mt-2 text-sm text-slate-400">Hindi · English · Marathi — voice navigation and emergency activation</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-white">
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
        </select>
        <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-white">
          {patients.length ? patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}{p.health_id ? ` • ${p.health_id}` : ''}</option>
          )) : <option value="">Select patient</option>}
        </select>
      </div>
      <button type="button" onClick={start} className="mt-4 rounded-2xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white">
        {listening ? 'Listening...' : 'Start voice'}
      </button>
      {transcript && <p className="mt-4 text-slate-300">Transcript: {transcript}</p>}
      {result && (
        <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-sm text-slate-200">
          Intent: <strong>{result.intent}</strong> · Action: {result.action}
        </div>
      )}
    </div>
  );
}
