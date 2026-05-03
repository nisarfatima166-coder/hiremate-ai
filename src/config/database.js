import mongoose from 'mongoose'

export async function connectDatabase(mongoUri) {
  mongoose.set('strictQuery', true)

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected')
  })

  await mongoose.connect(mongoUri)
}
