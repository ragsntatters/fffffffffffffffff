import { Request, Response, NextFunction } from 'express'
import { redis } from '../../lib/redis'
import { ApiError } from '../../utils/errors'
import { logger } from '../../utils/logger'

const BLOCKED_IP_PREFIX = 'blocked_ip:'
const SUSPICIOUS_IP_PREFIX = 'suspicious_ip:'
const MAX_FAILED_ATTEMPTS = 5
const BLOCK_DURATION = 24 * 60 * 60 // 24 hours

export async function checkIpBlocking(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip

  try {
    // Check if IP is blocked
    const isBlocked = await redis.get(`${BLOCKED_IP_PREFIX}${ip}`)
    if (isBlocked) {
      throw new ApiError('Access denied', 403)
    }

    next()
  } catch (error) {
    logger.error('IP blocking check error:', error)
    next(error)
  }
}

export async function trackFailedAttempt(ip: string): Promise<void> {
  const key = `${SUSPICIOUS_IP_PREFIX}${ip}`
  const attempts = await redis.incr(key)

  if (attempts === 1) {
    await redis.expire(key, BLOCK_DURATION)
  }

  if (attempts >= MAX_FAILED_ATTEMPTS) {
    await blockIp(ip)
  }
}

export async function blockIp(ip: string, duration: number = BLOCK_DURATION): Promise<void> {
  await redis.set(`${BLOCKED_IP_PREFIX}${ip}`, '1', 'EX', duration)
  logger.warn(`IP ${ip} has been blocked for ${duration} seconds`)
}

export async function unblockIp(ip: string): Promise<void> {
  await Promise.all([
    redis.del(`${BLOCKED_IP_PREFIX}${ip}`),
    redis.del(`${SUSPICIOUS_IP_PREFIX}${ip}`)
  ])
  logger.info(`IP ${ip} has been unblocked`)
}