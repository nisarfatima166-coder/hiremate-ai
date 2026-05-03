import { useEffect, useMemo, useState } from 'react'

const SAVED_JOBS_STORAGE_KEY = 'hiremate.savedJobs.v1'

function loadSavedJobIds() {
  try {
    const raw = localStorage.getItem(SAVED_JOBS_STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.map(String))
  } catch {
    return new Set()
  }
}

function saveSavedJobIds(set) {
  try {
    localStorage.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify(Array.from(set)))
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

export function JobsPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('All')
  const [jobType, setJobType] = useState('All')
  const [savedIds, setSavedIds] = useState(() => loadSavedJobIds())
  const [applyJob, setApplyJob] = useState(null)
  const [useResume, setUseResume] = useState(true)
  const [applyStatus, setApplyStatus] = useState('idle') // idle | applying | success

  useEffect(() => {
    saveSavedJobIds(savedIds)
  }, [savedIds])

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') closeApplyModal()
    }
    if (applyJob) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [applyJob])

  const locations = useMemo(() => ['All', ...Array.from(new Set(MOCK_JOBS.map((j) => j.location)))], [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MOCK_JOBS.filter((j) => {
      const matchesQuery =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.tags.some((t) => t.toLowerCase().includes(q))
      const matchesLocation = location === 'All' || j.location === location
      const matchesType = jobType === 'All' || j.type === jobType
      return matchesQuery && matchesLocation && matchesType
    })
  }, [jobType, location, query])

  function toggleSaved(id) {
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function openApplyModal(job) {
    setApplyJob(job)
    setUseResume(true)
    setApplyStatus('idle')
  }

  function closeApplyModal() {
    setApplyJob(null)
    setApplyStatus('idle')
  }

  async function confirmApply() {
    if (!applyJob || applyStatus !== 'idle') return
    setApplyStatus('applying')
    await new Promise((r) => setTimeout(r, 700))
    setApplyStatus('success')
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 shadow-lg shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-300">Jobs</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Find roles that match you
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Search by title, company, or keyword. Filter by location and job type.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <span>
              <span className="font-semibold text-white">{filtered.length}</span> results
            </span>
            <span className="text-slate-500">•</span>
            <span>
              <span className="font-semibold text-white">{savedIds.size}</span> saved
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Search</span>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <SearchIcon />
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job title, company, keyword…"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/40 py-2 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </label>
          </div>

          <div className="lg:col-span-3">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              >
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="lg:col-span-2">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Job type</span>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              >
                {['All', 'Remote', 'Full-time', 'Internship'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="space-y-3">
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                saved={savedIds.has(job.id)}
                onApply={() => openApplyModal(job)}
                onToggleSaved={() => toggleSaved(job.id)}
              />
            ))}

            {!filtered.length ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-slate-300">
                <div className="text-base font-semibold text-white">No jobs found</div>
                <div className="mt-2">Try changing your search or filters.</div>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
            <div className="text-sm font-semibold text-white">Tips</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Save jobs to review later and tailor your resume for each role.</li>
              <li>Use keywords from the job description in your skills and experience.</li>
              <li>Apply quickly to new postings—timing matters.</li>
            </ul>
            <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/40 p-4 text-xs text-slate-300">
              Mock data only — connect this to your backend search later.
            </div>
          </div>
        </aside>
      </section>

      <ApplyModal
        open={Boolean(applyJob)}
        job={applyJob}
        useResume={useResume}
        setUseResume={setUseResume}
        status={applyStatus}
        onClose={closeApplyModal}
        onConfirm={confirmApply}
      />
    </div>
  )
}

function JobCard({ job, saved, onToggleSaved, onApply }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 transition hover:border-white/15 hover:bg-white/[0.06] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-base font-semibold text-white sm:text-lg">{job.title}</div>
            <Pill tone="slate">{job.type}</Pill>
            {job.salary ? <Pill tone="emerald">{job.salary}</Pill> : null}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <span className="font-medium text-slate-200">{job.company}</span>
            <span className="text-slate-500">•</span>
            <span className="inline-flex items-center gap-1">
              <MapPinIcon />
              {job.location}
            </span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-300">{job.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.slice(0, 5).map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-slate-950/30 px-3 py-1 text-xs text-slate-300">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-row flex-wrap gap-2 sm:flex-col sm:items-end">
          <button
            onClick={onApply}
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400"
          >
            Apply Now
          </button>
          <button
            onClick={onToggleSaved}
            className={[
              'rounded-xl border px-4 py-2 text-sm font-semibold shadow-md shadow-black/10 transition',
              saved
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15'
                : 'border-white/10 bg-white/5 text-slate-100 hover:bg-white/10',
            ].join(' ')}
          >
            {saved ? 'Saved' : 'Save Job'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Pill({ children, tone }) {
  const classes =
    tone === 'emerald'
      ? 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/20'
      : 'bg-white/5 text-slate-200 ring-white/10'
  return <span className={['rounded-full px-2.5 py-1 text-xs font-semibold ring-1', classes].join(' ')}>{children}</span>
}

function ApplyModal({ open, job, useResume, setUseResume, status, onClose, onConfirm }) {
  if (!open || !job) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0 bg-black/60" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Apply confirmation"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40"
      >
        <div className="border-b border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-indigo-300">Confirm application</div>
              <div className="mt-2 text-lg font-semibold text-white">{job.title}</div>
              <div className="mt-1 text-sm text-slate-300">
                {job.company} • {job.location}
              </div>
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
          {status === 'success' ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <div className="text-sm font-semibold text-emerald-200">Application submitted</div>
              <div className="mt-2 text-sm leading-relaxed text-emerald-100/90">
                Success! Your application has been sent{useResume ? ' using your resume' : ''}.
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={onClose}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-400"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={useResume}
                    onChange={(e) => setUseResume(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-950/40 text-indigo-500 focus:ring-indigo-500/30"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">Use my resume</div>
                    <div className="mt-1 text-sm text-slate-300">
                      Attach your latest resume from the resume builder.
                    </div>
                  </div>
                </label>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={status === 'applying'}
                  className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === 'applying' ? 'Applying…' : 'Confirm & Apply'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const MOCK_JOBS = [
  {
    id: 'job-1',
    title: 'Frontend Developer (React)',
    company: 'Nimbus Labs',
    location: 'Remote',
    type: 'Remote',
    salary: '$1,500–$2,500/mo',
    description: 'Build modern UI, ship fast iterations, and collaborate with product to improve conversion and UX.',
    tags: ['React', 'Tailwind', 'Vite', 'UI', 'Performance'],
  },
  {
    id: 'job-2',
    title: 'Full-Stack Engineer (MERN)',
    company: 'HireFlow',
    location: 'Lahore, PK',
    type: 'Full-time',
    salary: '$2,000–$3,000/mo',
    description: 'Own features end-to-end across React and Node/Express. Work with MongoDB and build scalable APIs.',
    tags: ['Node.js', 'Express', 'MongoDB', 'React', 'REST'],
  },
  {
    id: 'job-3',
    title: 'Backend Developer (Node.js)',
    company: 'AtlasWorks',
    location: 'Karachi, PK',
    type: 'Full-time',
    salary: null,
    description: 'Design APIs, improve reliability, and optimize database queries. Experience with auth and queues is a plus.',
    tags: ['Node.js', 'APIs', 'Auth', 'MongoDB', 'Testing'],
  },
  {
    id: 'job-4',
    title: 'UI Engineer (Design Systems)',
    company: 'PixelStack',
    location: 'Remote',
    type: 'Remote',
    salary: '$60k–$90k',
    description: 'Build reusable components and tokens. Collaborate with designers to deliver premium SaaS interfaces.',
    tags: ['Design Systems', 'React', 'Accessibility', 'Tailwind', 'Storybook'],
  },
  {
    id: 'job-5',
    title: 'Software Engineer Intern',
    company: 'Karigar Tech',
    location: 'Islamabad, PK',
    type: 'Internship',
    salary: 'PKR 40k–60k',
    description: 'Learn by shipping. Work with senior engineers on frontend features, debugging, and small API tasks.',
    tags: ['Internship', 'React', 'Git', 'APIs', 'Learning'],
  },
  {
    id: 'job-6',
    title: 'React + Tailwind Developer',
    company: 'SaaSly',
    location: 'Remote',
    type: 'Remote',
    salary: '$25–$40/hr',
    description: 'Implement pixel-perfect UI from Figma with smooth interactions, responsive layout, and clean components.',
    tags: ['Figma', 'React', 'Tailwind', 'CSS', 'UX'],
  },
  {
    id: 'job-7',
    title: 'Junior Frontend Developer',
    company: 'BlueOrbit',
    location: 'Lahore, PK',
    type: 'Full-time',
    salary: 'PKR 150k–220k',
    description: 'Work on dashboards, forms, and routing. Improve performance and help maintain a clean component library.',
    tags: ['React Router', 'Forms', 'UI', 'JavaScript', 'Testing'],
  },
  {
    id: 'job-8',
    title: 'Product Engineer',
    company: 'CareerPilot',
    location: 'Remote',
    type: 'Remote',
    salary: '$80k–$120k',
    description: 'Build user-facing flows for onboarding, resume builder, and job tracking. Strong product sense required.',
    tags: ['Product', 'React', 'Node.js', 'Experiments', 'Analytics'],
  },
  {
    id: 'job-9',
    title: 'API Engineer',
    company: 'DataDock',
    location: 'Karachi, PK',
    type: 'Full-time',
    salary: '$2,500–$4,000/mo',
    description: 'Build robust API endpoints, observability, and secure auth flows. Comfortable with CI and testing.',
    tags: ['REST', 'Security', 'CI', 'Node.js', 'Observability'],
  },
  {
    id: 'job-10',
    title: 'Frontend Engineer (Next.js)',
    company: 'WaveHire',
    location: 'Remote',
    type: 'Remote',
    salary: null,
    description: 'Work on a job-seeker platform. Build fast pages, reusable UI, and accessible flows.',
    tags: ['React', 'Next.js', 'Accessibility', 'SEO', 'UI'],
  },
  {
    id: 'job-11',
    title: 'QA Automation (Web)',
    company: 'SureShip',
    location: 'Islamabad, PK',
    type: 'Full-time',
    salary: null,
    description: 'Automate testing for critical user journeys. Partner with developers to improve reliability and tooling.',
    tags: ['Playwright', 'Testing', 'CI', 'JavaScript', 'Quality'],
  },
  {
    id: 'job-12',
    title: 'Data Analyst (Entry)',
    company: 'Insightly',
    location: 'Lahore, PK',
    type: 'Full-time',
    salary: null,
    description: 'Support reporting, dashboards, and insights. Comfortable with spreadsheets and basic SQL.',
    tags: ['SQL', 'Dashboards', 'Analytics', 'Excel', 'Reporting'],
  },
]

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M16.3 16.3 21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none" aria-hidden="true">
      <path
        d="M12 22s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

