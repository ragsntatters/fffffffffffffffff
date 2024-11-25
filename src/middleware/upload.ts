import multer from 'multer'
import { Request } from 'express'
import { ApiError } from '../utils/errors'

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'video/mp4',
  'video/webm'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const storage = multer.memoryStorage()

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    callback(new ApiError('Unsupported file type', 400))
    return
  }
  callback(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10 // Maximum number of files per request
  }
})

// Middleware for single file upload
export const uploadSingle = (fieldName: string) => upload.single(fieldName)

// Middleware for multiple files upload
export const uploadMultiple = (fieldName: string, maxCount: number = 10) =>
  upload.array(fieldName, maxCount)

// Middleware for multiple fields with different file types
export const uploadFields = (fields: { name: string; maxCount: number }[]) =>
  upload.fields(fields)