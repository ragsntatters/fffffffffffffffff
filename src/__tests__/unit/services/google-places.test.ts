import { Client } from '@googlemaps/google-maps-services-js'
import { getPlaceDetails, searchNearbyPlaces } from '../../../lib/google-places'

jest.mock('@googlemaps/google-maps-services-js')

describe('Google Places Service', () => {
  const mockClient = new Client()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPlaceDetails', () => {
    it('should fetch and format place details', async () => {
      const mockResponse = {
        data: {
          result: {
            name: 'Test Place',
            formatted_address: '123 Test St',
            geometry: {
              location: {
                lat: 37.7749,
                lng: -122.4194
              }
            },
            formatted_phone_number: '(555) 555-5555',
            website: 'https://example.com',
            utc_offset: -420,
            types: ['restaurant', 'food'],
            photos: [
              {
                photo_reference: 'photo123'
              }
            ]
          }
        }
      }

      ;(mockClient.placeDetails as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getPlaceDetails('test-place-id')

      expect(result).toMatchObject({
        placeId: 'test-place-id',
        name: 'Test Place',
        address: '123 Test St',
        latitude: 37.7749,
        longitude: -122.4194
      })
    })

    it('should handle missing optional fields', async () => {
      const mockResponse = {
        data: {
          result: {
            name: 'Test Place',
            formatted_address: '123 Test St',
            geometry: {
              location: {
                lat: 37.7749,
                lng: -122.4194
              }
            },
            types: ['restaurant'],
            utc_offset: -420
          }
        }
      }

      ;(mockClient.placeDetails as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getPlaceDetails('test-place-id')

      expect(result.phone).toBeNull()
      expect(result.website).toBeNull()
      expect(result.photos).toHaveLength(0)
    })
  })

  describe('searchNearbyPlaces', () => {
    it('should search and return nearby places', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              place_id: 'place1',
              name: 'Place 1'
            },
            {
              place_id: 'place2',
              name: 'Place 2'
            }
          ]
        }
      }

      ;(mockClient.placesNearby as jest.Mock).mockResolvedValue(mockResponse)

      const result = await searchNearbyPlaces({
        latitude: 37.7749,
        longitude: -122.4194,
        radius: 1000,
        type: 'restaurant'
      })

      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('placeId', 'place1')
    })
  })
})