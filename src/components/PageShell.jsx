import { Link } from 'react-router-dom'

export function PageShell({ title, subtitle }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Page</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
      {subtitle ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">{subtitle}</p> : null}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link
          to="/"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10"
        >
          Back to Home
        </Link>
        <Link
          to="/dashboard"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/profile"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10"
        >
          Go to Profile
        </Link>
      </div>
    </section>
  )
}

