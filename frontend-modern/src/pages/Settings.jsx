import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggle } = useTheme();
  return (
    <div className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-8 max-w-lg">
      <h2 className="text-xl font-semibold text-white">Settings</h2>
      <p className="mt-2 text-sm text-slate-400">Appearance and session preferences</p>
      <button type="button" onClick={toggle} className="mt-6 rounded-2xl bg-slate-800 px-5 py-3 text-sm text-white">
        Switch to {theme === 'dark' ? 'light' : 'dark'} mode
      </button>
    </div>
  );
}
