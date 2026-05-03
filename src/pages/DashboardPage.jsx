export function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 shadow-lg shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-300">Dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Welcome back, Nisar 👋
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
              Here’s a quick snapshot of your job search progress and the next best actions to take.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400">
              Upgrade Plan
            </button>
            <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10">
              View Profile
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Applications Sent"
          value="24"
          helper="Last 30 days"
          accentClass="bg-emerald-500/15 text-emerald-300 ring-emerald-500/20"
        />
        <StatCard
          label="Resume Score"
          value="82"
          helper="Based on latest scan"
          accentClass="bg-indigo-500/15 text-indigo-300 ring-indigo-500/20"
        />
        <StatCard
          label="Interviews"
          value="3"
          helper="This week"
          accentClass="bg-amber-500/15 text-amber-300 ring-amber-500/20"
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-white">Quick actions</h2>
          <p className="text-sm text-slate-300">Jump back in with one click.</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ActionButton title="Create Resume" subtitle="Build or improve your resume" tone="indigo" />
          <ActionButton title="Find Jobs" subtitle="Search roles that match you" tone="emerald" />
          <ActionButton title="Prepare Interview" subtitle="Practice and get feedback" tone="amber" />
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, helper, accentClass }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-300">{label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</div>
          <div className="mt-2 text-xs text-slate-400">{helper}</div>
        </div>
        <div className={['rounded-xl px-3 py-1 text-xs font-semibold ring-1', accentClass].join(' ')}>
          Live
        </div>
      </div>
    </div>
  )
}

function ActionButton({ title, subtitle, tone }) {
  const toneClasses =
    tone === 'emerald'
      ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'
      : tone === 'amber'
        ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
        : 'bg-indigo-500 hover:bg-indigo-400 shadow-indigo-500/20'

  return (
    <button
      className={[
        'group rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-left shadow-lg shadow-black/20 transition',
        'hover:border-white/15 hover:bg-slate-950/55',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-sm text-slate-300">{subtitle}</div>
        </div>
        <span
          className={[
            'inline-flex rounded-xl px-3 py-1 text-xs font-semibold text-white shadow-md',
            toneClasses,
          ].join(' ')}
        >
          Start
        </span>
      </div>
      <div className="mt-4 text-xs font-medium text-slate-400 group-hover:text-slate-300">Open →</div>
    </button>
  )
}

