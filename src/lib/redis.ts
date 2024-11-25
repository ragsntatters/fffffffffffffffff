import { createClient } from 'redis'
import { config } from '../config'
import { logger } from '../utils/logger'

export const redis = createClient({
  url: config.redis.url,
  password: config.redis.password
})

redis.on('error', (error) => {
  logger.error('Redis Client Error:', error)
})

redis.on('connect', () => {
  logger.info('Redis Client Connected')
})

export async function initRedis() {
  await redis.connect()
}