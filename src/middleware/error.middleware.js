export function errorHandler(err, req, res, next) {
  const status = typeof err.status === 'number' ? err.status : 500
  const message = err.message || 'Internal Server Error'

  if (status >= 500) {
    console.error(err)
  }

  res.status(status).json({ ok: false, message })
}
