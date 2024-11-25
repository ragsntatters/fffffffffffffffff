import crypto from 'crypto'
import { prisma } from '../prisma'
import { NotificationType } from '../../types/notification'

function generateSignature(payload: any, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')
}

export async function sendWebhookNotification(
  type: NotificationType,
  data: any
) {
  const webhooks = await prisma.webhook.findMany({
    where: {
      active: true,
      events: {
        has: type
      }
    }
  })

  const payload = {
    type,
    data,
    timestamp: new Date().toISOString()
  }

  return Promise.all(
    webhooks.map(async webhook => {
      const signature = generateSignature(payload, webhook.secret)

      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          throw new Error(`Webhook failed: ${response.statusText}`)
        }

        await prisma.webhookDelivery.create({
          data: {
            webhookId: webhook.id,
            success: true,
            payload,
            response: await response.text()
          }
        })
      } catch (error) {
        await prisma.webhookDelivery.create({
          data: {
            webhookId: webhook.id,
            success: false,
            payload,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        })

        throw error
      }
    })
  )
}