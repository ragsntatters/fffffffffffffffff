import { prisma } from './prisma'
import type { ActivityLog } from '../types/activity'

export async function logActivity(data: {
  userId: string
  teamMemberId?: string
  locationId: string
  action: string
  details?: Record<string, unknown>
}): Promise<ActivityLog> {
  return prisma.activityLog.create({
    data: {
      userId: data.userId,
      teamMemberId: data.teamMemberId,
      locationId: data.locationId,
      action: data.action,
      details: data.details || null
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
}

export async function getLocationActivity(
  locationId: string,
  filters: {
    userId?: string
    teamMemberId?: string
    action?: string
    startDate?: Date
    endDate?: Date
  }
) {
  return prisma.activityLog.findMany({
    where: {
      locationId,
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.teamMemberId && { teamMemberId: filters.teamMemberId }),
      ...(filters.action && { action: filters.action }),
      ...(filters.startDate || filters.endDate ? {
        createdAt: {
          gte: filters.startDate,
          lte: filters.endDate
        }
      } : {})
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getUserActivity(userId: string) {
  return prisma.activityLog.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}