import { Job } from 'bull'
import { socialPostQueue } from '../lib/queue'
import { publishToSocialMedia } from '../lib/social'
import { sendNotification } from '../lib/notifications'
import { logger } from '../utils/logger'

interface SocialPostJobData {
  postId: string
  locationId: string
  userId: string
}

export function startSocialPostWorker() {
  socialPostQueue.process(async (job: Job<SocialPostJobData>) => {
    const { postId, locationId, userId } = job.data
    logger.info(`Processing social post job ${job.id} for post ${postId}`)

    try {
      const [post, location] = await Promise.all([
        prisma.post.findUnique({ where: { id: postId } }),
        prisma.location.findUnique({ where: { id: locationId } })
      ])

      if (!post || !location) {
        throw new Error('Post or location not found')
      }

      const results = await publishToSocialMedia(post, location)
      const failed = results.filter(r => !r.success)

      if (failed.length === results.length) {
        throw new Error('Failed to publish to any platform')
      }

      // Update post status
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: 'published',
          publishedAt: new Date(),
          metadata: {
            publishResults: results
          }
        }
      })

      // Create metrics records for successful posts
      const successfulPosts = results.filter(r => r.success)
      await prisma.postMetrics.createMany({
        data: successfulPosts.map(result => ({
          postId,
          platform: result.platform,
          date: new Date(),
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0
        }))
      })

      // Notify about partial failures
      if (failed.length > 0) {
        await sendNotification(userId, 'post_publish_partial', {
          postId,
          locationName: location.name,
          failedPlatforms: failed.map(f => f.platform)
        })
      }

      logger.info(`Social post ${postId} published successfully`)
    } catch (error) {
      logger.error(`Failed to publish post ${postId}:`, error)
      throw error
    }
  })
}