import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate'
import { authenticate, authorize } from '../middleware/auth'
import {
  createKeyword,
  getKeywords,
  getKeywordHistory,
  updateKeyword,
  deleteKeyword
} from '../controllers/keyword.controller'

const router = Router()

router.use(authenticate)

router.post(
  '/',
  [
    body('locationId').notEmpty(),
    body('term').trim().notEmpty(),
    body('radius').isFloat({ min: 0.1 }),
    body('unit').isIn(['km', 'mi'])
  ],
  validate,
  authorize('admin', 'editor'),
  createKeyword
)

router.get('/locations/:locationId', getKeywords)

router.get('/:id/history', getKeywordHistory)

router.patch(
  '/:id',
  [
    body('term').optional().trim().notEmpty(),
    body('radius').optional().isFloat({ min: 0.1 }),
    body('unit').optional().isIn(['km', 'mi'])
  ],
  validate,
  authorize('admin', 'editor'),
  updateKeyword
)

router.delete(
  '/:id',
  authorize('admin'),
  deleteKeyword
)

export default router