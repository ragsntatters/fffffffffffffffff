import { prisma } from '../../prisma'
import { trackKeyword } from '../../keyword-tracking'
import { logger } from '../../utils/logger'

interface HistoricGridSnapshot {
  date: string
  rank: number
  avgAGR: number
  ATGR: number
  SoLV: number
  gridPoints: Array<{
    position: [number, number]
    rank: number
  }>
}

export async function getHistoricGridSnapshots(
  keywordId: string,
  startDate: Date,
  endDate: Date
): Promise<HistoricGridSnapshot[]> {
  try {
    const keyword = await prisma.keyword.findUnique({
      where: { id: keywordId },
      include: {
        location: true,
        rankings: {
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

    if (!keyword) {
      throw new Error('Keyword not found')
    }

    // Get historic grid points from database
    const gridSnapshots = await prisma.gridSnapshot.findMany({
      where: {
        keywordId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'asc' }
    })

    // Map snapshots to required format
    return gridSnapshots.map(snapshot => ({
      date: snapshot.date.toISOString().split('T')[0],
      rank: snapshot.rank,
      avgAGR: snapshot.avgAGR,
      ATGR: snapshot.ATGR,
      SoLV: snapshot.SoLV,
      gridPoints: JSON.parse(snapshot.gridPoints)
    }))
  } catch (error) {
    logger.error('Failed to get historic grid snapshots:', error)
    throw error
  }
}

export async function saveGridSnapshot(
  keywordId: string,
  location: { latitude: number; longitude: number }
): Promise<void> {
  try {
    const keyword = await prisma.keyword.findUnique({
      where: { id: keywordId }
    })

    if (!keyword) {
      throw new Error('Keyword not found')
    }

    // Track current rankings
    const result = await trackKeyword(keyword, location)

    // Save snapshot
    await prisma.gridSnapshot.create({
      data: {
        keywordId,
        date: new Date(),
        rank: result.rank,
        avgAGR: result.avgAGR,
        ATGR: result.ATGR,
        SoLV: result.SoLV,
        gridPoints: JSON.stringify(result.gridPoints)
      }
    })
  } catch (error) {
    logger.error('Failed to save grid snapshot:', error)
    throw error
  }
}