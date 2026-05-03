function requiredEnv(name, fallback) {
  const value = process.env[name]
  if (value && value.trim()) return value
  if (fallback !== undefined) return fallback
  throw new Error(`Missing required environment variable: ${name}`)
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: requiredEnv('MONGODB_URI', 'mongodb://127.0.0.1:27017/hiremate-ai'),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  jwtSecret: requiredEnv('JWT_SECRET', 'dev-insecure-secret'),
}
