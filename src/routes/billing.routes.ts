import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate'
import { authenticate } from '../middleware/auth'
import {
  createCheckout,
  handleWebhook,
  getBillingPortal,
  getSubscription,
  getInvoices,
  getUsage
} from '../controllers/billing.controller'

const router = Router()

// Public webhook endpoint
router.post(
  '/webhook',
  handleWebhook
)

router.use(authenticate)

router.post(
  '/checkout',
  [
    body('planId').notEmpty(),
    body('quantity').optional().isInt({ min: 1 })
  ],
  validate,
  createCheckout
)

router.get('/portal', getBillingPortal)
router.get('/subscription', getSubscription)
router.get('/invoices', getInvoices)
router.get('/usage', getUsage)

export default router