// ... existing imports ...
import { wordPressApi } from '../wordpress/api'

class SocialPostService {
  // ... existing methods ...

  private async publishToWordPress(post: Post, location: any): Promise<PostResult> {
    try {
      // Upload media first if exists
      let mediaId
      if (post.media?.[0]) {
        const mediaResponse = await wordPressApi.uploadMedia({
          file: post.media[0].file,
          filename: post.media[0].filename,
          mimeType: post.media[0].contentType
        })
        mediaId = mediaResponse.id
      }

      const response = await wordPressApi.createPost({
        title: post.title,
        content: post.content,
        status: 'publish',
        featured_media: mediaId,
        meta: {
          location_id: location.id,
          location_name: location.name,
          gbp_tracker_post_id: post.id
        }
      })

      return {
        platform: 'wordpress',
        success: true,
        postId: response.id
      }
    } catch (error) {
      throw new ApiError('Failed to publish to WordPress', 500)
    }
  }

  async publishPost(post: Post, location: any): Promise<PostResult[]> {
    const results: PostResult[] = []

    // Process media first if exists
    let mediaIds: Record<string, string> = {}
    if (post.media && post.media.length > 0) {
      mediaIds = await this.processMedia(post, location)
    }

    // Publish to each platform
    for (const platform of post.platforms) {
      try {
        switch (platform) {
          case 'google':
            results.push(await this.publishToGoogle(post, location))
            break
          case 'facebook':
            results.push(await this.publishToFacebook(post, location, mediaIds.facebook))
            break
          case 'instagram':
            results.push(await this.publishToInstagram(post, location, mediaIds.instagram))
            break
          case 'wordpress':
            results.push(await this.publishToWordPress(post, location))
            break
        }
      } catch (error) {
        logger.error(`Failed to publish to ${platform}:`, error)
        results.push({
          platform,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return results
  }
}