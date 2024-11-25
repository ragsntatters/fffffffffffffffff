import { prisma } from '../prisma'
import { 
  locationCache, 
  reviewCache, 
  postCache, 
  keywordCache 
} from './index'
import { cacheKeys } from './keys'
import { logger } from '../../utils/logger'

const CACHE_TTL = 3600 // 1 hour

export async function warmupCache() {
  try {
    logger.info('Starting cache warmup...')

    // Warm up locations
    const locations = await prisma.location.findMany({
      take: 100,
      orderBy: { updatedAt: 'desc' }
    })

    await Promise.all(
      locations.map(location =>
        locationCache.set(
          cacheKeys.location.detail(location.id),
          location,
          CACHE_TTL
        )
      )
    )

    // Warm up recent reviews
    const reviews = await prisma.review.findMany({
      take: 100,
      orderBy: { publishedAt: 'desc' },
      include: {
        response: true,
        sentiment: true
      }
    })

    await Promise.all(
      reviews.map(review =>
        reviewCache.set(
          cacheKeys.review.detail(review.id),
          review,
          CACHE_TTL
        )
      )
    )

    // Warm up recent posts
    const posts = await prisma.post.findMany({
      take: 100,
      orderBy: { publishedAt: 'desc' },
      where: { status: 'published' },
      include: {
        media: true,
        metrics: true
      }
    })

    await Promise.all(
      posts.map(post =>
        postCache.set(
          cacheKeys.post.detail(post.id),
          post,
          CACHE_TTL
        )
      )
    )

    // Warm up keyword rankings
    const keywords = await prisma.keyword.findMany({
      take: 100,
      include: {
        rankings: {
          orderBy: { date: 'desc' },
          take: 1
        }
      }
    })

    await Promise.all(
      keywords.map(keyword =>
        keywordCache.set(
          cacheKeys.keyword.detail(keyword.id),
          keyword,
          CACHE_TTL
        )
      )
    )

    logger.info('Cache warmup completed successfully')
  } catch (error) {
    logger.error('Cache warmup failed:', error)
    throw error
  }
}