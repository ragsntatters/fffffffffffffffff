import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { 
  stripe, 
  createCustomer, 
  createSubscription, 
  cancelSubscription, 
  updateSubscription,
  createBillingPortalSession,
  createCheckoutSession,
  plans
} from '../lib/stripe'
import { checkUsageLimit, incrementUsage } from '../lib/usage'
import { ApiError } from '../utils/errors'
import type { Plan } from '../types/subscription'

export const createCheckout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { planId, quantity = 1 } = req.body
    const userId = req.user!.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    })

    if (!user) {
      throw new ApiError('User not found', 404)
    }

    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await createCustomer(user.email, `${user.firstName} ${user.lastName}`)
      customerId = customer.id

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId }
      })
    }

    const session = await createCheckoutSession(
      customerId,
      planId,
      `${process.env.FRONTEND_URL}/billing/success`,
      `${process.env.FRONTEND_URL}/billing/cancel`,
      quantity
    )

    res.json({
      url: session.url
    })
  } catch (error) {
    next(error)
  }
}

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sig = req.headers['stripe-signature']

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const planId = subscription.items.data[0].price.id
        const plan = Object.entries(plans).find(([_, p]) => p.id === planId)?.[0] as Plan

        await prisma.subscription.upsert({
          where: {
            stripeSubscriptionId: subscription.id
          },
          create: {
            stripeSubscriptionId: subscription.id,
            userId: subscription.metadata.userId,
            plan,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            quantity: subscription.items.data[0].quantity || 1
          },
          update: {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            quantity: subscription.items.data[0].quantity || 1
          }
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id
          },
          data: {
            status: 'canceled',
            canceledAt: new Date()
          }
        })
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        await prisma.invoice.create({
          data: {
            stripeInvoiceId: invoice.id,
            subscriptionId: invoice.subscription as string,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'paid',
            paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
            items: invoice.lines.data.map(line => ({
              description: line.description || '',
              amount: line.amount,
              quantity: line.quantity || 1
            }))
          }
        })
        break
      }
    }

    res.json({ received: true })
  } catch (error) {
    next(error)
  }
}

export const getBillingPortal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user?.stripeCustomerId) {
      throw new ApiError('No billing account found', 404)
    }

    const session = await createBillingPortalSession(
      user.stripeCustomerId,
      `${process.env.FRONTEND_URL}/billing`
    )

    res.json({
      url: session.url
    })
  } catch (error) {
    next(error)
  }
}

export const getSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id

    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      include: {
        usage: {
          where: {
            period: new Date().toISOString().slice(0, 7)
          }
        }
      }
    })

    if (!subscription) {
      throw new ApiError('No subscription found', 404)
    }

    res.json({
      data: subscription
    })
  } catch (error) {
    next(error)
  }
}

export const getInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where: {
          subscription: {
            userId
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.invoice.count({
        where: {
          subscription: {
            userId
          }
        }
      })
    ])

    res.json({
      data: invoices,
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

export const getUsage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const { feature } = req.query

    const usage = await prisma.usage.findMany({
      where: {
        subscription: {
          userId
        },
        ...(feature ? { feature: feature as string } : {})
      },
      orderBy: [
        { period: 'desc' },
        { feature: 'asc' }
      ]
    })

    res.json({
      data: usage
    })
  } catch (error) {
    next(error)
  }
}