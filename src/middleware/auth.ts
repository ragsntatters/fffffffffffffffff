import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt'
import { prisma } from '../lib/prisma'
import { ApiError } from '../utils/errors'

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      throw new ApiError('Unauthorized', 401)
    }

    const decoded = verifyToken(token)
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!session || session.expiresAt < new Date()) {
      throw new ApiError('Session expired', 401)
    }

    req.user = session.user
    next()
  } catch (error) {
    next(new ApiError('Unauthorized', 401))
  }
}

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError('Unauthorized', 401)
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError('Forbidden', 403)
    }

    next()
  }
}