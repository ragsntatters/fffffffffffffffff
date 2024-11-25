import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { trackKeyword } from '../lib/keyword-tracking'
import { ApiError } from '../utils/errors'
import type { CreateKeywordInput, UpdateKeywordInput } from '../types/keyword'

export const createKeyword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId, term, gridSize, radius, unit } = req.body as CreateKeywordInput

    const location = await prisma.location.findFirst({
      where: {
        id: locationId,
        users: { some: { id: req.user!.id } }
      }
    })

    if (!location) {
      throw new ApiError('Location not found', 404)
    }

    const existingKeyword = await prisma.keyword.findUnique({
      where: {
        locationId_term: {
          locationId,
          term
        }
      }
    })

    if (existingKeyword) {
      throw new ApiError('Keyword already exists for this location', 400)
    }

    const keyword = await prisma.keyword.create({
      data: {
        locationId,
        term,
        gridSize: gridSize || '3x3',
        radius,
        unit
      }
    })

    // Track initial ranking
    const result = await trackKeyword(keyword, {
      latitude: location.latitude,
      longitude: location.longitude
    })

    // Store ranking results
    await prisma.ranking.create({
      data: {
        keywordId: keyword.id,
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
        keywordId: keyword.id,
        placeId: competitor.placeId,
        name: competitor.name,
        rank: competitor.rank,
        date: new Date()
      }))
    })

    res.status(201).json({
      message: 'Keyword tracking started successfully',
      data: {
        keyword,
        initialRanking: result
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getKeywords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const location = await prisma.location.findFirst({
      where: {
        id: locationId,
        users: { some: { id: req.user!.id } }
      }
    })

    if (!location) {
      throw new ApiError('Location not found', 404)
    }

    const [keywords, total] = await Promise.all([
      prisma.keyword.findMany({
        where: { locationId },
        include: {
          rankings: {
            orderBy: { date: 'desc' },
            take: 1
          },
          competitors: {
            orderBy: { date: 'desc' },
            take: 10
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.keyword.count({
        where: { locationId }
      })
    ])

    res.json({
      data: keywords,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getKeywordHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { startDate, endDate } = req.query

    const keyword = await prisma.keyword.findFirst({
      where: {
        id,
        location: {
          users: { some: { id: req.user!.id } }
        }
      }
    })

    if (!keyword) {
      throw new ApiError('Keyword not found', 404)
    }

    const rankings = await prisma.ranking.findMany({
      where: {
        keywordId: id,
        date: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined
        }
      },
      orderBy: { date: 'asc' }
    })

    const competitors = await prisma.competitorRanking.findMany({
      where: {
        keywordId: id,
        date: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined
        }
      },
      orderBy: { date: 'asc' }
    })

    res.json({
      data: {
        keyword,
        rankings,
        competitors
      }
    })
  } catch (error) {
    next(error)
  }
}

export const updateKeyword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const updates = req.body as UpdateKeywordInput

    const keyword = await prisma.keyword.findFirst({
      where: {
        id,
        location: {
          users: { some: { id: req.user!.id } }
        }
      }
    })

    if (!keyword) {
      throw new ApiError('Keyword not found', 404)
    }

    const updatedKeyword = await prisma.keyword.update({
      where: { id },
      data: updates
    })

    res.json({
      message: 'Keyword updated successfully',
      data: updatedKeyword
    })
  } catch (error) {
    next(error)
  }
}

export const deleteKeyword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const keyword = await prisma.keyword.findFirst({
      where: {
        id,
        location: {
          users: { some: { id: req.user!.id } }
        }
      }
    })

    if (!keyword) {
      throw new ApiError('Keyword not found', 404)
    }

    await prisma.keyword.delete({
      where: { id }
    })

    res.json({
      message: 'Keyword deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}