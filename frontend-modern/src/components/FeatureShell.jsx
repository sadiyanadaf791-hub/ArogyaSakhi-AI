import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function FeatureShell({ children, onLogout }) {
  const role = localStorage.getItem('userRole');
  const home = role === 'DOCTOR' || role === 'SPECIALIST' ? '/doctor' : role === 'ADMIN' ? '/admin' : role === 'PATIENT' ? '/patient' : '/asha';

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link to={home} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
          <button type="button" onClick={onLogout} className="text-sm text-rose-300 hover:text-rose-200">Sign out</button>
        </div>
        {children}
      </div>
    </div>
  );
}
