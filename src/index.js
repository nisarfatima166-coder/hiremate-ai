import 'dotenv/config'
import app from './app.js'
import { env } from './config/env.js'
import { connectDatabase } from './config/database.js'

async function start() {
  try {
    await connectDatabase(env.mongoUri)
    console.log('MongoDB connected')

    app.listen(env.port, () => {
      console.log(`API listening on http://localhost:${env.port}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
