import { Job } from 'bull'
import { keywordTrackingQueue } from '../lib/queue'
import { trackKeyword } from '../lib/keyword-tracking'
import { sendNotification } from '../lib/notifications'
import { logger } from '../utils/logger'

interface KeywordTrackingJobData {
  keywordId: string
  locationId: string
  userId: string
}

export function startKeywordTrackingWorker() {
  keywordTrackingQueue.process(async (job: Job<KeywordTrackingJobData>) => {
    const { keywordId, locationId, userId } = job.data
    logger.info(`Processing keyword tracking job ${job.id} for keyword ${keywordId}`)

    try {
      const [keyword, location] = await Promise.all([
        prisma.keyword.findUnique({ where: { id: keywordId } }),
        prisma.location.findUnique({ where: { id: locationId } })
      ])

      if (!keyword || !location) {
        throw new Error('Keyword or location not found')
      }

      const result = await trackKeyword(keyword, {
        latitude: location.latitude,
        longitude: location.longitude
      })

      // Store ranking results
      await prisma.ranking.create({
        data: {
          keywordId,
          rank: result.rank,
          avgAGR: result.avgAGR,
          ATGR: result.ATGR,
          SoLV: result.SoLV,
          date: new Date()
        }
      })

      // Store competitor rankings
      await prisma.competitorRanking.createMany({
        data: result.competitors.map(competitor => ({
          keywordId,
          placeId: competitor.placeId,
          name: competitor.name,
          rank: competitor.rank,
          date: new Date()
        }))
      })

      // Check if rank changed significantly
      const settings = await prisma.locationSettings.findUnique({
        where: { locationId }
      })

      if (settings?.rankingAlertThreshold) {
        const previousRanking = await prisma.ranking.findFirst({
          where: { keywordId },
          orderBy: { date: 'desc' },
          skip: 1
        })

        if (previousRanking && 
            Math.abs(result.rank - previousRanking.rank) >= settings.rankingAlertThreshold) {
          await sendNotification(userId, 'rank_change', {
            keyword: keyword.term,
            oldRank: previousRanking.rank,
            newRank: result.rank,
            locationName: location.name
          })
        }
      }

      logger.info(`Keyword tracking completed for ${keywordId}`)
    } catch (error) {
      logger.error(`Failed to track keyword ${keywordId}:`, error)
      throw error
    }
  })
}