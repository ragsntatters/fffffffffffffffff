import { z } from 'zod'

export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  placeId: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  timezone: z.string(),
  primaryCategory: z.string(),
  categories: z.array(z.string()),
  photos: z.array(z.object({
    id: z.string(),
    url: z.string(),
    reference: z.string()
  })),
  settings: z.object({
    notifyOnReviews: z.boolean(),
    notifyOnRankChanges: z.boolean(),
    autoApproveResponses: z.boolean(),
    reviewAlertThreshold: z.number(),
    rankingAlertThreshold: z.number()
  }).nullable(),
  metadata: z.record(z.unknown()).nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const CreateLocationSchema = z.object({
  placeId: z.string(),
  settings: z.object({
    notifyOnReviews: z.boolean(),
    notifyOnRankChanges: z.boolean(),
    autoApproveResponses: z.boolean(),
    reviewAlertThreshold: z.number(),
    rankingAlertThreshold: z.number()
  }).optional()
})

export const UpdateLocationSchema = z.object({
  name: z.string().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  primaryCategory: z.string().optional(),
  categories: z.array(z.string()).optional(),
  settings: z.object({
    notifyOnReviews: z.boolean(),
    notifyOnRankChanges: z.boolean(),
    autoApproveResponses: z.boolean(),
    reviewAlertThreshold: z.number(),
    rankingAlertThreshold: z.number()
  }).optional(),
  metadata: z.record(z.unknown()).optional()
})

export type Location = z.infer<typeof LocationSchema>
export type CreateLocationInput = z.infer<typeof CreateLocationSchema>
export type UpdateLocationInput = z.infer<typeof UpdateLocationSchema>