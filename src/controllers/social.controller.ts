import { Request, Response, NextFunction } from 'express'
import { SocialTokenManager } from '../lib/services/social/token-manager'
import { ApiError } from '../utils/errors'
import { logger } from '../utils/logger'

export const handleFacebookAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shortLivedToken } = req.body
    const userId = req.user!.id

    // Exchange short-lived token for long-lived token
    const longLivedToken = await SocialTokenManager.exchangeFacebookToken(
      shortLivedToken
    )

    // Store tokens
    await SocialTokenManager.storeSocialTokens(userId, {
      facebookToken: longLivedToken
    })

    // Get list of pages the user manages
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedToken}`
    )

    if (!response.ok) {
      throw new ApiError('Failed to fetch Facebook pages', 500)
    }

    const { data: pages } = await response.json()

    res.json({
      message: 'Facebook authentication successful',
      data: { pages }
    })
  } catch (error) {
    logger.error('Facebook auth error:', error)
    next(error)
  }
}

export const connectInstagramAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pageId } = req.body
    const userId = req.user!.id

    // Get the Facebook token
    const fbToken = await SocialTokenManager.getValidToken(userId, 'facebook')

    // Get Instagram Business Account ID for the page
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${fbToken}`
    )

    if (!response.ok) {
      throw new ApiError('Failed to fetch Instagram account', 500)
    }

    const { instagram_business_account } = await response.json()

    if (!instagram_business_account) {
      throw new ApiError('No Instagram Business Account found for this page', 404)
    }

    // Store Instagram account ID and token (same as page token)
    await SocialTokenManager.storeSocialTokens(userId, {
      instagramToken: fbToken
    })

    res.json({
      message: 'Instagram account connected successfully',
      data: { instagramAccountId: instagram_business_account.id }
    })
  } catch (error) {
    logger.error('Instagram connection error:', error)
    next(error)
  }
}

export const disconnectSocialAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id

    // Clear tokens from database
    await SocialTokenManager.storeSocialTokens(userId, {})

    res.json({
      message: 'Social accounts disconnected successfully'
    })
  } catch (error) {
    logger.error('Social disconnect error:', error)
    next(error)
  }
}