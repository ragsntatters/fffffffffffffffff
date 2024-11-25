import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { ApiError } from '../../utils/errors'

export function validateRequest(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = {
        body: req.body,
        query: req.query,
        params: req.params
      }

      await schema.parseAsync(data)
      next()
    } catch (error) {
      if (error.errors) {
        next(new ApiError('Validation failed', 400, error.errors))
      } else {
        next(error)
      }
    }
  }
}

export function validateBody(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error.errors) {
        next(new ApiError('Invalid request body', 400, error.errors))
      } else {
        next(error)
      }
    }
  }
}

export function validateQuery(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.query)
      next()
    } catch (error) {
      if (error.errors) {
        next(new ApiError('Invalid query parameters', 400, error.errors))
      } else {
        next(error)
      }
    }
  }
}

export function validateParams(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.params)
      next()
    } catch (error) {
      if (error.errors) {
        next(new ApiError('Invalid path parameters', 400, error.errors))
      } else {
        next(error)
      }
    }
  }
}