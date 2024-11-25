import { Request, Response, NextFunction } from 'express'
import { redis } from '../../lib/redis'
import { ApiError } from '../../utils/errors'
import { logger } from '../../utils/logger'

const API_KEY_PREFIX = 'api_key:'
const RATE_LIMIT_PREFIX = 'rate_limit:'

interface ApiKeyConfig {
  name: string
  permissions: string[]
  rateLimit: {
    requests: number
    window: number // in seconds
  }
}

export async function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string

  if (!apiKey) {
    throw new ApiError('API key required', 401)
  }

  try {
    // Get API key config
    const config = await redis.get(`${API_KEY_PREFIX}${apiKey}`)
    if (!config) {
      throw new ApiError('Invalid API key', 401)
    }

    const keyConfig: ApiKeyConfig = JSON.parse(config)

    // Check rate limit
    const rateLimitKey = `${RATE_LIMIT_PREFIX}${apiKey}`
    const requests = await redis.incr(rateLimitKey)
    
    if (requests === 1) {
      await redis.expire(rateLimitKey, keyConfig.rateLimit.window)
    }

    if (requests > keyConfig.rateLimit.requests) {
      throw new ApiError('Rate limit exceeded', 429)
    }

    // Add API key info to request
    req.apiKey = {
      name: keyConfig.name,
      permissions: keyConfig.permissions
    }

    next()
  } catch (error) {
    logger.error('API key validation error:', error)
    next(error)
  }
}

export async function createApiKey(config: ApiKeyConfig): Promise<string> {
  const apiKey = crypto.randomBytes(32).toString('hex')
  await redis.set(
    `${API_KEY_PREFIX}${apiKey}`,
    JSON.stringify(config),
    'EX',
    30 * 24 * 60 * 60 // 30 days
  )
  return apiKey
}

export async function revokeApiKey(apiKey: string): Promise<void> {
  await redis.del(`${API_KEY_PREFIX}${apiKey}`)
}