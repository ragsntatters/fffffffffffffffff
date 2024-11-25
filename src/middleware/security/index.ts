import { Router } from 'express'
import { csrfProtection, setCsrfToken } from './csrf'
import { sanitizeRequest } from './sanitize'
import { validateApiKey } from './api-key'
import { checkIpBlocking } from './ip-blocking'
import { securityHeaders, handleCspViolation } from './headers'

const router = Router()

// Apply security middleware in the correct order
router.use(securityHeaders)
router.use(checkIpBlocking)
router.use(sanitizeRequest)
router.use(setCsrfToken)
router.use(csrfProtection)

// API routes that require API key validation
router.use('/api/v1', validateApiKey)

// CSP violation reporting endpoint
router.post('/api/csp-report', handleCspViolation)

export default router