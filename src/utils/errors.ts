export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static badRequest(message: string, code = 'BAD_REQUEST') {
    return new ApiError(message, 400, code)
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    return new ApiError(message, 401, code)
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
    return new ApiError(message, 403, code)
  }

  static notFound(message = 'Not found', code = 'NOT_FOUND') {
    return new ApiError(message, 404, code)
  }

  static conflict(message: string, code = 'CONFLICT') {
    return new ApiError(message, 409, code)
  }

  static tooManyRequests(message = 'Too many requests', code = 'RATE_LIMIT_EXCEEDED') {
    return new ApiError(message, 429, code)
  }

  static internal(message = 'Internal server error', code = 'INTERNAL_ERROR') {
    return new ApiError(message, 500, code)
  }
}