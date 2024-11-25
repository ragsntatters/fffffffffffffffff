import { config } from '../config'
import type { Post, PostMedia } from '../types/post'

interface SocialPostResult {
  platform: 'google' | 'facebook' | 'instagram'
  success: boolean
  postId?: string
  error?: string
}

// Google Business Profile API
async function postToGoogle(post: Post, location: any): Promise<SocialPostResult> {
  try {
    const response = await fetch(
      `https://business.googleapis.com/v1/${location.placeId}/posts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.google.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          languageCode: 'en',
          summary: post.content,
          callToAction: {
            actionType: 'LEARN_MORE',
            url: post.media[0]?.url
          },
          media: post.media.map(media => ({
            mediaFormat: media.type === 'video' ? 'VIDEO' : 'PHOTO',
            sourceUrl: media.url
          }))
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to post to Google Business Profile')
    }

    const data = await response.json()
    return {
      platform: 'google',
      success: true,
      postId: data.name
    }
  } catch (error) {
    return {
      platform: 'google',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Facebook Graph API
async function postToFacebook(post: Post, pageId: string): Promise<SocialPostResult> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/feed`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: post.content,
          access_token: config.facebook.accessToken,
          ...(post.media.length > 0 && {
            attached_media: post.media.map(media => ({
              media_fbid: media.url
            }))
          })
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to post to Facebook')
    }

    const data = await response.json()
    return {
      platform: 'facebook',
      success: true,
      postId: data.id
    }
  } catch (error) {
    return {
      platform: 'facebook',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Instagram Graph API
async function postToInstagram(post: Post, igAccountId: string): Promise<SocialPostResult> {
  try {
    // First, create a media container
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igAccountId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: post.media[0]?.url,
          caption: post.content,
          access_token: config.facebook.accessToken
        })
      }
    )

    if (!mediaResponse.ok) {
      throw new Error('Failed to create Instagram media')
    }

    const mediaData = await mediaResponse.json()

    // Then publish the container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          creation_id: mediaData.id,
          access_token: config.facebook.accessToken
        })
      }
    )

    if (!publishResponse.ok) {
      throw new Error('Failed to publish to Instagram')
    }

    const publishData = await publishResponse.json()
    return {
      platform: 'instagram',
      success: true,
      postId: publishData.id
    }
  } catch (error) {
    return {
      platform: 'instagram',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function publishToSocialMedia(
  post: Post,
  location: any
): Promise<SocialPostResult[]> {
  const results: SocialPostResult[] = []

  if (post.platforms.includes('google')) {
    results.push(await postToGoogle(post, location))
  }

  if (post.platforms.includes('facebook')) {
    results.push(await postToFacebook(post, location.facebookPageId))
  }

  if (post.platforms.includes('instagram')) {
    results.push(await postToInstagram(post, location.instagramAccountId))
  }

  return results
}