import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { uploadMedia, deleteMedia } from '../lib/storage'
import { publishToSocialMedia } from '../lib/social'
import { ApiError } from '../utils/errors'
import type { CreatePostInput, UpdatePostInput } from '../types/post'

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const { locationId, title, content, platforms, schedule } = req.body as CreatePostInput
    const files = req.files as Express.Multer.File[]

    const location = await prisma.location.findFirst({
      where: {
        id: locationId,
        users: { some: { id: userId } }
      }
    })

    if (!location) {
      throw new ApiError('Location not found', 404)
    }

    // Upload media files
    const media = await Promise.all(
      files.map(async (file, index) => {
        const key = `posts/${locationId}/${Date.now()}-${index}`
        const result = await uploadMedia(file.buffer, file.mimetype, key)
        return {
          type: file.mimetype.startsWith('video/') ? 'video' : 'image',
          ...result,
          order: index
        }
      })
    )

    const post = await prisma.post.create({
      data: {
        locationId,
        title,
        content,
        platforms,
        schedule: schedule ? new Date(schedule) : undefined,
        authorId: userId,
        status: schedule ? 'scheduled' : 'pending',
        media: {
          create: media
        }
      },
      include: {
        media: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    res.status(201).json({
      message: 'Post created successfully',
      data: post
    })
  } catch (error) {
    next(error)
  }
}

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId } = req.params
    const userId = req.user!.id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const status = req.query.status as string

    const location = await prisma.location.findFirst({
      where: {
        id: locationId,
        users: { some: { id: userId } }
      }
    })

    if (!location) {
      throw new ApiError('Location not found', 404)
    }

    const where = {
      locationId,
      ...(status ? { status } : {})
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          media: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          approver: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          metrics: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.post.count({ where })
    ])

    res.json({
      data: posts,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const updates = req.body as UpdatePostInput
    const files = req.files as Express.Multer.File[]

    const post = await prisma.post.findFirst({
      where: {
        id,
        OR: [
          { authorId: userId },
          { location: { users: { some: { id: userId, role: 'admin' } } } }
        ]
      },
      include: { media: true }
    })

    if (!post) {
      throw new ApiError('Post not found', 404)
    }

    if (post.status === 'published') {
      throw new ApiError('Cannot update published post', 400)
    }

    // Handle media updates
    if (files?.length) {
      // Delete existing media
      await Promise.all(
        post.media.map(media => deleteMedia(media.key))
      )

      // Upload new media
      const media = await Promise.all(
        files.map(async (file, index) => {
          const key = `posts/${post.locationId}/${Date.now()}-${index}`
          const result = await uploadMedia(file.buffer, file.mimetype, key)
          return {
            type: file.mimetype.startsWith('video/') ? 'video' : 'image',
            ...result,
            order: index
          }
        })
      )

      // Update post with new media
      await prisma.postMedia.deleteMany({
        where: { postId: id }
      })

      await prisma.postMedia.createMany({
        data: media.map(m => ({ ...m, postId: id }))
      })
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...updates,
        status: updates.schedule ? 'scheduled' : 'pending'
      },
      include: {
        media: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        approver: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    res.json({
      message: 'Post updated successfully',
      data: updatedPost
    })
  } catch (error) {
    next(error)
  }
}

export const approvePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const post = await prisma.post.findFirst({
      where: {
        id,
        location: { users: { some: { id: userId, role: 'admin' } } }
      },
      include: {
        location: true,
        media: true
      }
    })

    if (!post) {
      throw new ApiError('Post not found', 404)
    }

    if (post.status !== 'pending') {
      throw new ApiError('Post is not pending approval', 400)
    }

    // If scheduled for later, just update status
    if (post.schedule && post.schedule > new Date()) {
      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          status: 'scheduled',
          approverId: userId
        },
        include: {
          media: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          approver: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      })

      return res.json({
        message: 'Post scheduled successfully',
        data: updatedPost
      })
    }

    // Publish to social media
    const results = await publishToSocialMedia(post, post.location)
    const failed = results.filter(r => !r.success)

    if (failed.length === results.length) {
      throw new ApiError('Failed to publish post to any platform', 500)
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        status: 'published',
        approverId: userId,
        publishedAt: new Date()
      },
      include: {
        media: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        approver: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    res.json({
      message: 'Post published successfully',
      data: {
        post: updatedPost,
        publishResults: results
      }
    })
  } catch (error) {
    next(error)
  }
}

export const rejectPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const { reason } = req.body

    const post = await prisma.post.findFirst({
      where: {
        id,
        location: { users: { some: { id: userId, role: 'admin' } } }
      }
    })

    if (!post) {
      throw new ApiError('Post not found', 404)
    }

    if (post.status !== 'pending') {
      throw new ApiError('Post is not pending approval', 400)
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        status: 'rejected',
        approverId: userId,
        metadata: {
          rejectionReason: reason
        }
      },
      include: {
        media: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        approver: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    res.json({
      message: 'Post rejected successfully',
      data: updatedPost
    })
  } catch (error) {
    next(error)
  }
}