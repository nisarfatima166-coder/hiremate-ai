import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter', 'admin'],
      default: 'candidate',
    },
  },
  { timestamps: true },
)

userSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.passwordHash
    return ret
  },
})

export const User = mongoose.models.User || mongoose.model('User', userSchema)
