import { redis } from '../redis'
import { logger } from '../../utils/logger'
import { config } from '../../config'

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string
  invalidateOnUpdate?: boolean
}

const DEFAULT_TTL = 3600 // 1 hour

export class Cache {
  constructor(private prefix: string = '') {}

  private getKey(key: string): string {
    return `${config.env}:${this.prefix}:${key}`
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(this.getKey(key))
      return data ? JSON.parse(data) : null
    } catch (error) {
      logger.error('Cache get error:', error)
      return null
    }
  }

  async set(key: string, value: any, ttl: number = DEFAULT_TTL): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value)
      await redis.set(this.getKey(key), serializedValue, 'EX', ttl)
    } catch (error) {
      logger.error('Cache set error:', error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redis.del(this.getKey(key))
    } catch (error) {
      logger.error('Cache delete error:', error)
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(this.getKey(pattern))
      if (keys.length > 0) {
        await redis.del(keys)
      }
    } catch (error) {
      logger.error('Cache invalidate pattern error:', error)
    }
  }

  async remember<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached) {
      return cached
    }

    const fresh = await callback()
    await this.set(key, fresh, ttl)
    return fresh
  }
}

// Create cache instances for different domains
export const locationCache = new Cache('location')
export const reviewCache = new Cache('review')
export const postCache = new Cache('post')
export const keywordCache = new Cache('keyword')
export const userCache = new Cache('user')