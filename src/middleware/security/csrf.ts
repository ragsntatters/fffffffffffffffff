import { Request, Response, NextFunction } from 'express'
import { randomBytes } from 'crypto'
import { redis } from '../../lib/redis'
import { ApiError } from '../../utils/errors'
import { config } from '../../config'

const CSRF_HEADER = 'x-csrf-token'
const CSRF_COOKIE = 'csrf-token'
const TOKEN_LENGTH = 32

export async function generateCsrfToken(userId: string): Promise<string> {
  const token = randomBytes(TOKEN_LENGTH).toString('hex')
  await redis.set(`csrf:${userId}:${token}`, '1', 'EX', 3600) // 1 hour expiry
  return token
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip CSRF check for non-mutating methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next()
  }

  // Skip CSRF check for webhook endpoints
  if (req.path.startsWith('/api/webhook')) {
    return next()
  }

  const token = req.headers[CSRF_HEADER] as string
  const cookieToken = req.cookies[CSRF_COOKIE]

  if (!token || !cookieToken || token !== cookieToken) {
    throw new ApiError('Invalid CSRF token', 403)
  }

  next()
}

export async function setCsrfToken(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next()
  }

  const token = await generateCsrfToken(req.user.id)
  
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  })

  // Also send token in response header for SPA to use
  res.setHeader(CSRF_HEADER, token)
  next()
}