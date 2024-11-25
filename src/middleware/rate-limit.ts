import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { redis } from '../lib/redis'
import { ApiError } from '../lib/errors/api-error'

// General API rate limiter
export const apiLimiter = rateLimit({
  store: new RedisStore({
    prefix: 'rate_limit:api:',
    client: redis
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    throw new ApiError('Too many requests', 429)
  }
})

// Auth endpoints rate limiter
export const authLimiter = rateLimit({
  store: new RedisStore({
    prefix: 'rate_limit:auth:',
    client: redis
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  handler: (req, res) => {
    throw new ApiError('Too many login attempts', 429)
  }
})

// Webhook endpoints rate limiter
export const webhookLimiter = rateLimit({
  store: new RedisStore({
    prefix: 'rate_limit:webhook:',
    client: redis
  }),
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per windowMs
  handler: (req, res) => {
    throw new ApiError('Too many webhook requests', 429)
  }
})