import { z } from 'zod'

export const KeywordSchema = z.object({
  id: z.string(),
  locationId: z.string(),
  term: z.string(),
  gridSize: z.string(),
  radius: z.number(),
  unit: z.enum(['km', 'mi']),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const RankingSchema = z.object({
  id: z.string(),
  keywordId: z.string(),
  rank: z.number(),
  previousRank: z.number().nullable(),
  avgAGR: z.number(),
  ATGR: z.number(),
  SoLV: z.number(),
  date: z.string(),
  metadata: z.record(z.unknown()).nullable()
})

export const CompetitorRankingSchema = z.object({
  id: z.string(),
  keywordId: z.string(),
  placeId: z.string(),
  name: z.string(),
  rank: z.number(),
  previousRank: z.number().nullable(),
  date: z.string(),
  metadata: z.record(z.unknown()).nullable()
})

export const CreateKeywordSchema = z.object({
  locationId: z.string(),
  term: z.string(),
  gridSize: z.string().optional(),
  radius: z.number(),
  unit: z.enum(['km', 'mi'])
})

export const UpdateKeywordSchema = CreateKeywordSchema.partial()

export type Keyword = z.infer<typeof KeywordSchema>
export type Ranking = z.infer<typeof RankingSchema>
export type CompetitorRanking = z.infer<typeof CompetitorRankingSchema>
export type CreateKeywordInput = z.infer<typeof CreateKeywordSchema>
export type UpdateKeywordInput = z.infer<typeof UpdateKeywordSchema>