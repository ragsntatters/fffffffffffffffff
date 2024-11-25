import { z } from 'zod'

export const NotificationTypeSchema = z.enum([
  'review',
  'rank_change',
  'post_approval',
  'team_invite',
  'report_ready',
  'subscription',
  'system'
])

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  message: z.string(),
  data: z.record(z.unknown()).optional(),
  read: z.boolean().default(false),
  readAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const NotificationPreferencesSchema = z.object({
  userId: z.string(),
  email: z.object({
    reviews: z.boolean(),
    rankChanges: z.boolean(),
    postApprovals: z.boolean(),
    teamInvites: z.boolean(),
    reports: z.boolean(),
    billing: z.boolean()
  }),
  push: z.object({
    enabled: z.boolean(),
    token: z.string().optional()
  }),
  webhooks: z.array(z.object({
    id: z.string(),
    url: z.string().url(),
    secret: z.string(),
    events: z.array(NotificationTypeSchema),
    active: z.boolean()
  }))
})

export type NotificationType = z.infer<typeof NotificationTypeSchema>
export type Notification = z.infer<typeof NotificationSchema>
export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>