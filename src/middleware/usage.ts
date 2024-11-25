import { Request, Response, NextFunction } from 'express'
import { checkUsageLimit, incrementUsage } from '../lib/usage'
import { ApiError } from '../utils/errors'

export const checkFeatureUsage = (feature: 'locations' | 'keywords' | 'posts' | 'users') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: { userId: req.user!.id }
      })

      if (!subscription) {
        throw new ApiError('No active subscription found', 403)
      }

      const hasAvailableUsage = await checkUsageLimit(subscription.id, feature)
      if (!hasAvailableUsage) {
        throw new ApiError(`${feature} limit reached for current plan`, 403)
      }

      // Store subscription ID for later use
      req.subscriptionId = subscription.id
      next()
    } catch (error) {
      next(error)
    }
  }
}

export const trackUsage = (feature: 'locations' | 'keywords' | 'posts' | 'users') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { subscriptionId } = req
      if (subscriptionId) {
        await incrementUsage(subscriptionId, feature)
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}