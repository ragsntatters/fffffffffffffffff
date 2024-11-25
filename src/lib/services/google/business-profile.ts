import { google } from 'googleapis'
import { config } from '../../../config'
import { logger } from '../../../utils/logger'
import { ApiError } from '../../../utils/errors'

const mybusiness = google.mybusiness('v4')

class GoogleBusinessProfileService {
  private auth: any

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials: config.google.credentials,
      scopes: [
        'https://www.googleapis.com/auth/business.manage',
        'https://www.googleapis.com/auth/business.reviews'
      ]
    })
  }

  async getLocations() {
    try {
      const authClient = await this.auth.getClient()
      const response = await mybusiness.accounts.locations.list({
        auth: authClient,
        parent: `accounts/${config.google.accountId}`
      })

      return response.data.locations || []
    } catch (error) {
      logger.error('Failed to get GBP locations:', error)
      throw new ApiError('Failed to fetch Google Business Profile locations', 500)
    }
  }

  async getLocation(locationId: string) {
    try {
      const authClient = await this.auth.getClient()
      const response = await mybusiness.accounts.locations.get({
        auth: authClient,
        name: `locations/${locationId}`
      })

      return response.data
    } catch (error) {
      logger.error(`Failed to get GBP location ${locationId}:`, error)
      throw new ApiError('Failed to fetch Google Business Profile location', 500)
    }
  }

  async getReviews(locationId: string) {
    try {
      const authClient = await this.auth.getClient()
      const response = await mybusiness.accounts.locations.reviews.list({
        auth: authClient,
        parent: `locations/${locationId}`
      })

      return response.data.reviews || []
    } catch (error) {
      logger.error(`Failed to get reviews for location ${locationId}:`, error)
      throw new ApiError('Failed to fetch Google Business Profile reviews', 500)
    }
  }

  async replyToReview(locationId: string, reviewId: string, comment: string) {
    try {
      const authClient = await this.auth.getClient()
      const response = await mybusiness.accounts.locations.reviews.updateReply({
        auth: authClient,
        name: `locations/${locationId}/reviews/${reviewId}`,
        requestBody: {
          comment
        }
      })

      return response.data
    } catch (error) {
      logger.error(`Failed to reply to review ${reviewId}:`, error)
      throw new ApiError('Failed to post review reply', 500)
    }
  }

  async createPost(locationId: string, post: {
    summary: string
    callToAction?: {
      actionType: string
      url: string
    }
    media?: Array<{
      mediaFormat: string
      sourceUrl: string
    }>
  }) {
    try {
      const authClient = await this.auth.getClient()
      const response = await mybusiness.accounts.locations.localPosts.create({
        auth: authClient,
        parent: `locations/${locationId}`,
        requestBody: {
          languageCode: 'en-US',
          ...post
        }
      })

      return response.data
    } catch (error) {
      logger.error(`Failed to create post for location ${locationId}:`, error)
      throw new ApiError('Failed to create Google Business Profile post', 500)
    }
  }

  async deletePost(locationId: string, postId: string) {
    try {
      const authClient = await this.auth.getClient()
      await mybusiness.accounts.locations.localPosts.delete({
        auth: authClient,
        name: `locations/${locationId}/localPosts/${postId}`
      })
    } catch (error) {
      logger.error(`Failed to delete post ${postId}:`, error)
      throw new ApiError('Failed to delete Google Business Profile post', 500)
    }
  }

  async getInsights(locationId: string, metric: string) {
    try {
      const authClient = await this.auth.getClient()
      const response = await mybusiness.accounts.locations.reportInsights({
        auth: authClient,
        name: `locations/${locationId}`,
        requestBody: {
          locationNames: [`locations/${locationId}`],
          basicRequest: {
            metricRequests: [{ metric }],
            timeRange: {
              startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              endTime: new Date().toISOString()
            }
          }
        }
      })

      return response.data
    } catch (error) {
      logger.error(`Failed to get insights for location ${locationId}:`, error)
      throw new ApiError('Failed to fetch Google Business Profile insights', 500)
    }
  }
}

export const googleBusinessProfile = new GoogleBusinessProfileService()