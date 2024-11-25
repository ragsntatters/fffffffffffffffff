import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { getHealthStatus } from '../lib/monitoring/health'
import { getMetrics } from '../lib/monitoring/prometheus'
import { logger } from '../utils/logger'

const router = Router()

// Health check endpoint - public
router.get('/health', async (req, res) => {
  try {
    const status = await getHealthStatus()
    res.status(status.status === 'healthy' ? 200 : 503).json(status)
  } catch (error) {
    logger.error('Health check failed:', error)
    res.status(500).json({
      status: 'unhealthy',
      error: 'Failed to check health status'
    })
  }
})

// Metrics endpoint - protected
router.get('/metrics', authenticate, authorize('admin'), async (req, res) => {
  try {
    const metrics = await getMetrics()
    res.set('Content-Type', 'text/plain')
    res.send(metrics)
  } catch (error) {
    logger.error('Failed to get metrics:', error)
    res.status(500).send('Failed to generate metrics')
  }
})

export default router