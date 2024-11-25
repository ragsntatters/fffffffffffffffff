import app from './app'
import { config } from './config'
import { logger } from './utils/logger'
import { initRedis } from './lib/redis'
import { gracefulShutdown as shutdownQueues } from './lib/queue'
import { initializeScheduler } from './lib/reports/scheduler'
import { initializeSocketServer } from './lib/notifications/socket'
import { initializeAPM } from './monitoring/apm'

async function startServer() {
  try {
    // Initialize APM
    if (config.env === 'production') {
      initializeAPM()
    }

    // Initialize Redis
    await initRedis()

    // Initialize report scheduler
    await initializeScheduler()

    // Start HTTP server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`)
    })

    // Initialize WebSocket server
    const io = initializeSocketServer(server)

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down server...')
      
      await shutdownQueues()

      server.close(() => {
        logger.info('HTTP server closed')
      })

      io.close(() => {
        logger.info('WebSocket server closed')
      })

      process.exit(0)
    }

    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)

  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()