import { prisma } from '../prisma'
import { sendNotificationEmail } from './email'
import { sendPushNotification } from './push'
import { sendWebhookNotification } from './webhook'
import { sendSocketNotification } from './socket'
import type { Server } from 'socket.io'
import type { NotificationType } from '../../types/notification'

export async function sendNotification(
  io: Server,
  userId: string,
  type: NotificationType,
  data: any
) {
  // Create notification record
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title: data.title,
      message: data.message,
      data
    }
  })

  // Get user's notification preferences
  const preferences = await prisma.notificationPreferences.findUnique({
    where: { userId }
  })

  if (!preferences) {
    return notification
  }

  // Send email notification if enabled
  if (preferences.email[type]) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (user) {
      await sendNotificationEmail(user.email, type, data)
    }
  }

  // Send push notification if enabled
  if (preferences.push.enabled && preferences.push.token) {
    await sendPushNotification(
      JSON.parse(preferences.push.token),
      type,
      data
    )
  }

  // Send webhook notifications
  if (preferences.webhooks.length > 0) {
    await sendWebhookNotification(type, data)
  }

  // Send real-time notification
  sendSocketNotification(io, userId, type, data)

  return notification
}