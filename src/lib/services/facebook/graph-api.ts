import { config } from '../../../config'
import { logger } from '../../../utils/logger'
import { ApiError } from '../../../utils/errors'

class FacebookGraphService {
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
      logger.error('Facebook Graph API error:', error)
      throw new ApiError('Facebook API request failed', 500)
    }
  }

  async getPage(pageId: string) {
    return this.request(`/${pageId}?access_token=${this.accessToken}`)
  }

  async createPost(pageId: string, post: {
    message: string
    link?: string
    published?: boolean
    scheduled_publish_time?: number
  }) {
    return this.request(`/${pageId}/feed`, {
      method: 'POST',
      body: JSON.stringify({
        ...post,
        access_token: this.accessToken
      })
    })
  }

  async uploadPhoto(pageId: string, imageUrl: string, caption?: string) {
    return this.request(`/${pageId}/photos`, {
      method: 'POST',
      body: JSON.stringify({
        url: imageUrl,
        caption,
        access_token: this.accessToken
      })
    })
  }

  async getPostInsights(postId: string, metrics: string[]) {
    return this.request(
      `/${postId}/insights?metric=${metrics.join(',')}&access_token=${this.accessToken}`
    )
  }

  async deletePost(postId: string) {
    return this.request(`/${postId}`, {
      method: 'DELETE',
      body: JSON.stringify({
        access_token: this.accessToken
      })
    })
  }

  async getPageInsights(pageId: string, metrics: string[], period: string = 'day') {
    return this.request(
      `/${pageId}/insights?metric=${metrics.join(',')}&period=${period}&access_token=${this.accessToken}`
    )
  }
}

export const facebookGraph = new FacebookGraphService()