import { prisma } from '../../prisma'
import { ReportConfig } from '../../../types/report'
import { formatDate, calculateDateRange } from '../../utils/date'

export async function generateReviewAnalyticsReport(config: ReportConfig) {
  const { locationIds, dateRange } = config
  const { startDate, endDate } = calculateDateRange(dateRange)

  const reviewData = await prisma.review.findMany({
    where: {
      locationId: { in: locationIds },
      publishedAt: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      response: true,
      sentiment: true
    },
    orderBy: { publishedAt: 'asc' }
  })

  const metrics = reviewData.reduce((acc, review) => {
    const date = formatDate(review.publishedAt)
    if (!acc[date]) {
      acc[date] = {
        total: 0,
        ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        responded: 0,
        avgRating: 0,
        sentiment: { positive: 0, neutral: 0, negative: 0 }
      }
    }

    acc[date].total++
    acc[date].ratings[review.rating]++
    if (review.response) acc[date].responded++
    acc[date].avgRating = (acc[date].avgRating * (acc[date].total - 1) + review.rating) / acc[date].total

    if (review.sentiment) {
      const score = review.sentiment.score
      if (score > 0.2) acc[date].sentiment.positive++
      else if (score < -0.2) acc[date].sentiment.negative++
      else acc[date].sentiment.neutral++
    }

    return acc
  }, {} as Record<string, any>)

  const totalReviews = reviewData.length
  const avgRating = reviewData.reduce((sum, r) => sum + r.rating, 0) / totalReviews
  const responseRate = (reviewData.filter(r => r.response).length / totalReviews) * 100

  return {
    summary: {
      totalReviews,
      avgRating,
      responseRate,
      ratingDistribution: Object.values(metrics).reduce((acc, day) => {
        Object.entries(day.ratings).forEach(([rating, count]) => {
          acc[rating] = (acc[rating] || 0) + count
        })
        return acc
      }, {} as Record<number, number>)
    },
    metrics,
    period: {
      start: startDate,
      end: endDate
    }
  }
}