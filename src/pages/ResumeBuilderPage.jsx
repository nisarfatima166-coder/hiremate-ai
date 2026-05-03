import { useMemo, useState } from 'react'
import { exportElementToPdf } from '../lib/pdfExport'
import { generateResumeSummary } from '../lib/resumeSummary'

export function ResumeBuilderPage() {
  const [fullName, setFullName] = useState('Nisar')
  const [email, setEmail] = useState('nisar@example.com')
  const [phone, setPhone] = useState('+92 300 0000000')
  const [education, setEducation] = useState('BS Computer Science — University Name (2019–2023)')
  const [experience, setExperience] = useState(
    'Frontend Developer — Company Name (2024–Present)\n- Built responsive dashboards using React + Tailwind\n- Integrated REST APIs and improved performance\n',
  )
  const [skills, setSkills] = useState('React, Tailwind CSS, JavaScript, Node.js, MongoDB')
  const [projects, setProjects] = useState('HireMate AI — Resume builder + job tracker (MERN)')
  const [summary, setSummary] = useState(
    'Results-driven developer focused on building fast, accessible web apps. Strong in React, UI systems, and API integration.',
  )
  const [generating, setGenerating] = useState(false)
  const [exporting, setExporting] = useState(false)

  const parsedSkills = useMemo(
    () =>
      skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [skills],
  )

  const preview = useMemo(
    () => ({
      fullName: fullName.trim() || 'Your Name',
      email: email.trim(),
      phone: phone.trim(),
      summary: summary.trim(),
      experience: experience.trim(),
      education: education.trim(),
      skills: parsedSkills,
      projects: projects.trim(),
    }),
    [education, email, experience, fullName, parsedSkills, phone, projects, summary],
  )

  async function handleGenerateSummary() {
    if (generating) return
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 600))

    setSummary(
      generateResumeSummary({
        experience,
        skills: parsedSkills,
      }),
    )
    setGenerating(false)
  }

  async function handleDownloadPdf() {
    if (exporting) return
    setExporting(true)
    try {
      const el = document.getElementById('resume-preview')
      await exportElementToPdf(el, { filename: `${preview.fullName}_Resume` })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between print:hidden">
        <div>
          <p className="text-sm font-semibold text-indigo-300">Resume Builder</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Build a standout resume</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Fill the form on the left and see a live preview on the right.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGenerateSummary}
            disabled={generating}
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {generating ? 'Generating…' : 'Generate Summary with AI'}
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={exporting}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 shadow-md shadow-black/10 hover:bg-white/10"
          >
            {exporting ? 'Exporting…' : 'Download as PDF'}
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 print:grid-cols-1">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 print:hidden sm:p-6">
          <div className="grid gap-4">
            <Field label="Full Name">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
                />
              </Field>
              <Field label="Phone">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 3xx xxxxxxx"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
                />
              </Field>
            </div>

            <Field label="Education">
              <textarea
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                rows={4}
                placeholder="Your education background"
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>

            <Field label="Experience">
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                rows={7}
                placeholder="Your work experience (use bullet points)"
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="text-xs text-slate-400">Tip: start lines with “- ” to create bullets.</div>
            </Field>

            <Field label="Skills (comma separated)">
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Tailwind, Node.js"
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>

            <Field label="Projects (optional)">
              <textarea
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                rows={3}
                placeholder="Optional projects"
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>
          </div>
        </section>

        <section className="lg:sticky lg:top-6 print:static">
          <div
            id="resume-preview"
            className={[
              'rounded-2xl border border-white/10 bg-white p-6 text-slate-900 shadow-xl shadow-black/20',
              'print:rounded-none print:border-0 print:shadow-none print:p-0',
            ].join(' ')}
          >
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold tracking-tight">{preview.fullName}</div>
              <div className="text-sm text-slate-600">
                {[preview.email, preview.phone].filter(Boolean).join(' • ')}
              </div>
            </div>

            <Divider />

            <ResumeSection title="Summary">
              <p className="text-sm leading-relaxed text-slate-700">{preview.summary || 'Add a short summary…'}</p>
            </ResumeSection>

            <ResumeSection title="Experience">
              {preview.experience ? (
                <RichText text={preview.experience} />
              ) : (
                <p className="text-sm text-slate-600">Add your experience…</p>
              )}
            </ResumeSection>

            <ResumeSection title="Education">
              {preview.education ? (
                <RichText text={preview.education} />
              ) : (
                <p className="text-sm text-slate-600">Add your education…</p>
              )}
            </ResumeSection>

            <ResumeSection title="Skills">
              {preview.skills.length ? (
                <div className="flex flex-wrap gap-2">
                  {preview.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">Add skills…</p>
              )}
            </ResumeSection>

            {preview.projects ? (
              <>
                <ResumeSection title="Projects">
                  <RichText text={preview.projects} />
                </ResumeSection>
              </>
            ) : null}
          </div>
        </section>
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

function ResumeSection({ title, children }) {
  return (
    <section className="mt-5">
      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-2">{children}</div>
    </section>
  )
}

function Divider() {
  return <div className="my-5 h-px w-full bg-slate-200" />
}

function RichText({ text }) {
  const lines = text.split('\n').map((l) => l.trimEnd())
  const hasBullets = lines.some((l) => l.trim().startsWith('- '))

  if (hasBullets) {
    const items = lines
      .filter((l) => l.trim().startsWith('- '))
      .map((l) => l.trim().replace(/^- /, ''))
      .filter(Boolean)

    const nonBullet = lines.filter((l) => l.trim() && !l.trim().startsWith('- '))

    return (
      <div className="space-y-2">
        {nonBullet.length ? <p className="text-sm text-slate-700">{nonBullet.join(' ')}</p> : null}
        {items.length ? (
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {items.map((it, idx) => (
              <li key={`${it}-${idx}`}>{it}</li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }

  return <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{text}</p>
}

