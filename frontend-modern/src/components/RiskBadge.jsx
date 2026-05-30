export default function RiskBadge({ level }) {
  const map = {
    Red: 'bg-rose-500/20 text-rose-200 ring-rose-500/40',
    Yellow: 'bg-amber-500/20 text-amber-200 ring-amber-500/40',
    Green: 'bg-emerald-500/20 text-emerald-200 ring-emerald-500/40'
  };
  const cls = map[level] || map.Green;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ${cls}`}>
      {level || 'Green'}
    </span>
  );
}
