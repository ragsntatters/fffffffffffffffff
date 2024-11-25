import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  try {
    // Create admin user
    const adminPassword = await hash('admin123', 12)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isEmailVerified: true
      }
    })

    // Create test users
    const userPassword = await hash('user123', 12)
    const user = await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: userPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        isEmailVerified: true
      }
    })

    // Create test location
    const location = await prisma.location.create({
      data: {
        name: 'Downtown Coffee Shop',
        placeId: 'ChIJ2eUgeAK6j4ARbn5u_wAGqWA',
        address: '123 Main Street, Seattle, WA 98101',
        latitude: 47.6062,
        longitude: -122.3321,
        phone: '(206) 555-0123',
        website: 'https://example.com',
        timezone: 'America/Los_Angeles',
        primaryCategory: 'Coffee Shop',
        categories: ['Cafe', 'Restaurant'],
        settings: {
          create: {
            notifyOnReviews: true,
            notifyOnRankChanges: true,
            autoApproveResponses: false,
            reviewAlertThreshold: 3,
            rankingAlertThreshold: 5
          }
        },
        photos: {
          create: [
            {
              url: 'https://example.com/photo1.jpg',
              reference: 'photo_ref_1',
              order: 0
            }
          ]
        }
      }
    })

    // Add team members
    await prisma.teamMember.create({
      data: {
        userId: admin.id,
        locationId: location.id,
        role: 'admin',
        status: 'accepted',
        invitedBy: admin.id,
        acceptedAt: new Date(),
        permissions: {
          canManageTeam: true,
          canManageSettings: true,
          canPublishPosts: true,
          canApproveResponses: true,
          canTrackKeywords: true,
          canViewAnalytics: true
        }
      }
    })

    await prisma.teamMember.create({
      data: {
        userId: user.id,
        locationId: location.id,
        role: 'editor',
        status: 'accepted',
        invitedBy: admin.id,
        acceptedAt: new Date(),
        permissions: {
          canManageTeam: false,
          canManageSettings: false,
          canPublishPosts: true,
          canApproveResponses: true,
          canTrackKeywords: true,
          canViewAnalytics: true
        }
      }
    })

    // Create test reviews
    await prisma.review.create({
      data: {
        locationId: location.id,
        googleReviewId: 'review_1',
        author: 'John Doe',
        rating: 5,
        text: 'Great coffee and atmosphere!',
        publishedAt: new Date(),
        isVerified: true,
        sentiment: {
          create: {
            score: 0.8,
            magnitude: 0.9,
            topics: ['coffee', 'atmosphere'],
            keywords: ['great', 'coffee', 'atmosphere']
          }
        }
      }
    })

    // Create test keyword tracking
    await prisma.keyword.create({
      data: {
        locationId: location.id,
        term: 'coffee shop',
        radius: 5,
        rankings: {
          create: {
            rank: 3,
            previousRank: 4,
            avgAGR: 85,
            ATGR: 78,
            SoLV: 50,
            date: new Date()
          }
        },
        competitors: {
          create: [
            {
              placeId: 'competitor_1',
              name: 'Competitor Coffee',
              rank: 2,
              previousRank: 2,
              date: new Date()
            }
          ]
        }
      }
    })

    console.log('Seed data created successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed()