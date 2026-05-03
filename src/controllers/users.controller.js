import { User } from '../models/User.model.js'

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(50).lean()
    res.json({ ok: true, data: users })
  } catch (err) {
    next(err)
  }
}

export async function getMe(req, res, next) {
  try {
    const id = req.user?.id
    if (!id) {
      const err = new Error('Unauthorized')
      err.status = 401
      throw err
    }

    const user = await User.findById(id).lean()
    if (!user) {
      const err = new Error('User not found')
      err.status = 404
      throw err
    }

    res.json({
      ok: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    next(err)
  }
}
