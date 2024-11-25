import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { fetchLocationReviews, postReviewResponse } from '../lib/google-reviews'
import { analyzeSentiment } from '../lib/sentiment'
import { ApiError } from '../utils/errors'
import type { CreateReviewResponse } from '../types/review'

export const syncLocationReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId } = req.params
    const location = await prisma.location.findUnique({
      where: { id: locationId }
    })

    if (!location) {
      throw new ApiError('Location not found', 404)
    }

    const reviews = await fetchLocationReviews(location.placeId)

    for (const review of reviews) {
      const existingReview = await prisma.review.findUnique({
        where: { googleReviewId: review.review_id }
      })

      if (!existingReview) {
        const sentiment = await analyzeSentiment(review.text)

        await prisma.review.create({
          data: {
            locationId,
            googleReviewId: review.review_id,
            author: review.author_name,
            authorPhotoUrl: review.profile_photo_url,
            rating: review.rating,
            text: review.text,
            publishedAt: new Date(review.time * 1000),
            sentiment: {
              create: sentiment
            }
          }
        })
      }
    }

    await updateLocationMetrics(locationId)

    res.json({
      message: 'Reviews synced successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const getLocationReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const status = req.query.status as string

    const where = {
      locationId,
      ...(status ? { status } : {})
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          response: {
            include: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          sentiment: true
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.review.count({ where })
    ])

    res.json({
      data: reviews,
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

export const respondToReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params
    const userId = req.user!.id
    const { text } = req.body as CreateReviewResponse

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { location: true }
    })

    if (!review) {
      throw new ApiError('Review not found', 404)
    }

    const response = await prisma.reviewResponse.create({
      data: {
        reviewId,
        text,
        authorId: userId
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // If auto-approve is enabled, publish the response immediately
    const settings = await prisma.locationSettings.findUnique({
      where: { locationId: review.locationId }
    })

    if (settings?.autoApproveResponses) {
      await postReviewResponse(review.location.placeId, review.googleReviewId, text)
      
      await prisma.reviewResponse.update({
        where: { id: response.id },
        data: {
          status: 'published',
          publishedAt: new Date()
        }
      })
    }

    res.json({
      message: 'Response created successfully',
      data: response
    })
  } catch (error) {
    next(error)
  }
}

export const approveResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { responseId } = req.params

    const response = await prisma.reviewResponse.findUnique({
      where: { id: responseId },
      include: {
        review: {
          include: { location: true }
        }
      }
    })

    if (!response) {
      throw new ApiError('Response not found', 404)
    }

    await postReviewResponse(
      response.review.location.placeId,
      response.review.googleReviewId,
      response.text
    )

    const updatedResponse = await prisma.reviewResponse.update({
      where: { id: responseId },
      data: {
        status: 'published',
        publishedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    res.json({
      message: 'Response approved and published successfully',
      data: updatedResponse
    })
  } catch (error) {
    next(error)
  }
}

export const getReviewMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId } = req.params
    const { startDate, endDate } = req.query

    const metrics = await prisma.reviewMetrics.findMany({
      where: {
        locationId,
        date: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined
        }
      },
      orderBy: { date: 'asc' }
    })

    res.json({
      data: metrics
    })
  } catch (error) {
    next(error)
  }
}

async function updateLocationMetrics(locationId: string) {
  const reviews = await prisma.review.findMany({
    where: { locationId }
  })

  const totalReviews = reviews.length
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

  const responses = await prisma.reviewResponse.findMany({
    where: {
      review: { locationId },
      status: 'published'
    }
  })

  const responseRate = (responses.length / totalReviews) * 100

  const responseTimes = responses.map(response => {
    const review = reviews.find(r => r.id === response.reviewId)
    if (!review || !response.publishedAt) return 0
    return (response.publishedAt.getTime() - review.publishedAt.getTime()) / (1000 * 60 * 60 * 24)
  })

  const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responses.length

  const distribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  await prisma.reviewMetrics.create({
    data: {
      locationId,
      date: new Date(),
      totalReviews,
      averageRating,
      responseRate,
      responseTime: averageResponseTime,
      distribution
    }
  })
}