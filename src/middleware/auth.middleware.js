import { verifyToken } from '../lib/auth.js'

function httpError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [type, token] = header.split(' ')
    if (type !== 'Bearer' || !token) throw httpError(401, 'Missing authorization token')

    const payload = verifyToken(token)
    if (!payload || typeof payload !== 'object' || !payload.sub) throw httpError(401, 'Invalid token')

    req.user = { id: String(payload.sub) }
    next()
  } catch (err) {
    const e = err instanceof Error ? err : new Error('Unauthorized')
    if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
      e.status = 401
      e.message = 'Invalid or expired token'
    }
    next(e)
  }
}

