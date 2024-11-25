import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate'
import { authenticate, authorize } from '../middleware/auth'
import {
  createLocation,
  getLocations,
  getLocation,
  updateLocation,
  deleteLocation
} from '../controllers/location.controller'

const router = Router()

router.use(authenticate)

router.post(
  '/',
  [
    body('placeId').notEmpty(),
    body('settings').optional().isObject()
  ],
  validate,
  createLocation
)

router.get('/', getLocations)

router.get('/:id', getLocation)

router.patch(
  '/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('phone').optional().trim(),
    body('website').optional().trim().isURL(),
    body('primaryCategory').optional().trim().notEmpty(),
    body('categories').optional().isArray(),
    body('settings').optional().isObject(),
    body('metadata').optional().isObject()
  ],
  validate,
  authorize('admin', 'editor'),
  updateLocation
)

router.delete(
  '/:id',
  authorize('admin'),
  deleteLocation
)

export default router