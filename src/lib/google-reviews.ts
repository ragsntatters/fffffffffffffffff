import { Client } from '@googlemaps/google-maps-services-js'
import { config } from '../config'
import type { Review } from '../types/review'

const client = new Client({})

export async function fetchLocationReviews(placeId: string) {
  const response = await client.placeDetails({
    params: {
      place_id: placeId,
      key: config.google.apiKey,
      fields: ['reviews']
    }
  })

  return response.data.result.reviews || []
}

export async function postReviewResponse(
  placeId: string,
  reviewId: string,
  text: string
) {
  // Note: This is a placeholder. The actual implementation will depend on
  // the Google Business Profile API credentials and setup
  const response = await fetch(
    `https://business.googleapis.com/v1/${placeId}/reviews/${reviewId}/reply`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.google.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comment: text })
    }
  )

  if (!response.ok) {
    throw new Error('Failed to post review response')
  }

  return response.json()
}

export async function deleteReviewResponse(placeId: string, reviewId: string) {
  // Note: This is a placeholder. The actual implementation will depend on
  // the Google Business Profile API credentials and setup
  const response = await fetch(
    `https://business.googleapis.com/v1/${placeId}/reviews/${reviewId}/reply`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${config.google.accessToken}`
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to delete review response')
  }
}