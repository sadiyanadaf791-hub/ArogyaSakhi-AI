import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Activity, Bell, LogOut, Moon, Sun } from 'lucide-react';

export default function DashboardLayout({ title, subtitle, nav, children, onLogout }) {
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-72 flex-col border-r border-slate-800/80 bg-slate-950/90 p-6 backdrop-blur-xl lg:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-sky-500 text-xl shadow-lg shadow-brand-500/30">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">ArogyaSakhi AI</p>
            <p className="text-xs text-slate-400">Rural healthcare platform</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-2">{nav}</nav>
        <div className="mt-auto space-y-2 border-t border-slate-800 pt-4">
          <button type="button" onClick={toggle} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-800">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-rose-300 hover:bg-rose-500/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 md:p-10">
        <header className="mb-8 flex flex-col gap-4 rounded-[32px] border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300/80">{subtitle}</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-3">
              <Bell className="h-5 w-5 text-slate-300" />
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export function NavItem({ to, icon: Icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
          isActive ? 'bg-gradient-to-r from-brand-500/20 to-sky-500/10 text-white' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}
