import { publishToSocialMedia } from '../../../lib/social'
import { createPost } from '../../factories/post.factory'
import { createLocation } from '../../factories/location.factory'

describe('Social Media Service', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('publishToSocialMedia', () => {
    it('should publish to selected platforms', async () => {
      const post = createPost({
        platforms: ['google', 'facebook']
      })
      const location = createLocation()

      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ name: 'google-post-1' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: 'facebook-post-1' })
        })

      const results = await publishToSocialMedia(post, location)

      expect(results).toHaveLength(2)
      expect(results[0].platform).toBe('google')
      expect(results[0].success).toBe(true)
      expect(results[1].platform).toBe('facebook')
      expect(results[1].success).toBe(true)
    })

    it('should handle publishing errors', async () => {
      const post = createPost({
        platforms: ['google', 'facebook']
      })
      const location = createLocation()

      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          statusText: 'Failed to post'
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: 'facebook-post-1' })
        })

      const results = await publishToSocialMedia(post, location)

      expect(results).toHaveLength(2)
      expect(results[0].success).toBe(false)
      expect(results[0].error).toBeDefined()
      expect(results[1].success).toBe(true)
    })
  })
})