import { Cache } from '../../../lib/cache'
import { redis } from '../../../lib/redis'

describe('Cache', () => {
  let cache: Cache

  beforeEach(() => {
    cache = new Cache('test')
    jest.clearAllMocks()
  })

  afterEach(async () => {
    await redis.flushdb()
  })

  describe('get', () => {
    it('should return null for non-existent key', async () => {
      const result = await cache.get('nonexistent')
      expect(result).toBeNull()
    })

    it('should return cached value', async () => {
      const data = { test: 'value' }
      await cache.set('key', data)
      const result = await cache.get('key')
      expect(result).toEqual(data)
    })
  })

  describe('set', () => {
    it('should store value with TTL', async () => {
      await cache.set('key', 'value', 60)
      const ttl = await redis.ttl('test:key')
      expect(ttl).toBeGreaterThan(0)
      expect(ttl).toBeLessThanOrEqual(60)
    })
  })

  describe('delete', () => {
    it('should remove cached value', async () => {
      await cache.set('key', 'value')
      await cache.delete('key')
      const result = await cache.get('key')
      expect(result).toBeNull()
    })
  })

  describe('remember', () => {
    it('should return cached value if exists', async () => {
      const data = { test: 'value' }
      await cache.set('key', data)
      
      const callback = jest.fn()
      const result = await cache.remember('key', 60, callback)
      
      expect(result).toEqual(data)
      expect(callback).not.toHaveBeenCalled()
    })

    it('should call callback and cache result if no cached value', async () => {
      const data = { test: 'value' }
      const callback = jest.fn().mockResolvedValue(data)
      
      const result = await cache.remember('key', 60, callback)
      
      expect(result).toEqual(data)
      expect(callback).toHaveBeenCalled()
      
      const cached = await cache.get('key')
      expect(cached).toEqual(data)
    })
  })
})