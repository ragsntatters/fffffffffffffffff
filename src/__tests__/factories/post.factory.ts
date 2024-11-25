import { faker } from '@faker-js/faker'
import { Post, PostStatus, Platform } from '@prisma/client'

export function createPost(overrides: Partial<Post> = {}): Post {
  return {
    id: faker.string.uuid(),
    locationId: faker.string.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    status: PostStatus.draft,
    platforms: [Platform.google],
    schedule: null,
    authorId: faker.string.uuid(),
    approverId: null,
    publishedAt: null,
    metadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }
}