import { faker } from '@faker-js/faker'
import { Review, ReviewStatus } from '@prisma/client'

export function createReview(overrides: Partial<Review> = {}): Review {
  return {
    id: faker.string.uuid(),
    locationId: faker.string.uuid(),
    googleReviewId: faker.string.uuid(),
    author: faker.person.fullName(),
    authorPhotoUrl: faker.image.avatar(),
    rating: faker.number.int({ min: 1, max: 5 }),
    text: faker.lorem.paragraph(),
    status: ReviewStatus.active,
    isVerified: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }
}