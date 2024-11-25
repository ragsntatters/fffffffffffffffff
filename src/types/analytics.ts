import { z } from 'zod'

export const AnalyticsSchema = z.object({
  id: z.string(),
  locationId: z.string(),
  type: z.enum(['team_activity', 'keyword_performance', 'review_metrics', 'post_engagement']),
  data: z.record(z.unknown()),
  date: z.string(),
  createdAt: z.string()
})

export const TeamActivityMetricsSchema = z.object({
  totalMembers: z.number(),
  activeMembers: z.number(),
  actionsPerformed: z.number(),
  topContributors: z.array(z.object({
    userId: z.string(),
    name: z.string(),
    actions: z.number()
  })),
  actionsByType: z.record(z.number())
})

export const PerformanceMetricsSchema = z.object({
  keywords: z.object({
    total: z.number(),
    improved: z.number(),
    declined: z.number(),
    unchanged: z.number(),
    avgRank: z.number(),
    topKeywords: z.array(z.object({
      term: z.string(),
      rank: z.number(),
      change: z.number()
    }))
  }),
  reviews: z.object({
    total: z.number(),
    average: z.number(),
    responseRate: z.number(),
    distribution: z.record(z.number())
  }),
  posts: z.object({
    total: z.number(),
    engagement: z.number(),
    reach: z.number(),
    clicks: z.number()
  })
})

export type Analytics = z.infer<typeof AnalyticsSchema>
export type TeamActivityMetrics = z.infer<typeof TeamActivityMetricsSchema>
export type PerformanceMetrics = z.infer<typeof PerformanceMetricsSchema>