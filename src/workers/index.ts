import { startEmailWorker } from './email.worker'
import { startReportWorker } from './report.worker'
import { startKeywordTrackingWorker } from './keyword-tracking.worker'
import { startSocialPostWorker } from './social-post.worker'
import { logger } from '../utils/logger'

async function startWorkers() {
  try {
    startEmailWorker()
    startReportWorker()
    startKeywordTrackingWorker()
    startSocialPostWorker()
    
    logger.info('All workers started successfully')

    // Handle process termination
    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)
  } catch (error) {
    logger.error('Failed to start workers:', error)
    process.exit(1)
  }
}

async function shutdown() {
  logger.info('Shutting down workers...')
  process.exit(0)
}

startWorkers()