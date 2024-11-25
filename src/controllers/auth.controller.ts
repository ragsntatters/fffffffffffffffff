import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { hashPassword, verifyPassword } from '../lib/password'
import { generateToken, generateVerificationToken, generateResetToken } from '../lib/jwt'
import { sendVerificationEmail, sendPasswordResetEmail } from '../lib/email'
import { ApiError } from '../utils/errors'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, lastName } = req.body

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new ApiError('Email already registered', 400)
    }

    const hashedPassword = await hashPassword(password)
    const verificationToken = generateVerificationToken()

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        verificationToken
      }
    })

    await sendVerificationEmail(email, verificationToken)

    const token = generateToken({ userId: user.id, email: user.email })
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    })

    res.status(201).json({
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token: session.token
      }
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new ApiError('Invalid credentials', 401)
    }

    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', 401)
    }

    if (!user.isEmailVerified) {
      throw new ApiError('Please verify your email address', 401)
    }

    const token = generateToken({ userId: user.id, email: user.email })
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    res.json({
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token: session.token
      }
    })
  } catch (error) {
    next(error)
  }
}

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query

    const user = await prisma.user.findFirst({
      where: { verificationToken: token as string }
    })

    if (!user) {
      throw new ApiError('Invalid verification token', 400)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null
      }
    })

    res.json({
      message: 'Email verified successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Return success even if user doesn't exist for security
      return res.json({
        message: 'If an account exists, you will receive a password reset email'
      })
    }

    const resetToken = generateResetToken()
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    await sendPasswordResetEmail(email, resetToken)

    res.json({
      message: 'If an account exists, you will receive a password reset email'
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password } = req.body

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      throw new ApiError('Invalid or expired reset token', 400)
    }

    const hashedPassword = await hashPassword(password)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    // Invalidate all existing sessions
    await prisma.session.deleteMany({
      where: { userId: user.id }
    })

    res.json({
      message: 'Password reset successful'
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (token) {
      await prisma.session.delete({
        where: { token }
      })
    }

    res.json({
      message: 'Logout successful'
    })
  } catch (error) {
    next(error)
  }
}