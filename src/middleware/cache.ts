import { Request, Response, NextFunction } from 'express'
import { Cache, CacheOptions } from '../lib/cache'
import { logger } from '../utils/logger'

export function cacheMiddleware(
  cache: Cache,
  keyFn: (req: Request) => string,
  options: CacheOptions = {}
) {
  const { ttl, invalidateOnUpdate = true } = options

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests if invalidateOnUpdate is true
    if (invalidateOnUpdate && req.method !== 'GET') {
      // Invalidate cache on POST, PUT, PATCH, DELETE
      const cacheKey = keyFn(req)
      await cache.invalidatePattern(cacheKey)
      return next()
    }

    const cacheKey = keyFn(req)

    try {
      // Try to get from cache
      const cachedData = await cache.get(cacheKey)
      if (cachedData) {
        return res.json(cachedData)
      }

      // Store original json method
      const originalJson = res.json.bind(res)

      // Override json method to cache the response
      res.json = ((data: any) => {
        cache.set(cacheKey, data, ttl).catch(error => {
          logger.error('Failed to cache response:', error)
        })
        return originalJson(data)
      }) as any

      next()
    } catch (error) {
      logger.error('Cache middleware error:', error)
      next()
    }
  }
}