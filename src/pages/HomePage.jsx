import { StatusBadge } from '../components/StatusBadge'
import { useApiHealth } from '../hooks/useApiHealth'

export function HomePage() {
  const { data, error, loading } = useApiHealth()
  const mongo = data && typeof data === 'object' ? data.mongo : undefined

  const apiOk = Boolean(data && typeof data === 'object' && data.ok === true)
  const mongoOk = mongo === 'connected'

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/10 to-cyan-500/10 p-6 shadow-xl shadow-black/25 sm:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
        </div>

        <div className="relative">
          <p className="text-sm font-semibold text-indigo-200/90">HireMate AI</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Get Hired Faster with AI
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200/85">
            Build ATS-friendly resumes, generate cover letters, and apply to jobs in seconds
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 hover:bg-slate-100">
              Get Started Free
            </button>
            <button className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 hover:bg-white/10">
              Try Demo
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-slate-200/75">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">No credit card required</div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">ATS optimized</div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Built for speed</div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-300">Features</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Everything you need to land interviews
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="AI Resume Builder"
            body="Create clean, ATS-friendly resumes with sections that recruiters expect."
            icon={<SparklesIcon />}
          />
          <FeatureCard
            title="Cover Letter Generator"
            body="Generate tailored letters in your tone, with role-specific highlights."
            icon={<DocumentIcon />}
          />
          <FeatureCard
            title="Job Auto Apply"
            body="Save time applying—reuse profiles, answers, and resume versions."
            icon={<LightningIcon />}
          />
          <FeatureCard
            title="Interview Prep AI"
            body="Practice with question sets, coaching prompts, and feedback notes."
            icon={<ChatIcon />}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 sm:p-10">
        <p className="text-sm font-semibold text-indigo-300">How it works</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">From resume to offer</h2>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <StepCard step="01" title="Create Resume" body="Build a strong resume with templates and AI suggestions." />
          <StepCard step="02" title="Apply with AI" body="Generate cover letters and keep applications organized." />
          <StepCard step="03" title="Get Hired" body="Prepare for interviews with targeted practice and notes." />
        </div>
      </section>

      <section>
        <p className="text-sm font-semibold text-indigo-300">Testimonials</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Loved by job seekers
        </h2>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <TestimonialCard quote="Mujhe 2 weeks mein job mil gayi!" name="Ali" location="Lahore" />
          <TestimonialCard quote="Resume AI feature is amazing" name="Sara" location="Karachi" />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-white">System status</div>
            <div className="mt-1 text-sm text-slate-300">
              This app checks <code className="rounded bg-black/20 px-1 py-0.5">/api/health</code> in the background.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge
              loading={loading}
              ok={apiOk && !error}
              label={loading ? 'Checking API…' : error ? 'API unreachable' : 'API healthy'}
            />
            <StatusBadge
              loading={loading}
              ok={mongoOk}
              label={
                loading
                  ? 'Checking Mongo…'
                  : mongo
                    ? `Mongo: ${mongo}`
                    : error
                      ? 'Mongo: unknown'
                      : 'Mongo: unknown'
              }
            />
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            <div className="font-semibold">Could not reach the API</div>
            <div className="mt-1 text-rose-100/80">
              Start the backend (<code className="rounded bg-black/20 px-1 py-0.5">npm run dev</code>) and ensure MongoDB
              is running, then refresh.
            </div>
            <div className="mt-2 text-xs text-rose-100/70">{error.message}</div>
          </div>
        ) : null}

        {!loading && apiOk ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200">
            <div className="font-semibold text-white">Health payload</div>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs text-slate-200">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        ) : null}
      </section>
    </div>
  )
}

function FeatureCard({ title, body, icon }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 transition hover:border-white/15 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
          {icon}
        </div>
      </div>
      <div className="mt-4 text-sm font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{body}</p>
    </div>
  )
}

function StepCard({ step, title, body }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 shadow-lg shadow-black/20">
      <div className="text-xs font-semibold tracking-wide text-indigo-300">{step}</div>
      <div className="mt-2 text-lg font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{body}</p>
    </div>
  )
}

function TestimonialCard({ quote, name, location }) {
  return (
    <figure className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
      <blockquote className="text-sm leading-relaxed text-slate-200">“{quote}”</blockquote>
      <figcaption className="mt-4 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-white">
          {name} <span className="text-slate-400">· {location}</span>
        </div>
        <div className="text-xs font-semibold text-indigo-300">Verified</div>
      </figcaption>
    </figure>
  )
}

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-200" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.2 4.2L17.4 8 13.2 9.2 12 13.4 10.8 9.2 6.6 8l4.2-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M19 12l.8 2.7 2.7.8-2.7.8L19 19l-.8-2.7-2.7-.8 2.7-.8L19 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M5 13l.7 2.3 2.3.7-2.3.7L5 19l-.7-2.3-2.3-.7 2.3-.7L5 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-fuchsia-200" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l3 3v15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 3v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 11h8M8 15h8M8 19h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function LightningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-200" fill="none" aria-hidden="true">
      <path
        d="M13 2L3 14h7l-1 8 12-14h-7l-1-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-200" fill="none" aria-hidden="true">
      <path
        d="M7 18l-3 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 8h8M8 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
