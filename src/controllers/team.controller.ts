import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { ApiError } from '../utils/errors'
import type { AddTeamMemberInput, UpdateTeamMemberInput } from '../types/team'

export const getTeamMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId } = req.params

    const location = await prisma.location.findFirst({
      where: {
        id: locationId,
        users: { some: { id: req.user!.id } }
      }
    })

    if (!location) {
      throw new ApiError('Location not found', 404)
    }

    const teamMembers = await prisma.teamMember.findMany({
      where: { locationId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    res.json({
      data: teamMembers
    })
  } catch (error) {
    next(error)
  }
}

export const addTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId } = req.params
    const { email, role, permissions } = req.body as AddTeamMemberInput

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

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new ApiError('User not found', 404)
    }

    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_locationId: {
          userId: user.id,
          locationId
        }
      }
    })

    if (existingMember) {
      throw new ApiError('User is already a team member', 400)
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        userId: user.id,
        locationId,
        role,
        permissions
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    res.status(201).json({
      message: 'Team member added successfully',
      data: teamMember
    })
  } catch (error) {
    next(error)
  }
}

export const updateTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId, memberId } = req.params
    const updates = req.body as UpdateTeamMemberInput

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

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
        locationId
      }
    })

    if (!teamMember) {
      throw new ApiError('Team member not found', 404)
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id: memberId },
      data: updates,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    res.json({
      message: 'Team member updated successfully',
      data: updatedMember
    })
  } catch (error) {
    next(error)
  }
}

export const removeTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId, memberId } = req.params

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

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
        locationId
      }
    })

    if (!teamMember) {
      throw new ApiError('Team member not found', 404)
    }

    await prisma.teamMember.delete({
      where: { id: memberId }
    })

    res.json({
      message: 'Team member removed successfully'
    })
  } catch (error) {
    next(error)
  }
}