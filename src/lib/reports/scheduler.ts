import { prisma } from '../prisma'
import { generateReport } from './generator'
import { sendReportEmail } from '../email'
import { Report } from '../../types/report'
import { CronJob } from 'cron'

const jobs = new Map<string, CronJob>()

export async function scheduleReport(report: Report) {
  if (!report.config.schedule || !report.config.schedule.enabled) {
    return
  }

  const { frequency, dayOfWeek, dayOfMonth, time, timezone } = report.config.schedule
  let cronExpression: string

  // Convert schedule to cron expression
  switch (frequency) {
    case 'daily':
      cronExpression = `0 ${time} * * *`
      break
    case 'weekly':
      cronExpression = `0 ${time} * * ${dayOfWeek}`
      break
    case 'monthly':
      cronExpression = `0 ${time} ${dayOfMonth} * *`
      break
    default:
      throw new Error(`Unsupported frequency: ${frequency}`)
  }

  // Create cron job
  const job = new CronJob(
    cronExpression,
    async () => {
      try {
        // Generate report
        const result = await generateReport(report.config)

        // Update last run time
        await prisma.report.update({
          where: { id: report.id },
          data: {
            lastRun: new Date(),
            nextRun: job.nextDate().toDate()
          }
        })

        // Send report to recipients
        await Promise.all(
          report.config.schedule!.recipients.map(email =>
            sendReportEmail({
              to: email,
              subject: `Scheduled Report: ${report.config.name}`,
              report: result,
              format: report.config.format
            })
          )
        )
      } catch (error) {
        console.error(`Failed to generate scheduled report ${report.id}:`, error)
        
        await prisma.report.update({
          where: { id: report.id },
          data: {
            status: 'error',
            metadata: {
              lastError: error instanceof Error ? error.message : 'Unknown error'
            }
          }
        })
      }
    },
    null,
    true,
    timezone
  )

  jobs.set(report.id, job)

  // Update next run time
  await prisma.report.update({
    where: { id: report.id },
    data: {
      nextRun: job.nextDate().toDate()
    }
  })
}

export function unscheduleReport(reportId: string) {
  const job = jobs.get(reportId)
  if (job) {
    job.stop()
    jobs.delete(reportId)
  }
}

export async function initializeScheduler() {
  // Load all active scheduled reports
  const reports = await prisma.report.findMany({
    where: {
      status: 'active',
      config: {
        path: ['schedule', 'enabled'],
        equals: true
      }
    }
  })

  // Schedule each report
  for (const report of reports) {
    await scheduleReport(report)
  }
}