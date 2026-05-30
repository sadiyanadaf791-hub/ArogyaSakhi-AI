import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const result = await login(username, password);
      const role = result.user?.role;
      if (role === 'DOCTOR' || role === 'SPECIALIST') navigate('/doctor');
      else if (role === 'ADMIN' || role === 'AUDITOR') navigate('/admin');
      else if (role === 'PATIENT') navigate('/patient');
      else navigate('/asha');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-sky-500 text-3xl shadow-lg">
            🏥
          </div>
          <h1 className="text-3xl font-semibold text-white">ArogyaSakhi AI</h1>
          <p className="mt-2 text-sm text-slate-400">AI-powered rural healthcare & emergency assistance</p>
        </div>

        {error && <div className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-slate-300">
            Username
            <input className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-brand-400" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <input type="password" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-brand-400" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-brand-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New user? <Link to="/signup" className="text-sky-400">Create account</Link>
        </p>

        <div className="mt-6 rounded-2xl bg-slate-950/70 p-4 text-xs text-slate-400">
          <div className="font-medium text-slate-200 mb-2">Demo credentials</div>
          <div className="grid gap-1 sm:grid-cols-2">
            <div>ASHA: <span className="text-white">pcw1</span> / pcw123</div>
            <div>Doctor: <span className="text-white">doctor1</span> / doc123</div>
            <div>Patient: <span className="text-white">patient1</span> / pat123</div>
            <div>Admin: <span className="text-white">admin</span> / admin123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
