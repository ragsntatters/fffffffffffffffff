import { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import { config } from '../../config'

// CSP directives
const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:", "blob:"],
    connectSrc: ["'self'", config.frontend.url],
    fontSrc: ["'self'", "https:", "data:"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
    sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
    reportUri: '/api/csp-report'
  }
}

// Configure security headers
export const securityHeaders = [
  helmet({
    contentSecurityPolicy,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    expectCt: {
      maxAge: 86400,
      enforce: true
    },
    frameguard: {
      action: "deny"
    },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true
  })
]

// Handle CSP violation reports
export function handleCspViolation(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    logger.warn('CSP Violation:', req.body)
  }
  res.status(204).end()
}