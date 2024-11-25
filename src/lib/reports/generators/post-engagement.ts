import { prisma } from '../../prisma'
import { ReportConfig } from '../../../types/report'
import { formatDate, calculateDateRange } from '../../utils/date'

export async function generatePostEngagementReport(config: ReportConfig) {
  const { locationIds, dateRange } = config
  const { startDate, endDate } = calculateDateRange(dateRange)

  const postData = await prisma.post.findMany({
    where: {
      locationId: { in: locationIds },
      publishedAt: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      metrics: true
    },
    orderBy: { publishedAt: 'asc' }
  })

  const metrics = postData.reduce((acc, post) => {
    const date = formatDate(post.publishedAt!)
    if (!acc[date]) {
      acc[date] = {
        total: 0,
        byPlatform: {
          google: { posts: 0, engagement: 0, reach: 0 },
          facebook: { posts: 0, engagement: 0, reach: 0 },
          instagram: { posts: 0, engagement: 0, reach: 0 }
        }
      }
    }

    acc[date].total++
    post.platforms.forEach(platform => {
      const platformMetrics = post.metrics.find(m => m.platform === platform)
      if (platformMetrics) {
        acc[date].byPlatform[platform].posts++
        acc[date].byPlatform[platform].engagement += platformMetrics.engagement
        acc[date].byPlatform[platform].reach += platformMetrics.reach
      }
    })

    return acc
  }, {} as Record<string, any>)

  const platformTotals = postData.reduce((acc, post) => {
    post.platforms.forEach(platform => {
      if (!acc[platform]) {
        acc[platform] = { posts: 0, engagement: 0, reach: 0 }
      }
      acc[platform].posts++
      
      const platformMetrics = post.metrics.find(m => m.platform === platform)
      if (platformMetrics) {
        acc[platform].engagement += platformMetrics.engagement
        acc[platform].reach += platformMetrics.reach
      }
    })
    return acc
  }, {} as Record<string, any>)

  return {
    summary: {
      totalPosts: postData.length,
      platformBreakdown: platformTotals,
      avgEngagementRate: Object.values(platformTotals).reduce(
        (sum, platform) => sum + (platform.engagement / platform.reach) * 100,
        0
      ) / Object.keys(platformTotals).length
    },
    metrics,
    period: {
      start: startDate,
      end: endDate
    }
  }
}