import { Router } from 'express'
import multer from 'multer'
import { body } from 'express-validator'
import { validate } from '../middleware/validate'
import { authenticate, authorize } from '../middleware/auth'
import {
  createPost,
  getPosts,
  updatePost,
  approvePost,
  rejectPost
} from '../controllers/post.controller'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10
  }
})

router.use(authenticate)

router.post(
  '/',
  upload.array('media', 10),
  [
    body('locationId').notEmpty(),
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('platforms').isArray().notEmpty(),
    body('schedule').optional().isISO8601()
  ],
  validate,
  authorize('admin', 'editor'),
  createPost
)

router.get('/locations/:locationId', getPosts)

router.patch(
  '/:id',
  upload.array('media', 10),
  [
    body('title').optional().trim().notEmpty(),
    body('content').optional().trim().notEmpty(),
    body('platforms').optional().isArray(),
    body('schedule').optional().isISO8601()
  ],
  validate,
  authorize('admin', 'editor'),
  updatePost
)

router.post(
  '/:id/approve',
  authorize('admin'),
  approvePost
)

router.post(
  '/:id/reject',
  [body('reason').trim().notEmpty()],
  validate,
  authorize('admin'),
  rejectPost
)

export default router