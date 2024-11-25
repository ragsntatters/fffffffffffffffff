import { config } from '../config'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private prefix: string = '[GBP Tracker]'
  private isDev: boolean = config.isDevelopment

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString()
    return `${this.prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`
  }

  private shouldLog(level: LogLevel): boolean {
    if (level === 'error' || level === 'warn') return true
    return this.isDev
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message), ...args)
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args)
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args)
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), ...args)
    }
  }

  group(label: string): void {
    if (this.isDev) {
      console.group(this.formatMessage('info', label))
    }
  }

  groupEnd(): void {
    if (this.isDev) {
      console.groupEnd()
    }
  }

  table(tabularData: any, properties?: string[]): void {
    if (this.isDev) {
      console.table(tabularData, properties)
    }
  }
}

export const logger = new Logger()