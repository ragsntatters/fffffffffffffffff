import { Request, Response, NextFunction } from 'express'
import semver from 'semver'
import { ApiError } from '../utils/errors'

const CURRENT_VERSION = '1.0.0'
const SUPPORTED_VERSIONS = ['1.0.0']

export function apiVersion(req: Request, res: Response, next: NextFunction) {
  const version = req.headers['accept-version'] || CURRENT_VERSION

  // Check if version is valid semver
  if (!semver.valid(version)) {
    throw new ApiError('Invalid API version', 400)
  }

  // Check if version is supported
  if (!SUPPORTED_VERSIONS.includes(version as string)) {
    throw new ApiError('Unsupported API version', 400)
  }

  // Add version to request for use in controllers
  req.apiVersion = version

  // Add deprecation warning header if using old version
  if (version !== CURRENT_VERSION) {
    res.set('Warning', '299 - "This API version is deprecated"')
  }

  next()
}