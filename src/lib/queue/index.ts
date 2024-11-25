import Bull from 'bull'
import { config } from '../../config'
import { logger } from '../../utils/logger'

// Queue definitions
export const emailQueue = new Bull('email', {
  redis: config.redis.url,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
})

export const reportQueue = new Bull('report', {
  redis: config.redis.url,
  defaultJobOptions: {
    attempts: 2,
    timeout: 300000, // 5 minutes
    removeOnComplete: true,
    removeOnFail: false
  }
})

export const keywordTrackingQueue = new Bull('keyword-tracking', {
  redis: config.redis.url,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
})

export const socialPostQueue = new Bull('social-post', {
  redis: config.redis.url,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
})

// Error handling for all queues
const queues = [emailQueue, reportQueue, keywordTrackingQueue, socialPostQueue]

queues.forEach(queue => {
  queue.on('error', error => {
    logger.error(`Queue ${queue.name} error:`, error)
  })

  queue.on('failed', (job, error) => {
    logger.error(`Job ${job.id} in ${queue.name} failed:`, {
      error: error.message,
      stack: error.stack,
      data: job.data,
      attempts: job.attemptsMade
    })
  })

  queue.on('stalled', jobId => {
    logger.warn(`Job ${jobId} in ${queue.name} is stalled`)
  })
})

export async function gracefulShutdown() {
  logger.info('Shutting down queues...')
  await Promise.all(queues.map(queue => queue.close()))
}