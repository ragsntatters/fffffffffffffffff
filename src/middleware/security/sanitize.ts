import { Request, Response, NextFunction } from 'express'
import sanitizeHtml from 'sanitize-html'
import { isObject } from '../../utils/type-guards'

const sanitizeOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
  allowedAttributes: {
    'a': ['href', 'target']
  },
  allowedSchemes: ['http', 'https', 'mailto']
}

function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    return sanitizeHtml(value, sanitizeOptions)
  }
  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item))
  }
  if (isObject(value)) {
    return Object.keys(value).reduce((acc, key) => ({
      ...acc,
      [key]: sanitizeValue(value[key])
    }), {})
  }
  return value
}

export function sanitizeRequest(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    req.body = sanitizeValue(req.body)
  }
  if (req.query) {
    req.query = sanitizeValue(req.query)
  }
  if (req.params) {
    req.params = sanitizeValue(req.params)
  }
  next()
}