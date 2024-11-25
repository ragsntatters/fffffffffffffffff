import { config } from '../../../config'
import { logger } from '../../../utils/logger'
import { ApiError } from '../../../utils/errors'

class InstagramGraphService {
  private baseUrl = 'https://graph.facebook.com/v18.0'
  private accessToken: string

  constructor() {
    this.accessToken = config.facebook.accessToken
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error.message)
      }

      return response.json()
    } catch (error) {
      logger.error('Instagram Graph API error:', error)
      throw new ApiError('Instagram API request failed', 500)
    }
  }

  async getAccount(igUserId: string) {
    return this.request(
      `/${igUserId}?fields=id,username,media_count&access_token=${this.accessToken}`
    )
  }

  async createMediaContainer(igUserId: string, post: {
    image_url?: string
    video_url?: string
    caption?: string
    location_id?: string
  }) {
    return this.request(`/${igUserId}/media`, {
      method: 'POST',
      body: JSON.stringify({
        ...post,
        access_token: this.accessToken
      })
    })
  }

  async publishMedia(igUserId: string, creationId: string) {
    return this.request(`/${igUserId}/media_publish`, {
      method: 'POST',
      body: JSON.stringify({
        creation_id: creationId,
        access_token: this.accessToken
      })
    })
  }

  async getMediaInsights(mediaId: string) {
    return this.request(
      `/${mediaId}/insights?metric=engagement,impressions,reach&access_token=${this.accessToken}`
    )
  }

  async deleteMedia(mediaId: string) {
    return this.request(`/${mediaId}`, {
      method: 'DELETE',
      body: JSON.stringify({
        access_token: this.accessToken
      })
    })
  }

  async getAccountInsights(igUserId: string, metrics: string[], period: string = 'day') {
    return this.request(
      `/${igUserId}/insights?metric=${metrics.join(',')}&period=${period}&access_token=${this.accessToken}`
    )
  }
}

export const instagramGraph = new InstagramGraphService()