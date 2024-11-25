import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate'
import { authenticate } from '../middleware/auth'
import {
  createReport,
  getReports,
  generateReportNow,
  updateReport,
  deleteReport
} from '../controllers/report.controller'

const router = Router()

router.use(authenticate)

router.post(
  '/',
  [
    body('type').isIn(['keyword_performance', 'review_analytics', 'post_engagement', 'competitor_analysis', 'team_activity', 'custom']),
    body('name').trim().notEmpty(),
    body('locationIds').isArray().notEmpty(),
    body('metrics').isArray().notEmpty(),
    body('dateRange').isObject(),
    body('schedule').optional().isObject()
  ],
  validate,
  createReport
)

router.get('/', getReports)

router.get('/:id/generate', generateReportNow)

router.patch(
  '/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('locationIds').optional().isArray(),
    body('metrics').optional().isArray(),
    body('dateRange').optional().isObject(),
    body('schedule').optional().isObject()
  ],
  validate,
  updateReport
)

router.delete('/:id', deleteReport)

export default router