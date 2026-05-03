function dotClass({ loading, ok }) {
  if (loading) return 'bg-amber-400'
  return ok ? 'bg-emerald-400' : 'bg-rose-400'
}

export function StatusBadge({ loading, ok, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
      <span className={`h-2 w-2 rounded-full ${dotClass({ loading, ok })}`} />
      <span className="font-medium">{label}</span>
    </div>
  )
}
