import { Request, Response, NextFunction } from 'express'
import { register, Counter, Histogram, Gauge } from 'prom-client'
import { logger } from '../utils/logger'

// Initialize metrics
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
})

const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
})

const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
})

// Middleware to collect metrics
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  
  // Track active connections
  activeConnections.inc()
  
  // Track response time and status on response finish
  res.on('finish', () => {
    const duration = Date.now() - start
    const route = req.route?.path || req.path
    const statusCode = res.statusCode.toString()
    
    httpRequestDuration.observe(
      { method: req.method, route, status_code: statusCode },
      duration / 1000
    )
    
    httpRequestTotal.inc({
      method: req.method,
      route,
      status_code: statusCode
    })
    
    activeConnections.dec()
  })
  
  next()
}

// Metrics endpoint for Prometheus scraping
export async function metricsEndpoint(req: Request, res: Response) {
  try {
    res.set('Content-Type', register.contentType)
    res.end(await register.metrics())
  } catch (error) {
    logger.error('Failed to generate metrics:', error)
    res.status(500).end()
  }
}