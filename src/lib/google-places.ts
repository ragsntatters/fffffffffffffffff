import { Client } from '@googlemaps/google-maps-services-js'
import { config } from '../config'

const client = new Client({})

export interface PlaceDetails {
  placeId: string
  name: string
  address: string
  latitude: number
  longitude: number
  phone?: string | null
  website?: string | null
  timezone: string
  primaryCategory: string
  categories: string[]
  photos: Array<{
    reference: string
    url: string
  }>
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const response = await client.placeDetails({
    params: {
      place_id: placeId,
      key: config.google.apiKey,
      fields: [
        'name',
        'formatted_address',
        'geometry',
        'formatted_phone_number',
        'website',
        'utc_offset',
        'types',
        'photos'
      ]
    }
  })

  const { result } = response.data

  return {
    placeId,
    name: result.name,
    address: result.formatted_address,
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
    phone: result.formatted_phone_number || null,
    website: result.website || null,
    timezone: `UTC${result.utc_offset / 60}`,
    primaryCategory: result.types[0],
    categories: result.types,
    photos: (result.photos || []).map(photo => ({
      reference: photo.photo_reference,
      url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${config.google.apiKey}`
    }))
  }
}

export async function searchNearbyPlaces(params: {
  latitude: number
  longitude: number
  radius: number
  type?: string
  keyword?: string
}) {
  const response = await client.placesNearby({
    params: {
      location: { lat: params.latitude, lng: params.longitude },
      radius: params.radius,
      type: params.type,
      keyword: params.keyword,
      key: config.google.apiKey
    }
  })

  return response.data.results
}