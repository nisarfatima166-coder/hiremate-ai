import { Router } from 'express'
import healthRoutes from './health.routes.js'
import usersRoutes from './users.routes.js'
import authRoutes from './auth.routes.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    ok: true,
    name: 'HireMate AI API',
    routes: ['/api/health', '/api/auth', '/api/users'],
  })
})

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/users', usersRoutes)

export default router
