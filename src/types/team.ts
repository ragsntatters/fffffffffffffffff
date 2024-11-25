import { z } from 'zod'

export const TeamMemberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  locationId: z.string(),
  role: z.enum(['admin', 'editor', 'viewer']),
  permissions: z.object({
    canManageTeam: z.boolean(),
    canManageSettings: z.boolean(),
    canPublishPosts: z.boolean(),
    canApproveResponses: z.boolean(),
    canTrackKeywords: z.boolean(),
    canViewAnalytics: z.boolean()
  }),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string()
  }),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const AddTeamMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer']),
  permissions: z.object({
    canManageTeam: z.boolean(),
    canManageSettings: z.boolean(),
    canPublishPosts: z.boolean(),
    canApproveResponses: z.boolean(),
    canTrackKeywords: z.boolean(),
    canViewAnalytics: z.boolean()
  })
})

export const UpdateTeamMemberSchema = z.object({
  role: z.enum(['admin', 'editor', 'viewer']).optional(),
  permissions: z.object({
    canManageTeam: z.boolean(),
    canManageSettings: z.boolean(),
    canPublishPosts: z.boolean(),
    canApproveResponses: z.boolean(),
    canTrackKeywords: z.boolean(),
    canViewAnalytics: z.boolean()
  }).optional()
})

export type TeamMember = z.infer<typeof TeamMemberSchema>
export type AddTeamMemberInput = z.infer<typeof AddTeamMemberSchema>
export type UpdateTeamMemberInput = z.infer<typeof UpdateTeamMemberSchema>