import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, signup } from '../lib/api'
import { getToken, setToken } from '../lib/authToken'

export function AuthPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login') // login | signup
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const token = getToken()
    if (token) navigate('/dashboard', { replace: true })
  }, [navigate])

  const submitLabel = tab === 'signup' ? 'Create account' : 'Sign in'

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password) return false
    if (tab === 'signup' && !name.trim()) return false
    return true
  }, [email, name, password, tab])

  async function onSubmit(e) {
    e.preventDefault()
    if (!canSubmit || loading) return
    setError('')
    setLoading(true)
    try {
      const payload =
        tab === 'signup'
          ? await signup({ name: name.trim(), email: email.trim(), password })
          : await login({ email: email.trim(), password })

      if (!payload || typeof payload !== 'object' || !payload.token) {
        throw new Error('Unexpected response from server')
      }
      setToken(payload.token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message ? String(err.message) : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 shadow-xl shadow-black/30 sm:p-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-indigo-300">HireMate AI</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-300">Sign in to continue, or create a new account.</p>
          </div>

          <div className="mt-6 grid grid-cols-2 rounded-2xl border border-white/10 bg-slate-950/30 p-1">
            <TabButton active={tab === 'login'} onClick={() => setTab('login')}>
              Login
            </TabButton>
            <TabButton active={tab === 'signup'} onClick={() => setTab('signup')}>
              Signup
            </TabButton>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {tab === 'signup' ? (
              <Field label="Name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
                />
              </Field>
            ) : null}

            <Field label="Email">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
              />
              {tab === 'signup' ? (
                <div className="text-xs text-slate-400">Minimum 6 characters.</div>
              ) : null}
            </Field>

            {error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Please wait…' : submitLabel}
            </button>

            <div className="text-center text-xs text-slate-400">
              {tab === 'login' ? 'New here?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setError('')
                  setTab(tab === 'login' ? 'signup' : 'login')
                }}
                className="font-semibold text-indigo-300 hover:text-indigo-200"
              >
                {tab === 'login' ? 'Create account' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-xl px-3 py-2 text-sm font-semibold transition',
        active ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
      ].join(' ')}
    >
      {children}
    </button>
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

