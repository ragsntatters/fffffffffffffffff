import { Server } from 'socket.io'
import { verifyToken } from '../jwt'
import { prisma } from '../prisma'
import type { NotificationType } from '../../types/notification'

export function initializeSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  })

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        throw new Error('Authentication required')
      }

      const decoded = verifyToken(token)
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })

      if (!user) {
        throw new Error('User not found')
      }

      socket.data.user = user
      next()
    } catch (error) {
      next(new Error('Authentication failed'))
    }
  })

  // Handle connections
  io.on('connection', (socket) => {
    const userId = socket.data.user.id

    // Join user's room
    socket.join(`user:${userId}`)

    // Handle disconnection
    socket.on('disconnect', () => {
      socket.leave(`user:${userId}`)
    })
  })

  return io
}

export function sendSocketNotification(
  io: Server,
  userId: string,
  type: NotificationType,
  data: any
) {
  io.to(`user:${userId}`).emit('notification', {
    type,
    data,
    timestamp: new Date().toISOString()
  })
}