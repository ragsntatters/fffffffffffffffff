import sharp from 'sharp'
import { logger } from '../../utils/logger'
import { ApiError } from '../../utils/errors'

export interface ImageProcessingOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp' | 'avif'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  background?: string
}

export class ImageProcessor {
  async process(buffer: Buffer, options: ImageProcessingOptions) {
    try {
      let image = sharp(buffer)

      // Get original metadata
      const metadata = await image.metadata()

      // Resize if dimensions provided
      if (options.width || options.height) {
        image = image.resize({
          width: options.width,
          height: options.height,
          fit: options.fit || 'cover',
          background: options.background
        })
      }

      // Convert format if specified
      if (options.format) {
        switch (options.format) {
          case 'jpeg':
            image = image.jpeg({ quality: options.quality || 80 })
            break
          case 'png':
            image = image.png({ quality: options.quality || 80 })
            break
          case 'webp':
            image = image.webp({ quality: options.quality || 80 })
            break
          case 'avif':
            image = image.avif({ quality: options.quality || 80 })
            break
        }
      }

      const processedBuffer = await image.toBuffer()
      const processedMetadata = await image.metadata()

      return {
        buffer: processedBuffer,
        metadata: {
          format: processedMetadata.format,
          width: processedMetadata.width,
          height: processedMetadata.height,
          size: processedBuffer.length,
          originalSize: buffer.length,
          compressionRatio: buffer.length / processedBuffer.length
        }
      }
    } catch (error) {
      logger.error('Image processing error:', error)
      throw new ApiError('Failed to process image', 500)
    }
  }

  async generateThumbnail(buffer: Buffer, size: number = 200) {
    return this.process(buffer, {
      width: size,
      height: size,
      fit: 'cover',
      format: 'webp',
      quality: 80
    })
  }

  async optimizeForWeb(buffer: Buffer) {
    const metadata = await sharp(buffer).metadata()
    const maxDimension = 2048

    let width = metadata.width
    let height = metadata.height

    if (width && height && (width > maxDimension || height > maxDimension)) {
      const ratio = width / height
      if (width > height) {
        width = maxDimension
        height = Math.round(maxDimension / ratio)
      } else {
        height = maxDimension
        width = Math.round(maxDimension * ratio)
      }
    }

    return this.process(buffer, {
      width,
      height,
      format: 'webp',
      quality: 85
    })
  }
}

export const imageProcessor = new ImageProcessor()