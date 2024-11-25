import { Cache } from './index'
import { cacheKeys } from './keys'
import { logger } from '../../utils/logger'

export async function invalidateLocationCache(locationId: string, cache: Cache) {
  try {
    await Promise.all([
      cache.delete(cacheKeys.location.detail(locationId)),
      cache.invalidatePattern(cacheKeys.location.list('*')),
      cache.invalidatePattern(cacheKeys.location.reviews(locationId, '*')),
      cache.invalidatePattern(cacheKeys.location.posts(locationId, '*')),
      cache.delete(cacheKeys.location.metrics(locationId))
    ])
  } catch (error) {
    logger.error('Failed to invalidate location cache:', error)
  }
}

export async function invalidateReviewCache(reviewId: string, locationId: string, cache: Cache) {
  try {
    await Promise.all([
      cache.delete(cacheKeys.review.detail(reviewId)),
      cache.invalidatePattern(cacheKeys.review.list(locationId, '*')),
      cache.delete(cacheKeys.review.metrics(locationId)),
      cache.delete(cacheKeys.location.metrics(locationId))
    ])
  } catch (error) {
    logger.error('Failed to invalidate review cache:', error)
  }
}

export async function invalidatePostCache(postId: string, locationId: string, cache: Cache) {
  try {
    await Promise.all([
      cache.delete(cacheKeys.post.detail(postId)),
      cache.invalidatePattern(cacheKeys.post.list(locationId, '*')),
      cache.delete(cacheKeys.post.metrics(postId)),
      cache.delete(cacheKeys.location.metrics(locationId))
    ])
  } catch (error) {
    logger.error('Failed to invalidate post cache:', error)
  }
}

export async function invalidateKeywordCache(keywordId: string, locationId: string, cache: Cache) {
  try {
    await Promise.all([
      cache.delete(cacheKeys.keyword.detail(keywordId)),
      cache.invalidatePattern(cacheKeys.keyword.list(locationId, '*')),
      cache.delete(cacheKeys.keyword.rankings(keywordId)),
      cache.delete(cacheKeys.location.metrics(locationId))
    ])
  } catch (error) {
    logger.error('Failed to invalidate keyword cache:', error)
  }
}

export async function invalidateUserCache(userId: string, cache: Cache) {
  try {
    await Promise.all([
      cache.delete(cacheKeys.user.detail(userId)),
      cache.delete(cacheKeys.user.preferences(userId)),
      cache.delete(cacheKeys.user.permissions(userId))
    ])
  } catch (error) {
    logger.error('Failed to invalidate user cache:', error)
  }
}