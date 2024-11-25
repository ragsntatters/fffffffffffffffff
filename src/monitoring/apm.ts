import * as Sentry from '@sentry/node'
import newrelic from 'newrelic'
import { config } from '../config'
import { logger } from '../utils/logger'

export function initializeAPM() {
  if (config.env === 'production') {
    // Initialize Sentry
    if (config.monitoring.sentryDsn) {
      Sentry.init({
        dsn: config.monitoring.sentryDsn,
        environment: config.env,
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Sentry.Integrations.Express({ app }),
          new Sentry.Integrations.Prisma({ client: prisma }),
        ],
        tracesSampleRate: 1.0,
      })
    }

    // Initialize New Relic
    if (config.monitoring.newRelicKey) {
      newrelic.instrumentLoadedModule('express', app)
      newrelic.instrumentLoadedModule('@prisma/client', prisma)
    }

    logger.info('APM services initialized')
  }
}

export function captureError(error: Error, context?: Record<string, any>) {
  if (config.env === 'production') {
    Sentry.captureException(error, { extra: context })
    
    if (config.monitoring.newRelicKey) {
      newrelic.noticeError(error, context)
    }
  }
  
  logger.error(error.message, { error, ...context })
}