import { register, Counter, Histogram, Gauge } from 'prom-client'
import { logger } from '../../utils/logger'

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

export function recordMetrics(method: string, route: string, statusCode: number, duration: number) {
  httpRequestDuration.observe(
    { method, route, status_code: statusCode.toString() },
    duration
  )
  httpRequestTotal.inc({
    method,
    route,
    status_code: statusCode.toString()
  })
}

export async function getMetrics() {
  try {
    return await register.metrics()
  } catch (error) {
    logger.error('Failed to generate metrics:', error)
    throw error
  }
}