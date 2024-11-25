import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import {
  getLocationAnalytics,
  generateAnalytics
} from '../controllers/analytics.controller'

const router = Router()

router.use(authenticate)

router.get(
  '/locations/:locationId',
  getLocationAnalytics
)

router.post(
  '/locations/:locationId/generate',
  authorize('admin'),
  generateAnalytics
)

export default router