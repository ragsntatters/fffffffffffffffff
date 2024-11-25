import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { redis } from '../lib/redis'
import { config } from '../config'

// General API rate limiter
export const apiLimiter = rateLimit({
  store: new RedisStore({
    prefix: 'rate_limit:api:',
    client: redis,
    sendCommand: (...args: string[]) => redis.sendCommand(args)
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: {
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }
})

// Auth endpoints rate limiter
export const authLimiter = rateLimit({
  store: new RedisStore({
    prefix: 'rate_limit:auth:',
    client: redis,
    sendCommand: (...args: string[]) => redis.sendCommand(args)
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: {
      message: 'Too many login attempts, please try again later',
      code: 'AUTH_RATE_LIMIT_EXCEEDED'
    }
  }
})

// Webhook endpoints rate limiter
export const webhookLimiter = rateLimit({
  store: new RedisStore({
    prefix: 'rate_limit:webhook:',
    client: redis,
    sendCommand: (...args: string[]) => redis.sendCommand(args)
  }),
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per windowMs
  message: {
    error: {
      message: 'Too many webhook requests, please try again later',
      code: 'WEBHOOK_RATE_LIMIT_EXCEEDED'
    }
  }
})