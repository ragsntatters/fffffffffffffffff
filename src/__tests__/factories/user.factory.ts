import { faker } from '@faker-js/faker'
import { User, UserRole } from '@prisma/client'

export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: UserRole.user,
    avatar: faker.image.avatar(),
    isEmailVerified: true,
    verificationToken: null,
    resetToken: null,
    resetTokenExpiry: null,
    lastLogin: null,
    stripeCustomerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }
}