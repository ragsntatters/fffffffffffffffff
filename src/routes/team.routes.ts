import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate'
import { authenticate, authorize } from '../middleware/auth'
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember
} from '../controllers/team.controller'

const router = Router()

router.use(authenticate)

router.get(
  '/locations/:locationId',
  getTeamMembers
)

router.post(
  '/locations/:locationId',
  [
    body('email').isEmail(),
    body('role').isIn(['admin', 'editor', 'viewer']),
    body('permissions').isObject()
  ],
  validate,
  authorize('admin'),
  addTeamMember
)

router.patch(
  '/locations/:locationId/members/:memberId',
  [
    body('role').optional().isIn(['admin', 'editor', 'viewer']),
    body('permissions').optional().isObject()
  ],
  validate,
  authorize('admin'),
  updateTeamMember
)

router.delete(
  '/locations/:locationId/members/:memberId',
  authorize('admin'),
  removeTeamMember
)

export default router