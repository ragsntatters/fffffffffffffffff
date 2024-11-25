import { Request, Response, NextFunction } from 'express'
import { mediaService } from '../lib/storage/media'
import { ApiError } from '../utils/errors'

export const uploadMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files || [req.file]
    if (!files || files.length === 0) {
      throw new ApiError('No files provided', 400)
    }

    const results = await Promise.all(
      (Array.isArray(files) ? files : [files]).map(async (file) => {
        if (file.mimetype.startsWith('image/')) {
          return mediaService.uploadImage(file, {
            prefix: req.body.prefix,
            generateThumbnail: req.body.generateThumbnail === 'true',
            optimize: req.body.optimize !== 'false'
          })
        } else if (file.mimetype.startsWith('video/')) {
          return mediaService.uploadVideo(file, {
            prefix: req.body.prefix
          })
        }
        throw new ApiError('Unsupported file type', 400)
      })
    )

    res.status(201).json({
      message: 'Files uploaded successfully',
      data: Array.isArray(files) ? results : results[0]
    })
  } catch (error) {
    next(error)
  }
}

export const getMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { key } = req.params
    const signedUrl = await mediaService.getSignedUrl(key)

    res.json({
      data: {
        url: signedUrl
      }
    })
  } catch (error) {
    next(error)
  }
}

export const deleteMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { key } = req.params
    await mediaService.deleteMedia(key)

    res.json({
      message: 'Media deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}