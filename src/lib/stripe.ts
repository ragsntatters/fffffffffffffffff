import Stripe from 'stripe'
import { config } from '../config'

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16'
})

export const plans = {
  starter: {
    id: config.stripe.plans.starter,
    name: 'Starter',
    features: {
      locations: 3,
      keywords: 100,
      posts: 50,
      users: 5
    }
  },
  professional: {
    id: config.stripe.plans.professional,
    name: 'Professional',
    features: {
      locations: 10,
      keywords: 500,
      posts: 200,
      users: 15
    }
  },
  enterprise: {
    id: config.stripe.plans.enterprise,
    name: 'Enterprise',
    features: {
      locations: -1, // unlimited
      keywords: -1,
      posts: -1,
      users: -1
    }
  }
}

export async function createCustomer(
  email: string,
  name: string,
  metadata: Record<string, string> = {}
) {
  return stripe.customers.create({
    email,
    name,
    metadata
  })
}

export async function createSubscription(
  customerId: string,
  priceId: string,
  quantity: number = 1
) {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId, quantity }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription'
    },
    expand: ['latest_invoice.payment_intent']
  })
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId)
}

export async function updateSubscription(
  subscriptionId: string,
  updates: Stripe.SubscriptionUpdateParams
) {
  return stripe.subscriptions.update(subscriptionId, updates)
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl
  })
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  quantity: number = 1
) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity
      }
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl
  })
}