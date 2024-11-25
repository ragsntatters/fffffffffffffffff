import { config } from '../../../config'
import { logger } from '../../../utils/logger'
import { ApiError } from '../../../utils/errors'

class WordPressService {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || ''
    this.apiKey = apiKey || ''
  }

  setCredentials(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    if (!this.baseUrl || !this.apiKey) {
      throw new ApiError('WordPress credentials not configured', 400)
    }

    try {
      const url = `${this.baseUrl}/wp-json/gbp-tracker/v1/${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      logger.error('WordPress API error:', error)
      throw new ApiError('Failed to communicate with WordPress', 500)
    }
  }

  async createPost(post: {
    title: string
    content: string
    status?: 'publish' | 'draft' | 'private'
    categories?: number[]
    tags?: number[]
    featured_media?: number
    meta?: Record<string, any>
  }) {
    return this.request('posts', {
      method: 'POST',
      body: JSON.stringify(post)
    })
  }

  async uploadMedia(file: {
    file: Buffer
    filename: string
    mimeType: string
  }) {
    const formData = new FormData()
    formData.append('file', new Blob([file.file], { type: file.mimeType }), file.filename)

    return this.request('media', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  async getCategories() {
    return this.request('categories')
  }

  async getTags() {
    return this.request('tags')
  }

  async validateConnection(): Promise<boolean> {
    try {
      await this.request('validate')
      return true
    } catch {
      return false
    }
  }
}

export const wordPressApi = new WordPressService()