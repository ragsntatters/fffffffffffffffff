import { z } from 'zod'

// API Response schemas
export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional()
})

export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number()
})

export const MetaSchema = z.object({
  pagination: PaginationSchema.optional()
})

export const ApiResponseSchema = z.object({
  data: z.unknown(),
  meta: MetaSchema.optional(),
  error: ApiErrorSchema.optional()
})

// Type definitions
export type ApiError = z.infer<typeof ApiErrorSchema>
export type Pagination = z.infer<typeof PaginationSchema>
export type Meta = z.infer<typeof MetaSchema>
export type ApiResponse<T> = {
  data: T
  meta?: Meta
  error?: ApiError
}