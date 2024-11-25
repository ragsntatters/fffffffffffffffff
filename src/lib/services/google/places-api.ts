import { config } from '../../../config'
import { logger } from '../../../utils/logger'
import { ApiError } from '../../../utils/errors'

class GooglePlacesService {
  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.maps) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.google.apiKey}&libraries=places&callback=initMap`
      script.async = true
      script.defer = true
      script.referrerPolicy = 'origin'

      window.initMap = () => {
        resolve()
      }

      script.onerror = () => reject(new Error('Failed to load Google Maps script'))
      document.head.appendChild(script)
    })
  }

  private async ensureGoogleMapsLoaded() {
    if (!window.google?.maps) {
      await this.loadGoogleMapsScript()
    }
  }

  async searchPlaces(query: string) {
    try {
      await this.ensureGoogleMapsLoaded()

      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      )

      return new Promise((resolve, reject) => {
        service.textSearch(
          { query },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results.map(place => ({
                id: place.place_id,
                name: place.name,
                address: place.formatted_address,
                rating: place.rating,
                reviews: place.user_ratings_total,
                placeId: place.place_id
              })))
            } else {
              reject(new Error('Failed to search places'))
            }
          }
        )
      })
    } catch (error) {
      logger.error('Google Places API error:', error)
      throw new ApiError('Failed to search places', 500)
    }
  }

  async getPlaceDetails(placeId: string) {
    try {
      await this.ensureGoogleMapsLoaded()

      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      )

      return new Promise((resolve, reject) => {
        service.getDetails(
          { 
            placeId,
            fields: [
              'name',
              'formatted_address',
              'geometry',
              'formatted_phone_number',
              'website',
              'utc_offset',
              'types',
              'photos',
              'business_status',
              'opening_hours',
              'price_level',
              'rating',
              'user_ratings_total'
            ]
          },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              resolve({
                placeId,
                name: place.name,
                address: place.formatted_address,
                latitude: place.geometry?.location?.lat(),
                longitude: place.geometry?.location?.lng(),
                phone: place.formatted_phone_number || null,
                website: place.website || null,
                timezone: place.utc_offset ? `UTC${place.utc_offset / 60}` : null,
                primaryCategory: place.types?.[0] || null,
                categories: place.types || [],
                photos: place.photos?.map(photo => ({
                  reference: photo.getUrl(),
                  url: photo.getUrl({ maxWidth: 800 })
                })) || []
              })
            } else {
              reject(new Error('Failed to fetch place details'))
            }
          }
        )
      })
    } catch (error) {
      logger.error('Google Places API error:', error)
      throw new ApiError('Failed to fetch place details', 500)
    }
  }
}

export const googlePlaces = new GooglePlacesService()

// Add type definitions for the Google Maps JavaScript API
declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          PlacesService: any
          PlacesServiceStatus: {
            OK: string
          }
        }
        LatLng: any
      }
    }
    initMap?: () => void
  }
}