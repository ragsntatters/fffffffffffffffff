import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { emailQueue, reportQueue, keywordTrackingQueue, socialPostQueue } from './index'

export function setupQueueMonitor(app: any) {
  const serverAdapter = new ExpressAdapter()
  serverAdapter.setBasePath('/admin/queues')

  createBullBoard({
    queues: [
      new BullAdapter(emailQueue),
      new BullAdapter(reportQueue),
      new BullAdapter(keywordTrackingQueue),
      new BullAdapter(socialPostQueue)
    ],
    serverAdapter
  })

  app.use('/admin/queues', serverAdapter.getRouter())
}