import { prisma } from './prisma'
import type { TeamActivityMetrics, PerformanceMetrics } from '../types/analytics'

export async function generateTeamActivityMetrics(
  locationId: string,
  date: Date
): Promise<TeamActivityMetrics> {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const [teamMembers, activities] = await Promise.all([
    prisma.teamMember.findMany({
      where: { locationId }
    }),
    prisma.activityLog.findMany({
      where: {
        locationId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })
  ])

  const activeUserIds = new Set(activities.map(a => a.userId))
  const actionsByUser = activities.reduce((acc, activity) => {
    acc[activity.userId] = (acc[activity.userId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const actionsByType = activities.reduce((acc, activity) => {
    acc[activity.action] = (acc[activity.action] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topContributors = Object.entries(actionsByUser)
    .map(([userId, actions]) => {
      const user = activities.find(a => a.userId === userId)?.user
      return {
        userId,
        name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        actions
      }
    })
    .sort((a, b) => b.actions - a.actions)
    .slice(0, 5)

  return {
    totalMembers: teamMembers.length,
    activeMembers: activeUserIds.size,
    actionsPerformed: activities.length,
    topContributors,
    actionsByType
  }
}

export async function generatePerformanceMetrics(
  locationId: string,
  date: Date
): Promise<PerformanceMetrics> {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  // Get keyword rankings
  const keywords = await prisma.keyword.findMany({
    where: { locationId },
    include: {
      rankings: {
        orderBy: { date: 'desc' },
        take: 2
      }
    }
  })

  const keywordMetrics = keywords.reduce(
    (acc, keyword) => {
      const [current, previous] = keyword.rankings
      if (!current) return acc

      const change = previous ? previous.rank - current.rank : 0
      
      return {
        total: acc.total + 1,
        improved: acc.improved + (change > 0 ? 1 : 0),
        declined: acc.declined + (change < 0 ? 1 : 0),
        unchanged: acc.unchanged + (change === 0 ? 1 : 0),
        avgRank: acc.avgRank + current.rank,
        topKeywords: [
          ...acc.topKeywords,
          { term: keyword.term, rank: current.rank, change }
        ].sort((a, b) => a.rank - b.rank).slice(0, 10)
      }
    },
    {
      total: 0,
      improved: 0,
      declined: 0,
      unchanged: 0,
      avgRank: 0,
      topKeywords: [] as Array<{ term: string; rank: number; change: number }>
    }
  )

  if (keywordMetrics.total > 0) {
    keywordMetrics.avgRank /= keywordMetrics.total
  }

  // Get review metrics
  const reviews = await prisma.review.findMany({
    where: {
      locationId,
      publishedAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  })

  const reviewMetrics = reviews.reduce(
    (acc, review) => ({
      total: acc.total + 1,
      average: acc.average + review.rating,
      responseRate: acc.responseRate + (review.response ? 1 : 0),
      distribution: {
        ...acc.distribution,
        [review.rating]: (acc.distribution[review.rating] || 0) + 1
      }
    }),
    {
      total: 0,
      average: 0,
      responseRate: 0,
      distribution: {} as Record<number, number>
    }
  )

  if (reviewMetrics.total > 0) {
    reviewMetrics.average /= reviewMetrics.total
    reviewMetrics.responseRate = (reviewMetrics.responseRate / reviewMetrics.total) * 100
  }

  // Get post metrics
  const posts = await prisma.post.findMany({
    where: {
      locationId,
      publishedAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    include: {
      metrics: true
    }
  })

  const postMetrics = posts.reduce(
    (acc, post) => ({
      total: acc.total + 1,
      engagement: acc.engagement + post.metrics.reduce((sum, m) => sum + m.engagement, 0),
      reach: acc.reach + post.metrics.reduce((sum, m) => sum + m.reach, 0),
      clicks: acc.clicks + post.metrics.reduce((sum, m) => sum + m.clicks, 0)
    }),
    { total: 0, engagement: 0, reach: 0, clicks: 0 }
  )

  return {
    keywords: keywordMetrics,
    reviews: reviewMetrics,
    posts: postMetrics
  }
}