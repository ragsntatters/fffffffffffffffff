import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export function responseTime(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime()

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start)
    const duration = seconds * 1000 + nanoseconds / 1000000

    if (duration > 1000) { // Log slow requests (>1s)
      logger.warn('Slow request:', {
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`
      })
    }
  })

  next()
}