import { trackKeyword } from '../../../lib/keyword-tracking'
import { createKeyword } from '../../factories/keyword.factory'
import { Client } from '@googlemaps/google-maps-services-js'

jest.mock('@googlemaps/google-maps-services-js')

describe('Keyword Tracking Service', () => {
  const mockClient = new Client()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('trackKeyword', () => {
    it('should track keyword rankings across grid points', async () => {
      const keyword = createKeyword()
      const location = {
        latitude: 37.7749,
        longitude: -122.4194
      }

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

      const result = await trackKeyword(keyword, location)

      expect(result).toHaveProperty('rank')
      expect(result).toHaveProperty('avgAGR')
      expect(result).toHaveProperty('ATGR')
      expect(result).toHaveProperty('SoLV')
      expect(result.competitors).toHaveLength(2)
    })

    it('should handle no results', async () => {
      const keyword = createKeyword()
      const location = {
        latitude: 37.7749,
        longitude: -122.4194
      }

      const mockResponse = {
        data: {
          results: []
        }
      }

      ;(mockClient.placesNearby as jest.Mock).mockResolvedValue(mockResponse)

      const result = await trackKeyword(keyword, location)

      expect(result.rank).toBe(0)
      expect(result.avgAGR).toBe(0)
      expect(result.competitors).toHaveLength(0)
    })
  })
})