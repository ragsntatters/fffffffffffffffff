import { faker } from '@faker-js/faker'
import { Location } from '@prisma/client'

export function createLocation(overrides: Partial<Location> = {}): Location {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    placeId: `ChIJ${faker.string.alphanumeric(24)}`,
    address: faker.location.streetAddress(),
    latitude: parseFloat(faker.location.latitude()),
    longitude: parseFloat(faker.location.longitude()),
    phone: faker.phone.number(),
    website: faker.internet.url(),
    timezone: 'America/Los_Angeles',
    primaryCategory: 'Restaurant',
    categories: ['Restaurant', 'Cafe'],
    metadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }
}