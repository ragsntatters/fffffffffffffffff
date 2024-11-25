import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate'
import { authenticate, authorize } from '../middleware/auth'
import {
  syncLocationReviews,
  getLocationReviews,
  respondToReview,
  approveResponse,
  getReviewMetrics
} from '../controllers/review.controller'

const router = Router()

router.use(authenticate)

router.post(
  '/locations/:locationId/sync',
  authorize('admin', 'editor'),
  syncLocationReviews
)

router.get('/locations/:locationId', getLocationReviews)

router.post(
  '/:reviewId/responses',
  [body('text').trim().notEmpty()],
  validate,
  authorize('admin', 'editor'),
  respondToReview
)

router.post(
  '/responses/:responseId/approve',
  authorize('admin'),
  approveResponse
)

router.get(
  '/locations/:locationId/metrics',
  getReviewMetrics
)

export default router