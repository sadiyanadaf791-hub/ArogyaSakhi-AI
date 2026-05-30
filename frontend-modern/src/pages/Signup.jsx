import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', name: '', email: '', role: 'PATIENT' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await signup(form);
      const role = data.user?.role;
      if (role === 'DOCTOR') navigate('/doctor');
      else if (role === 'ADMIN') navigate('/admin');
      else if (role === 'PATIENT') navigate('/patient');
      else navigate('/asha');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-white">Create account</h1>
        <p className="mt-2 text-sm text-slate-400">Join ArogyaSakhi AI healthcare platform</p>
        {error && <div className="mt-4 rounded-2xl bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {['name', 'username', 'email', 'password'].map((field) => (
            <label key={field} className="block text-sm text-slate-300 capitalize">
              {field}
              <input
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-400"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                type={field === 'password' ? 'password' : 'text'}
                required={field !== 'email'}
              />
            </label>
          ))}
          <label className="block text-sm text-slate-300">
            Role
            <select
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="PATIENT">Patient</option>
              <option value="ASHA_WORKER">ASHA Worker</option>
              <option value="DOCTOR">Doctor</option>
            </select>
          </label>
          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-brand-500 to-sky-500 py-3 font-semibold text-white">
            Sign up
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-sky-400">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
