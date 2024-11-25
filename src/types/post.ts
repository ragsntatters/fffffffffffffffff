import { z } from 'zod'

export const MediaSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'video']),
  url: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
  size: z.number(),
  format: z.string(),
  alt: z.string().optional(),
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const PostMetricsSchema = z.object({
  views: z.number(),
  likes: z.number(),
  shares: z.number(),
  comments: z.number(),
  clicks: z.number(),
  platform: z.enum(['google', 'facebook', 'instagram'])
})

export const PostSchema = z.object({
  id: z.string(),
  locationId: z.string(),
  title: z.string(),
  content: z.string(),
  media: z.array(MediaSchema),
  status: z.enum(['draft', 'pending', 'scheduled', 'published', 'rejected', 'archived']),
  platforms: z.array(z.enum(['google', 'facebook', 'instagram'])),
  schedule: z.string().datetime().optional(),
  author: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string()
  }),
  approver: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string()
  }).optional(),
  publishedAt: z.string().datetime().optional(),
  metrics: z.array(PostMetricsSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const CreatePostSchema = z.object({
  locationId: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
  platforms: z.array(z.enum(['google', 'facebook', 'instagram'])),
  schedule: z.string().datetime().optional(),
  media: z.array(z.object({
    type: z.enum(['image', 'video']),
    file: z.any(), // File object
    alt: z.string().optional()
  })).optional()
})

export const UpdatePostSchema = CreatePostSchema.partial()

export type Post = z.infer<typeof PostSchema>
export type PostMedia = z.infer<typeof MediaSchema>
export type PostMetrics = z.infer<typeof PostMetricsSchema>
export type CreatePostInput = z.infer<typeof CreatePostSchema>
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>