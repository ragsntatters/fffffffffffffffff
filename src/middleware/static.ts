import express from 'express'
import { join } from 'path'

// Serve static files with caching headers
export const staticMiddleware = express.static(join(__dirname, '../../public'), {
  maxAge: '1d', // Cache static assets for 1 day
  etag: true,
  lastModified: true
})