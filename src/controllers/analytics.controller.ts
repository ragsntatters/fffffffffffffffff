import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { generateTeamActivityMetrics, generatePerformanceMetrics } from '../lib/analytics'
import { ApiError } from '../utils/errors'

export const getLocationAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId } = req.params
    const { startDate, endDate, type } = req.query

    const location = await prisma.location.findFirst({
      where: {
        id: locationId,
        users: { some: { id: req.user!.id } }
      }
    })

    if (!location) {
      throw new ApiError('Location not found', 404)
    }

    const analytics = await prisma.analytics.findMany({
      where: {
        locationId,
        type: type as string,
        date: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined
        }
      },
      orderBy: { date: 'asc' }
    })

    res.json({
      data: analytics
    })
  } catch (error) {
    next(error)
  }
}

export const generateAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId } = req.params
    const { date = new Date() } = req.body

    const location = await prisma.location.findFirst({
      where: {
        id: locationId,
        users: {
          some: {
            id: req.user!.id,
            teamMembers: {
              some: {
                role: 'admin'
              }
            }
          }
        }
      }
    })

    if (!location) {
      throw new ApiError('Location not found or insufficient permissions', 404)
    }

    const [teamActivity, performance] = await Promise.all([
      generateTeamActivityMetrics(locationId, new Date(date)),
      generatePerformanceMetrics(locationId, new Date(date))
    ])

    const analytics = await prisma.$transaction([
      prisma.analytics.create({
        data: {
          locationId,
          type: 'team_activity',
          data: teamActivity,
          date: new Date(date)
        }
      }),
      prisma.analytics.create({
        data: {
          locationId,
          type: 'keyword_performance',
          data: performance.keywords,
          date: new Date(date)
        }
      }),
      prisma.analytics.create({
        data: {
          locationId,
          type: 'review_metrics',
          data: performance.reviews,
          date: new Date(date)
        }
      }),
      prisma.analytics.create({
        data: {
          locationId,
          type: 'post_engagement',
          data: performance.posts,
          date: new Date(date)
        }
      })
    ])

    res.json({
      message: 'Analytics generated successfully',
      data: analytics
    })
  } catch (error) {
    next(error)
  }
}