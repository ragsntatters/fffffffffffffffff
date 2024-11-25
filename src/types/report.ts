import { z } from 'zod'

export const ReportTypeSchema = z.enum([
  'keyword_performance',
  'review_analytics',
  'post_engagement',
  'competitor_analysis',
  'team_activity',
  'custom'
])

export const ReportScheduleSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  dayOfWeek: z.number().min(0).max(6).optional(), // 0-6 for weekly
  dayOfMonth: z.number().min(1).max(31).optional(), // 1-31 for monthly
  time: z.string(), // HH:mm format
  timezone: z.string(),
  recipients: z.array(z.string().email()),
  enabled: z.boolean()
})

export const ReportConfigSchema = z.object({
  type: ReportTypeSchema,
  name: z.string(),
  description: z.string().optional(),
  locationIds: z.array(z.string()),
  metrics: z.array(z.string()),
  dateRange: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
    period: z.enum(['day', 'week', 'month', 'quarter', 'year']).optional()
  }),
  filters: z.record(z.unknown()).optional(),
  schedule: ReportScheduleSchema.optional(),
  format: z.enum(['pdf', 'csv', 'excel']).default('pdf'),
  customization: z.object({
    logo: z.boolean().default(true),
    charts: z.boolean().default(true),
    tables: z.boolean().default(true),
    summary: z.boolean().default(true)
  }).optional()
})

export const ReportSchema = z.object({
  id: z.string(),
  userId: z.string(),
  config: ReportConfigSchema,
  lastRun: z.string().nullable(),
  nextRun: z.string().nullable(),
  status: z.enum(['active', 'paused', 'error']),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type ReportType = z.infer<typeof ReportTypeSchema>
export type ReportSchedule = z.infer<typeof ReportScheduleSchema>
export type ReportConfig = z.infer<typeof ReportConfigSchema>
export type Report = z.infer<typeof ReportSchema>