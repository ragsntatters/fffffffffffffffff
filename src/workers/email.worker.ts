import { Job } from 'bull'
import { emailQueue } from '../lib/queue'
import { sendNotificationEmail } from '../lib/notifications/email'
import { logger } from '../utils/logger'

interface EmailJobData {
  to: string
  type: string
  data: any
}

export function startEmailWorker() {
  emailQueue.process(async (job: Job<EmailJobData>) => {
    const { to, type, data } = job.data
    logger.info(`Processing email job ${job.id} for ${to}`)

    try {
      await sendNotificationEmail(to, type, data)
      logger.info(`Email sent successfully for job ${job.id}`)
    } catch (error) {
      logger.error(`Failed to send email for job ${job.id}:`, error)
      throw error
    }
  })
}