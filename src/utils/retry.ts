interface RetryOptions {
  retries?: number
  minTimeout?: number
  maxTimeout?: number
  factor?: number
  onRetry?: (error: Error, attempt: number) => void
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    retries = 3,
    minTimeout = 1000,
    maxTimeout = 10000,
    factor = 2,
    onRetry = () => {}
  } = options

  let lastError: Error
  let attempt = 0

  while (attempt < retries) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      attempt++

      if (attempt === retries) {
        break
      }

      onRetry(lastError, attempt)

      const timeout = Math.min(
        minTimeout * Math.pow(factor, attempt - 1),
        maxTimeout
      )

      await new Promise(resolve => setTimeout(resolve, timeout))
    }
  }

  throw lastError!
}