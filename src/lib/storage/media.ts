import path from 'path'
import crypto from 'crypto'
import { s3Storage } from './s3'
import { imageProcessor } from './image'
import { logger } from '../../utils/logger'
import { ApiError } from '../../utils/errors'

const ALLOWED_TYPES = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'image/avif': ['avif'],
  'video/mp4': ['mp4'],
  'video/webm': ['webm']
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export class MediaService {
  private generateKey(filename: string, prefix: string = ''): string {
    const ext = path.extname(filename)
    const hash = crypto.randomBytes(8).toString('hex')
    const key = `${hash}-${Date.now()}${ext}`
    return prefix ? `${prefix}/${key}` : key
  }

  private validateFile(file: Express.Multer.File) {
    if (!ALLOWED_TYPES[file.mimetype]) {
      throw new ApiError('Unsupported file type', 400)
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError('File too large', 400)
    }
  }

  async uploadImage(file: Express.Multer.File, options: {
    prefix?: string
    generateThumbnail?: boolean
    optimize?: boolean
  } = {}) {
    try {
      this.validateFile(file)

      let buffer = file.buffer
      let metadata = {}

      if (file.mimetype.startsWith('image/')) {
        if (options.optimize) {
          const optimized = await imageProcessor.optimizeForWeb(buffer)
          buffer = optimized.buffer
          metadata = optimized.metadata
        }

        const key = this.generateKey(file.originalname, options.prefix)
        const result = await s3Storage.upload(key, buffer, {
          contentType: 'image/webp',
          metadata: {
            originalName: file.originalname,
            ...metadata
          }
        })

        if (options.generateThumbnail) {
          const thumbnail = await imageProcessor.generateThumbnail(buffer)
          const thumbnailKey = `thumbnails/${key}`
          await s3Storage.upload(thumbnailKey, thumbnail.buffer, {
            contentType: 'image/webp',
            metadata: thumbnail.metadata
          })
          result.thumbnail = {
            key: thumbnailKey,
            url: `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${thumbnailKey}`
          }
        }

        return result
      }

      throw new ApiError('Invalid image file', 400)
    } catch (error) {
      logger.error('Media upload error:', error)
      throw error
    }
  }

  async uploadVideo(file: Express.Multer.File, options: {
    prefix?: string
  } = {}) {
    try {
      this.validateFile(file)

      if (file.mimetype.startsWith('video/')) {
        const key = this.generateKey(file.originalname, options.prefix)
        return s3Storage.upload(key, file.buffer, {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname
          }
        })
      }

      throw new ApiError('Invalid video file', 400)
    } catch (error) {
      logger.error('Media upload error:', error)
      throw error
    }
  }

  async deleteMedia(key: string) {
    try {
      await s3Storage.delete(key)

      // Also delete thumbnail if it exists
      if (!key.startsWith('thumbnails/')) {
        const thumbnailKey = `thumbnails/${key}`
        await s3Storage.delete(thumbnailKey).catch(() => {})
      }
    } catch (error) {
      logger.error('Media delete error:', error)
      throw error
    }
  }

  getSignedUrl(key: string) {
    return s3Storage.getSignedUrl(key)
  }
}

export const mediaService = new MediaService()