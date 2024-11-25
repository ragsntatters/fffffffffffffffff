import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { ApiError } from '../utils/errors'
import { logger } from '../utils/logger'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error({
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  })

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code
      }
    })
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.errors
      }
    })
  }

  // Handle Stripe errors
  if (error.type?.startsWith('Stripe')) {
    return res.status(400).json({
      error: {
        message: error.message,
        code: error.type
      }
    })
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      }
    })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      }
    })
  }

  // Default error
  return res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  })
}