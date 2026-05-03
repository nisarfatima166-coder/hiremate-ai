import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/index.js'
import { env } from './config/env.js'
import { notFound } from './middleware/notFound.middleware.js'
import { errorHandler } from './middleware/error.middleware.js'

const app = express()

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/', (req, res) => {
  res.json({
    ok: true,
    name: 'HireMate AI API',
    hint: 'Try GET /api/health',
  })
})

app.use('/api', apiRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
