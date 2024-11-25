import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['admin', 'editor', 'viewer']),
  avatar: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const RegisterInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string()
})

export type User = z.infer<typeof UserSchema>
export type LoginInput = z.infer<typeof LoginInputSchema>
export type RegisterInput = z.infer<typeof RegisterInputSchema>