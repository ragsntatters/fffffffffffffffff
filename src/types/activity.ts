import { z } from 'zod'

export const ActivityLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  teamMemberId: z.string().nullable(),
  locationId: z.string(),
  action: z.string(),
  details: z.record(z.unknown()).nullable(),
  user: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string()
  }),
  createdAt: z.string()
})

export const ActivityFilterSchema = z.object({
  locationId: z.string(),
  userId: z.string().optional(),
  teamMemberId: z.string().optional(),
  action: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})

export type ActivityLog = z.infer<typeof ActivityLogSchema>
export type ActivityFilter = z.infer<typeof ActivityFilterSchema>