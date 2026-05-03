import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/auth', label: 'Auth' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/resume-builder', label: 'Resume Builder' },
  { to: '/cover-letter', label: 'Cover Letter' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/tracker', label: 'Tracker' },
  { to: '/interview', label: 'Interview' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/profile', label: 'Profile' },
]

export function Navbar() {
  return (
    <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-3">
          <div className="text-sm font-semibold tracking-wide text-white">HireMate AI</div>
          <div className="hidden text-xs text-slate-400 sm:block">MERN starter</div>
        </div>
        <nav className="hidden items-center gap-1 text-sm text-slate-300 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                [
                  'rounded-md px-2 py-1 transition hover:bg-white/5 hover:text-white',
                  isActive ? 'bg-white/10 text-white' : '',
                ].join(' ')
              }
              end={l.to === '/'}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
