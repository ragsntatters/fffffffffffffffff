import { z } from 'zod'

export const MediaTypeSchema = z.enum(['image', 'video'])

export const MediaMetadataSchema = z.object({
  format: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  size: z.number(),
  duration: z.number().optional(),
  originalName: z.string()
})

export const MediaSchema = z.object({
  id: z.string(),
  type: MediaTypeSchema,
  key: z.string(),
  url: z.string(),
  thumbnailUrl: z.string().optional(),
  contentType: z.string(),
  metadata: MediaMetadataSchema,
  createdAt: z.string(),
  updatedAt: z.string()
})

export const UploadResultSchema = z.object({
  key: z.string(),
  url: z.string(),
  contentType: z.string(),
  metadata: z.record(z.unknown()),
  thumbnail: z.object({
    key: z.string(),
    url: z.string()
  }).optional()
})

export type MediaType = z.infer<typeof MediaTypeSchema>
export type MediaMetadata = z.infer<typeof MediaMetadataSchema>
export type Media = z.infer<typeof MediaSchema>
export type UploadResult = z.infer<typeof UploadResultSchema>