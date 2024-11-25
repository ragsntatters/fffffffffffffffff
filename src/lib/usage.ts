import { prisma } from './prisma'
import { plans } from './stripe'
import type { Plan } from '../types/subscription'

export async function checkUsageLimit(
  subscriptionId: string,
  feature: 'locations' | 'keywords' | 'posts' | 'users'
): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId }
  })

  if (!subscription) {
    return false
  }

  const planLimits = plans[subscription.plan as Plan].features
  if (planLimits[feature] === -1) {
    return true
  }

  const usage = await prisma.usage.findFirst({
    where: {
      subscriptionId,
      feature,
      period: new Date().toISOString().slice(0, 7) // Current month
    }
  })

  return !usage || usage.used < planLimits[feature]
}

export async function incrementUsage(
  subscriptionId: string,
  feature: 'locations' | 'keywords' | 'posts' | 'users'
): Promise<void> {
  const period = new Date().toISOString().slice(0, 7)

  await prisma.usage.upsert({
    where: {
      subscriptionId_feature_period: {
        subscriptionId,
        feature,
        period
      }
    },
    update: {
      used: {
        increment: 1
      }
    },
    create: {
      subscriptionId,
      feature,
      period,
      used: 1,
      limit: plans[feature]
    }
  })
}