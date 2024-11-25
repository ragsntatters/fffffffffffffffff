import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { serve, setup } from 'swagger-ui-express'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { config } from './server/config'
import { errorHandler } from './middleware/error'
import { setupQueueMonitor } from './lib/queue/monitor'
import { compressionMiddleware } from './middleware/compression'
import { securityHeaders } from './middleware/security/headers'

// Routes
import authRoutes from './routes/auth.routes'
import locationRoutes from './routes/location.routes'
import reviewRoutes from './routes/review.routes'
import postRoutes from './routes/post.routes'
import keywordRoutes from './routes/keyword.routes'
import teamRoutes from './routes/team.routes'
import reportRoutes from './routes/report.routes'
import analyticsRoutes from './routes/analytics.routes'
import billingRoutes from './routes/billing.routes'
import monitoringRoutes from './routes/monitoring.routes'

const app = express()

// Basic middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compressionMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// CORS configuration
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'x-api-key']
}))

// Security headers
app.use(securityHeaders)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/locations', locationRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/keywords', keywordRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/monitoring', monitoringRoutes)

// Queue monitor in development
if (config.env === 'development') {
  setupQueueMonitor(app)
}

// Error handling
app.use(errorHandler)

export default app