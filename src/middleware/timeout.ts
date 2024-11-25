import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/errors'

const DEFAULT_TIMEOUT = 30000 // 30 seconds

export function timeout(limit: number = DEFAULT_TIMEOUT) {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeoutId = setTimeout(() => {
      next(new ApiError('Request timeout', 408))
    }, limit)

    res.on('finish', () => {
      clearTimeout(timeoutId)
    })

    next()
  }
}