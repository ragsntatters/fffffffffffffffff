import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { ApiError } from '../lib/errors/api-error'
import { logger } from '../utils/logger'
import { captureError } from '../lib/monitoring/sentry'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  logger.error({
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  })

  // Send error to monitoring service
  captureError(error, {
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body
  })

  // Handle API errors
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
        data: error.data
      }
    })
  }

  // Handle validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        data: error.errors
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

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      error: {
        message: 'Database error',
        code: 'DATABASE_ERROR'
      }
    })
  }

  // Default error
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  })
}