import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import { redis } from '../lib/redis'
import { stripe } from '../lib/stripe'
import { config } from '../config'

// Mock Prisma
jest.mock('../lib/prisma', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>()
}))

// Mock Redis
jest.mock('../lib/redis', () => ({
  __esModule: true,
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn()
  }
}))

// Mock Stripe
jest.mock('../lib/stripe', () => ({
  __esModule: true,
  stripe: {
    customers: {
      create: jest.fn(),
      update: jest.fn()
    },
    subscriptions: {
      create: jest.fn(),
      update: jest.fn(),
      cancel: jest.fn()
    },
    checkout: {
      sessions: {
        create: jest.fn()
      }
    }
  }
}))

// Mock external APIs
jest.mock('@googlemaps/google-maps-services-js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    placeDetails: jest.fn(),
    placesNearby: jest.fn()
  }))
}))

beforeEach(() => {
  mockReset(redis)
  mockReset(stripe)
})

afterAll(async () => {
  await redis.disconnect()
})