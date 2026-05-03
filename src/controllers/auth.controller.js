import { User } from '../models/User.model.js'
import { hashPassword, signToken, verifyPassword } from '../lib/auth.js'

function httpError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body ?? {}

    const n = typeof name === 'string' ? name.trim() : ''
    const e = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const p = typeof password === 'string' ? password : ''

    if (!n) throw httpError(400, 'Name is required')
    if (!e) throw httpError(400, 'Email is required')
    if (!p || p.length < 6) throw httpError(400, 'Password must be at least 6 characters')

    const existing = await User.findOne({ email: e }).select('_id').lean()
    if (existing) throw httpError(409, 'Email already in use')

    const passwordHash = await hashPassword(p)
    const user = await User.create({ name: n, email: e, passwordHash })

    const token = signToken({ sub: user._id.toString() })
    res.status(201).json({ ok: true, token, user: sanitizeUser(user) })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {}
    const e = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const p = typeof password === 'string' ? password : ''

    if (!e) throw httpError(400, 'Email is required')
    if (!p) throw httpError(400, 'Password is required')

    const user = await User.findOne({ email: e }).select('+passwordHash name email role').exec()
    if (!user) throw httpError(401, 'Invalid email or password')

    const ok = await verifyPassword(p, user.passwordHash)
    if (!ok) throw httpError(401, 'Invalid email or password')

    const token = signToken({ sub: user._id.toString() })
    res.json({ ok: true, token, user: sanitizeUser(user) })
  } catch (err) {
    next(err)
  }
}

