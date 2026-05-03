import { Router } from 'express'
import { getMe, listUsers } from '../controllers/users.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)
router.get('/me', getMe)
router.get('/', listUsers)

export default router
