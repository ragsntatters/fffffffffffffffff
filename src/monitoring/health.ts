import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { redis } from '../lib/redis'
import { logger } from '../utils/logger'

interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  services: {
    database: {
      status: 'up' | 'down'
      latency?: number
    }
    redis: {
      status: 'up' | 'down'
      latency?: number
    }
    api: {
      status: 'up' | 'down'
      uptime: number
      memory: {
        used: number
        total: number
      }
    }
  }
}

async function checkDatabase(): Promise<{ status: 'up' | 'down'; latency?: number }> {
  const start = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'up', latency: Date.now() - start }
  } catch (error) {
    logger.error('Database health check failed:', error)
    return { status: 'down' }
  }
}

async function checkRedis(): Promise<{ status: 'up' | 'down'; latency?: number }> {
  const start = Date.now()
  try {
    await redis.ping()
    return { status: 'up', latency: Date.now() - start }
  } catch (error) {
    logger.error('Redis health check failed:', error)
    return { status: 'down' }
  }
}

export async function healthCheck(req: Request, res: Response) {
  const [dbStatus, redisStatus] = await Promise.all([
    checkDatabase(),
    checkRedis()
  ])

  const status: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      redis: redisStatus,
      api: {
        status: 'up',
        uptime: process.uptime(),
        memory: {
          used: process.memoryUsage().heapUsed,
          total: process.memoryUsage().heapTotal
        }
      }
    }
  }

  // Check if any service is down
  if (dbStatus.status === 'down' || redisStatus.status === 'down') {
    status.status = 'unhealthy'
    res.status(503)
  }

  res.json(status)
}