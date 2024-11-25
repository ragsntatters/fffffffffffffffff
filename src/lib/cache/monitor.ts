import { redis } from '../redis'
import { logger } from '../../utils/logger'

export interface CacheStats {
  hitRate: number
  missRate: number
  keyCount: number
  memoryUsage: number
  uptime: number
}

export async function getCacheStats(): Promise<CacheStats> {
  try {
    const info = await redis.info()
    const memory = await redis.info('memory')
    const stats = await redis.info('stats')

    // Parse Redis INFO output
    const parseInfo = (str: string) => {
      const lines = str.split('\r\n')
      const result: Record<string, string> = {}
      lines.forEach(line => {
        const [key, value] = line.split(':')
        if (key && value) {
          result[key] = value
        }
      })
      return result
    }

    const memoryInfo = parseInfo(memory)
    const statsInfo = parseInfo(stats)
    const serverInfo = parseInfo(info)

    const hits = parseInt(statsInfo.keyspace_hits || '0')
    const misses = parseInt(statsInfo.keyspace_misses || '0')
    const total = hits + misses

    return {
      hitRate: total > 0 ? (hits / total) * 100 : 0,
      missRate: total > 0 ? (misses / total) * 100 : 0,
      keyCount: parseInt(statsInfo.total_keys || '0'),
      memoryUsage: parseInt(memoryInfo.used_memory || '0'),
      uptime: parseInt(serverInfo.uptime_in_seconds || '0')
    }
  } catch (error) {
    logger.error('Failed to get cache stats:', error)
    throw error
  }
}

export async function clearCache(pattern?: string): Promise<number> {
  try {
    if (pattern) {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(keys)
        return keys.length
      }
      return 0
    }

    await redis.flushdb()
    return -1 // Indicates full flush
  } catch (error) {
    logger.error('Failed to clear cache:', error)
    throw error
  }
}