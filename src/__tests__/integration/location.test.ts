import { TestClient } from '../utils/test-client'
import { prisma } from '../../lib/prisma'
import { createLocation } from '../factories/location.factory'

describe('Location API', () => {
  const client = new TestClient()

  beforeEach(async () => {
    await client.authenticateAs('admin')
  })

  describe('GET /api/locations', () => {
    it('should return list of locations', async () => {
      const location = createLocation()
      await prisma.location.create({ data: location })

      const response = await client.get('/api/locations')

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].id).toBe(location.id)
    })

    it('should paginate results', async () => {
      const locations = Array(15).fill(null).map(() => createLocation())
      await prisma.location.createMany({ data: locations })

      const response = await client.get('/api/locations?page=1&limit=10')

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(10)
      expect(response.body.meta.pagination.totalPages).toBe(2)
    })
  })

  describe('POST /api/locations', () => {
    it('should create a new location', async () => {
      const locationData = {
        placeId: 'ChIJ2eUgeAK6j4ARbn5u_wAGqWA',
        settings: {
          notifyOnReviews: true,
          notifyOnRankChanges: true
        }
      }

      const response = await client.post('/api/locations', locationData)

      expect(response.status).toBe(201)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data.placeId).toBe(locationData.placeId)
    })

    it('should not create duplicate location', async () => {
      const location = createLocation()
      await prisma.location.create({ data: location })

      const response = await client.post('/api/locations', {
        placeId: location.placeId
      })

      expect(response.status).toBe(400)
    })
  })
})