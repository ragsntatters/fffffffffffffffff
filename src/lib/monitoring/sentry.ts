import * as Sentry from '@sentry/node'
import { config } from '../../config'

export function initializeSentry() {
  if (config.monitoring.sentryDsn) {
    Sentry.init({
      dsn: config.monitoring.sentryDsn,
      environment: config.env,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Prisma({ client: prisma })
      ],
      tracesSampleRate: 1.0
    })
  }
}

export function captureError(error: Error, context?: Record<string, any>) {
  if (config.monitoring.sentryDsn) {
    Sentry.captureException(error, { extra: context })
  }
}