import { z } from 'zod'

export const PlanSchema = z.enum(['free', 'starter', 'professional', 'enterprise'])

export const SubscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  plan: PlanSchema,
  status: z.enum(['active', 'past_due', 'canceled', 'trialing']),
  currentPeriodStart: z.string(),
  currentPeriodEnd: z.string(),
  cancelAtPeriodEnd: z.boolean(),
  quantity: z.number(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const UsageSchema = z.object({
  id: z.string(),
  subscriptionId: z.string(),
  feature: z.enum(['locations', 'keywords', 'posts', 'users']),
  used: z.number(),
  limit: z.number(),
  period: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const InvoiceSchema = z.object({
  id: z.string(),
  subscriptionId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(['draft', 'open', 'paid', 'void', 'uncollectible']),
  dueDate: z.string(),
  paidAt: z.string().nullable(),
  items: z.array(z.object({
    description: z.string(),
    amount: z.number(),
    quantity: z.number()
  })),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type Plan = z.infer<typeof PlanSchema>
export type Subscription = z.infer<typeof SubscriptionSchema>
export type Usage = z.infer<typeof UsageSchema>
export type Invoice = z.infer<typeof InvoiceSchema>