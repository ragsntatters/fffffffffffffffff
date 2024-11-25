import { Job } from 'bull'
import { reportQueue } from '../lib/queue'
import { generateReport } from '../lib/reports/generator'
import { exportToPDF, exportToExcel } from '../lib/reports/export'
import { sendNotification } from '../lib/notifications'
import { logger } from '../utils/logger'
import type { ReportConfig } from '../types/report'

interface ReportJobData {
  reportId: string
  userId: string
  config: ReportConfig
}

export function startReportWorker() {
  reportQueue.process(async (job: Job<ReportJobData>) => {
    const { reportId, userId, config } = job.data
    logger.info(`Processing report job ${job.id} for report ${reportId}`)

    try {
      // Generate report data
      const result = await generateReport(config)

      // Export report in configured format
      let exportedReport
      switch (config.format) {
        case 'pdf':
          exportedReport = await exportToPDF({
            title: config.name,
            data: result,
            config
          })
          break
        case 'excel':
          exportedReport = await exportToExcel({
            title: config.name,
            data: result,
            config
          })
          break
      }

      // Store report result
      await prisma.report.update({
        where: { id: reportId },
        data: {
          lastRun: new Date(),
          status: 'completed',
          result: exportedReport
        }
      })

      // Notify user
      await sendNotification(userId, 'report_ready', {
        reportId,
        reportName: config.name
      })

      logger.info(`Report ${reportId} generated successfully`)
    } catch (error) {
      logger.error(`Failed to generate report ${reportId}:`, error)
      throw error
    }
  })
}