import { useEffect, useMemo, useState } from 'react'

const TRACKER_STORAGE_KEY = 'hiremate.tracker.v1'

function loadTrackerJobs() {
  try {
    const raw = localStorage.getItem(TRACKER_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed
      .filter((j) => j && typeof j === 'object')
      .map((j) => ({
        id: String(j.id ?? `trk-${cryptoSafeId()}`),
        title: String(j.title ?? ''),
        company: String(j.company ?? ''),
        dateApplied: String(j.dateApplied ?? today()),
        status: String(j.status ?? 'applied'),
        notes: String(j.notes ?? ''),
        createdAt: Number(j.createdAt ?? Date.now()),
      }))
      .filter((j) => j.title.trim() && j.company.trim())
  } catch {
    return null
  }
}

function saveTrackerJobs(jobs) {
  try {
    localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(jobs))
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

export function TrackerPage() {
  const [jobs, setJobs] = useState(() => loadTrackerJobs() ?? seedJobs())
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [dateApplied, setDateApplied] = useState(() => today())
  const [status, setStatus] = useState('applied')
  const [notes, setNotes] = useState('')

  const columns = useMemo(
    () => [
      { key: 'applied', title: 'Applied' },
      { key: 'interview', title: 'Interview' },
      { key: 'offer', title: 'Offer' },
      { key: 'rejected', title: 'Rejected' },
    ],
    [],
  )

  const jobsByStatus = useMemo(() => {
    const map = new Map(columns.map((c) => [c.key, []]))
    for (const j of jobs) map.get(j.status)?.push(j)
    for (const arr of map.values()) arr.sort((a, b) => b.createdAt - a.createdAt)
    return map
  }, [columns, jobs])

  useEffect(() => {
    saveTrackerJobs(jobs)
  }, [jobs])

  function deleteJob(id) {
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }

  function moveJob(id, nextStatus) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: nextStatus } : j)))
  }

  function onDragStart(e, id) {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDropColumn(e, status) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    moveJob(id, status)
  }

  function resetForm() {
    setTitle('')
    setCompany('')
    setDateApplied(today())
    setStatus('applied')
    setNotes('')
  }

  function addJob() {
    const t = title.trim()
    const c = company.trim()
    if (!t || !c) return
    setJobs((prev) => [
      {
        id: `trk-${cryptoSafeId()}`,
        title: t,
        company: c,
        dateApplied: dateApplied || today(),
        status,
        notes: notes.trim(),
        createdAt: Date.now(),
      },
      ...prev,
    ])
    resetForm()
    setAdding(false)
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 shadow-lg shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-300">Job Tracker</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Kanban board</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Drag cards across stages to track your applications.
            </p>
          </div>

          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400"
          >
            + Add new job
          </button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-4">
        {columns.map((col) => {
          const list = jobsByStatus.get(col.key) ?? []
          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDropColumn(e, col.key)}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white">{col.title}</div>
                <div className="rounded-full border border-white/10 bg-slate-950/30 px-2.5 py-1 text-xs font-semibold text-slate-200">
                  {list.length}
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {list.map((job) => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, job.id)}
                    className="group rounded-2xl border border-white/10 bg-slate-950/35 p-4 shadow-md shadow-black/20 transition hover:border-white/15 hover:bg-slate-950/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">{job.title}</div>
                        <div className="mt-1 truncate text-sm text-slate-300">{job.company}</div>
                      </div>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold text-slate-200 opacity-0 transition hover:bg-white/10 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>Date applied</span>
                      <span className="font-semibold text-slate-300">{job.dateApplied}</span>
                    </div>
                  </div>
                ))}

                {!list.length ? (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-xs text-slate-400">
                    Drop a job here
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </section>

      <AddJobModal
        open={adding}
        title={title}
        company={company}
        dateApplied={dateApplied}
        status={status}
        notes={notes}
        setTitle={setTitle}
        setCompany={setCompany}
        setDateApplied={setDateApplied}
        setStatus={setStatus}
        setNotes={setNotes}
        onClose={() => {
          setAdding(false)
          resetForm()
        }}
        onAdd={addJob}
      />
    </div>
  )
}

function AddJobModal({
  open,
  title,
  company,
  dateApplied,
  status,
  notes,
  setTitle,
  setCompany,
  setDateApplied,
  setStatus,
  setNotes,
  onClose,
  onAdd,
}) {
  if (!open) return null

  const disabled = !title.trim() || !company.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0 bg-black/60" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add a new job"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40"
      >
        <div className="border-b border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-indigo-300">Add new job</div>
              <div className="mt-2 text-lg font-semibold text-white">Track a fresh application</div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-4">
            <Field label="Job title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Frontend Developer"
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>
            <Field label="Company">
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Nimbus Labs"
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>
            <Field label="Date applied">
              <input
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>

            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </Field>

            <Field label="Notes">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Optional notes (e.g., referral, salary range, follow-up date)…"
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              disabled={disabled}
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Add job
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      {children}
    </label>
  )
}

function today() {
  // YYYY-MM-DD for <input type="date" />
  const d = new Date()
  const yyyy = String(d.getFullYear())
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function cryptoSafeId() {
  try {
    // eslint-disable-next-line no-undef
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {
    // ignore
  }
  return `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`
}

function seedJobs() {
  const t = today()
  const recent = (offset) => {
    const d = new Date()
    d.setDate(d.getDate() - offset)
    const yyyy = String(d.getFullYear())
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  return [
    {
      id: 'trk-1',
      title: 'Frontend Developer (React)',
      company: 'Nimbus Labs',
      dateApplied: recent(2),
      status: 'applied',
      notes: 'Applied via company website. Follow up in 3 days.',
      createdAt: Date.now() - 2_000,
    },
    {
      id: 'trk-2',
      title: 'Full-Stack Engineer (MERN)',
      company: 'HireFlow',
      dateApplied: recent(5),
      status: 'interview',
      notes: 'HR screen scheduled. Prep MERN project walkthrough.',
      createdAt: Date.now() - 5_000,
    },
    {
      id: 'trk-3',
      title: 'UI Engineer (Design Systems)',
      company: 'PixelStack',
      dateApplied: recent(8),
      status: 'offer',
      notes: 'Offer received. Negotiating salary and remote days.',
      createdAt: Date.now() - 8_000,
    },
    {
      id: 'trk-4',
      title: 'Backend Developer (Node.js)',
      company: 'AtlasWorks',
      dateApplied: t,
      status: 'rejected',
      notes: 'Rejected. Improve system design answers.',
      createdAt: Date.now() - 1_000,
    },
  ]
}

