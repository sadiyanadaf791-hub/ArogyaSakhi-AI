import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Brain, MapPin, Mic, Shield } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-sky-500">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">ArogyaSakhi AI</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="rounded-2xl px-5 py-2.5 text-sm text-slate-300 hover:text-white">Sign in</Link>
          <Link to="/signup" className="rounded-2xl bg-gradient-to-r from-brand-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white">
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold leading-tight text-white md:text-6xl"
        >
          AI-powered intelligent rural healthcare
          <span className="block bg-gradient-to-r from-brand-400 to-sky-400 bg-clip-text text-transparent">
            and emergency assistance
          </span>
        </motion.h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Enterprise telemedicine platform for ASHA workers, doctors, patients, and administrators — with real ML risk prediction, SOS alerts, and multilingual voice assistance.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/signup" className="rounded-2xl bg-gradient-to-r from-brand-500 to-sky-500 px-8 py-4 font-semibold text-white shadow-lg shadow-brand-500/25">
            Start free trial
          </Link>
          <Link to="/login" className="rounded-2xl border border-slate-700 px-8 py-4 font-semibold text-slate-200">
            Demo login
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-4">
        {[
          { icon: Brain, title: 'AI Symptom Checker', desc: 'Real risk scoring with Green/Yellow/Red triage' },
          { icon: Mic, title: 'Voice Assistant', desc: 'Hindi, English, Marathi voice navigation' },
          { icon: MapPin, title: 'Hospital Finder', desc: 'GPS routing and ambulance recommendations' },
          { icon: Shield, title: 'Emergency SOS', desc: 'Live WebSocket alerts to doctors and admins' }
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl"
          >
            <f.icon className="mb-4 h-8 w-8 text-sky-400" />
            <h3 className="text-lg font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
