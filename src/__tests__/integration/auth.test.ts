import { TestClient } from '../utils/test-client'
import { prisma } from '../../lib/prisma'
import { createUser } from '../factories/user.factory'
import { hashPassword } from '../../lib/password'

describe('Auth API', () => {
  const client = new TestClient()

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await client.post('/api/auth/register', {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      })

      expect(response.status).toBe(201)
      expect(response.body.data.user).toHaveProperty('id')
      expect(response.body.data.token).toBeDefined()
    })

    it('should not register with existing email', async () => {
      const user = createUser()
      await prisma.user.create({ data: user })

      const response = await client.post('/api/auth/register', {
        email: user.email,
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      })

      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const password = 'password123'
      const user = createUser({
        password: await hashPassword(password),
        isEmailVerified: true
      })
      await prisma.user.create({ data: user })

      const response = await client.post('/api/auth/login', {
        email: user.email,
        password
      })

      expect(response.status).toBe(200)
      expect(response.body.data.token).toBeDefined()
    })

    it('should not login with invalid credentials', async () => {
      const response = await client.post('/api/auth/login', {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      })

      expect(response.status).toBe(401)
    })
  })
})