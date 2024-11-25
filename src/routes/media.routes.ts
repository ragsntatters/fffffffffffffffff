import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { uploadSingle, uploadMultiple } from '../middleware/upload'
import {
  uploadMedia,
  getMedia,
  deleteMedia
} from '../controllers/media.controller'

const router = Router()

router.use(authenticate)

// Single file upload
router.post(
  '/upload',
  uploadSingle('file'),
  uploadMedia
)

// Multiple files upload
router.post(
  '/upload/multiple',
  uploadMultiple('files', 10),
  uploadMedia
)

// Get media details or signed URL
router.get('/:key', getMedia)

// Delete media
router.delete('/:key', deleteMedia)

export default router