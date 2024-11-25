import { prisma } from '../../prisma'
import { ReportConfig } from '../../../types/report'
import { formatDate, calculateDateRange } from '../../utils/date'

export async function generateKeywordPerformanceReport(config: ReportConfig) {
  const { locationIds, dateRange } = config
  const { startDate, endDate } = calculateDateRange(dateRange)

  const keywordData = await prisma.keyword.findMany({
    where: {
      locationId: { in: locationIds },
      rankings: {
        some: {
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      }
    },
    include: {
      rankings: {
        where: {
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { date: 'asc' }
      },
      competitors: {
        where: {
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { date: 'asc' }
      }
    }
  })

  const metrics = keywordData.map(keyword => {
    const rankingTrend = keyword.rankings.reduce((acc, ranking) => {
      acc[formatDate(ranking.date)] = {
        rank: ranking.rank,
        avgAGR: ranking.avgAGR,
        ATGR: ranking.ATGR,
        SoLV: ranking.SoLV
      }
      return acc
    }, {} as Record<string, any>)

    const competitorTrend = keyword.competitors.reduce((acc, comp) => {
      const date = formatDate(comp.date)
      if (!acc[date]) acc[date] = {}
      acc[date][comp.name] = comp.rank
      return acc
    }, {} as Record<string, Record<string, number>>)

    return {
      keyword: keyword.term,
      rankings: rankingTrend,
      competitors: competitorTrend,
      currentRank: keyword.rankings[keyword.rankings.length - 1]?.rank,
      bestRank: Math.min(...keyword.rankings.map(r => r.rank)),
      worstRank: Math.max(...keyword.rankings.map(r => r.rank)),
      avgRank: keyword.rankings.reduce((sum, r) => sum + r.rank, 0) / keyword.rankings.length
    }
  })

  return {
    summary: {
      totalKeywords: keywordData.length,
      avgRank: metrics.reduce((sum, m) => sum + m.currentRank, 0) / metrics.length,
      improvedKeywords: metrics.filter(m => {
        const ranks = Object.values(m.rankings)
        return ranks[ranks.length - 1].rank < ranks[0].rank
      }).length
    },
    metrics,
    period: {
      start: startDate,
      end: endDate
    }
  }
}