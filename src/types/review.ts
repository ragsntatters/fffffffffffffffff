import { z } from 'zod'

export const ReviewSchema = z.object({
  id: z.string(),
  locationId: z.string(),
  googleReviewId: z.string(),
  author: z.string(),
  authorPhotoUrl: z.string().nullable(),
  rating: z.number().min(1).max(5),
  text: z.string(),
  status: z.enum(['active', 'flagged', 'resolved', 'deleted']),
  isVerified: z.boolean(),
  publishedAt: z.string(),
  response: z.object({
    id: z.string(),
    text: z.string(),
    status: z.enum(['pending', 'approved', 'rejected', 'published']),
    author: z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string()
    }),
    publishedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string()
  }).nullable(),
  sentiment: z.object({
    score: z.number(),
    magnitude: z.number(),
    topics: z.array(z.string()),
    keywords: z.array(z.string())
  }).nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const CreateReviewResponseSchema = z.object({
  text: z.string().min(1)
})

export const ReviewMetricsSchema = z.object({
  totalReviews: z.number(),
  averageRating: z.number(),
  responseRate: z.number(),
  responseTime: z.number(),
  distribution: z.record(z.number()),
  trends: z.object({
    reviews: z.number(),
    rating: z.number(),
    responseRate: z.number()
  })
})

export type Review = z.infer<typeof ReviewSchema>
export type CreateReviewResponse = z.infer<typeof CreateReviewResponseSchema>
export type ReviewMetrics = z.infer<typeof ReviewMetricsSchema>