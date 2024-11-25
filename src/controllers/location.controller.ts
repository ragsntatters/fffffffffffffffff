import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { getPlaceDetails } from '../lib/google-places'
import { ApiError } from '../utils/errors'
import type { CreateLocationInput, UpdateLocationInput } from '../types/location'

export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { placeId, settings } = req.body as CreateLocationInput
    const userId = req.user!.id

    const existingLocation = await prisma.location.findUnique({
      where: { placeId }
    })

    if (existingLocation) {
      throw new ApiError('Location already exists', 400)
    }

    const placeDetails = await getPlaceDetails(placeId)

    const location = await prisma.location.create({
      data: {
        ...placeDetails,
        settings: settings ? {
          create: settings
        } : undefined,
        users: {
          connect: { id: userId }
        },
        photos: {
          create: placeDetails.photos
        }
      },
      include: {
        photos: true,
        settings: true
      }
    })

    res.status(201).json({
      message: 'Location created successfully',
      data: location
    })
  } catch (error) {
    next(error)
  }
}

export const getLocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const [locations, total] = await Promise.all([
      prisma.location.findMany({
        where: {
          users: {
            some: { id: userId }
          }
        },
        include: {
          photos: true,
          settings: true
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.location.count({
        where: {
          users: {
            some: { id: userId }
          }
        }
      })
    ])

    res.json({
      data: locations,
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

export const getLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const location = await prisma.location.findFirst({
      where: {
        id,
        users: {
          some: { id: userId }
        }
      },
      include: {
        photos: true,
        settings: true
      }
    })

    if (!location) {
      throw new ApiError('Location not found', 404)
    }

    res.json({
      data: location
    })
  } catch (error) {
    next(error)
  }
}

export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const updates = req.body as UpdateLocationInput

    const location = await prisma.location.findFirst({
      where: {
        id,
        users: {
          some: { id: userId }
        }
      }
    })

    if (!location) {
      throw new ApiError('Location not found', 404)
    }

    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        ...updates,
        settings: updates.settings ? {
          upsert: {
            create: updates.settings,
            update: updates.settings
          }
        } : undefined
      },
      include: {
        photos: true,
        settings: true
      }
    })

    res.json({
      message: 'Location updated successfully',
      data: updatedLocation
    })
  } catch (error) {
    next(error)
  }
}

export const deleteLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const location = await prisma.location.findFirst({
      where: {
        id,
        users: {
          some: { id: userId }
        }
      }
    })

    if (!location) {
      throw new ApiError('Location not found', 404)
    }

    await prisma.location.delete({
      where: { id }
    })

    res.json({
      message: 'Location deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}