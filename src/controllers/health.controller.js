import mongoose from 'mongoose'

function mongoStatus() {
  const readyState = mongoose.connection.readyState
  if (readyState === 1) return 'connected'
  if (readyState === 2) return 'connecting'
  if (readyState === 3) return 'disconnecting'
  return 'disconnected'
}

export function getHealth(req, res) {
  res.json({
    ok: true,
    service: 'hiremate-ai-api',
    mongo: mongoStatus(),
    uptime: process.uptime(),
  })
}
