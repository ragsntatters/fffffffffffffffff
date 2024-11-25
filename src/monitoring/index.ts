import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { healthCheck } from './health'
import { metricsMiddleware, metricsEndpoint } from './metrics'
import { config } from '../config'

const router = Router()

// Apply metrics middleware to all routes
if (config.env === 'production') {
  router.use(metricsMiddleware)
}

// Health check endpoint - public
router.get('/health', healthCheck)

// Metrics endpoint - protected
router.get('/metrics', authenticate, authorize('admin'), metricsEndpoint)

export default router