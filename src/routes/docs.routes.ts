import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '../lib/docs/swagger'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Serve API documentation UI
router.use(
  '/docs',
  authenticate,
  authorize('admin'),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }'
  })
)

// Serve OpenAPI specification
router.get('/docs.json', authenticate, authorize('admin'), (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

export default router