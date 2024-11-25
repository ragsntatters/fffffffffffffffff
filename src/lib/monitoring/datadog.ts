import { datadogLogs } from '@datadog/browser-logs'
import { config } from '../../config'

export function initializeDatadog() {
  if (config.monitoring.datadogApiKey) {
    datadogLogs.init({
      clientToken: config.monitoring.datadogApiKey,
      site: 'datadoghq.com',
      forwardErrorsToLogs: true,
      sampleRate: 100
    })
  }
}

export function logMetric(name: string, value: number, tags: string[] = []) {
  if (config.monitoring.datadogApiKey) {
    datadogLogs.logger.info('metric', { name, value, tags })
  }
}