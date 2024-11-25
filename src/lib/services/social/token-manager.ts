import { prisma } from '../../prisma'
import { encrypt, decrypt } from '../../utils/encryption'
import { ApiError } from '../../utils/errors'
import { logger } from '../../utils/logger'
import { retry } from '../../utils/retry'

interface FacebookTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export class SocialTokenManager {
  private static readonly TOKEN_REFRESH_THRESHOLD = 24 * 60 * 60 * 1000 // 24 hours

  static async exchangeFacebookToken(shortLivedToken: string): Promise<string> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?` +
        `grant_type=fb_exchange_token&` +
        `client_id=${process.env.FACEBOOK_APP_ID}&` +
        `client_secret=${process.env.FACEBOOK_APP_SECRET}&` +
        `fb_exchange_token=${shortLivedToken}`
      )

      if (!response.ok) {
        throw new Error('Failed to exchange Facebook token')
      }

      const data: FacebookTokenResponse = await response.json()
      return data.access_token
    } catch (error) {
      logger.error('Failed to exchange Facebook token:', error)
      throw new ApiError('Failed to exchange Facebook token', 500)
    }
  }

  static async storeSocialTokens(userId: string, tokens: {
    facebookToken?: string
    facebookPageToken?: string
    instagramToken?: string
  }) {
    try {
      const encryptedTokens = {
        facebookToken: tokens.facebookToken ? encrypt(tokens.facebookToken) : undefined,
        facebookPageToken: tokens.facebookPageToken ? encrypt(tokens.facebookPageToken) : undefined,
        instagramToken: tokens.instagramToken ? encrypt(tokens.instagramToken) : undefined
      }

      await prisma.socialTokens.upsert({
        where: { userId },
        create: {
          userId,
          ...encryptedTokens,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        update: {
          ...encryptedTokens,
          updatedAt: new Date()
        }
      })
    } catch (error) {
      logger.error('Failed to store social tokens:', error)
      throw new ApiError('Failed to store social tokens', 500)
    }
  }

  static async getValidToken(userId: string, platform: 'facebook' | 'instagram'): Promise<string> {
    return retry(
      async () => {
        const tokens = await prisma.socialTokens.findUnique({
          where: { userId }
        })

        if (!tokens) {
          throw new ApiError('No social tokens found', 404)
        }

        const tokenField = platform === 'facebook' ? 'facebookToken' : 'instagramToken'
        const encryptedToken = tokens[tokenField]

        if (!encryptedToken) {
          throw new ApiError(`No ${platform} token found`, 404)
        }

        const token = decrypt(encryptedToken)

        // Check if token needs refresh
        if (this.needsRefresh(tokens.updatedAt)) {
          return await this.refreshToken(userId, platform)
        }

        return token
      },
      {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 5000,
        onRetry: (error, attempt) => {
          logger.warn(`Retry attempt ${attempt} to get valid token:`, error)
        }
      }
    )
  }

  private static needsRefresh(lastUpdate: Date): boolean {
    const timeSinceUpdate = Date.now() - lastUpdate.getTime()
    return timeSinceUpdate >= this.TOKEN_REFRESH_THRESHOLD
  }

  private static async refreshToken(userId: string, platform: 'facebook' | 'instagram'): Promise<string> {
    try {
      const tokens = await prisma.socialTokens.findUnique({
        where: { userId }
      })

      if (!tokens) {
        throw new ApiError('No social tokens found', 404)
      }

      if (platform === 'facebook') {
        const currentToken = decrypt(tokens.facebookToken!)
        const newToken = await this.exchangeFacebookToken(currentToken)
        
        await this.storeSocialTokens(userId, {
          facebookToken: newToken,
          facebookPageToken: tokens.facebookPageToken ? decrypt(tokens.facebookPageToken) : undefined,
          instagramToken: tokens.instagramToken ? decrypt(tokens.instagramToken) : undefined
        })

        return newToken
      } else {
        // Instagram tokens are typically long-lived and tied to Facebook Page tokens
        // Return existing token
        return decrypt(tokens.instagramToken!)
      }
    } catch (error) {
      logger.error(`Failed to refresh ${platform} token:`, error)
      throw new ApiError(`Failed to refresh ${platform} token`, 500)
    }
  }
}