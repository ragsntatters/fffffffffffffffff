import compression from 'compression'
import { Request } from 'express'

// Skip compression for small responses
function shouldCompress(req: Request, res: any) {
  if (req.headers['x-no-compression']) {
    return false
  }
  
  // Compress responses larger than 1KB
  return compression.filter(req, res)
}

export const compressionMiddleware = compression({
  filter: shouldCompress,
  threshold: 1024,
  level: 6 // Balanced between speed and compression ratio
})