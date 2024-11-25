// Cache key patterns for different entities
export const cacheKeys = {
  location: {
    detail: (id: string) => `location:${id}`,
    list: (page: number = 1) => `locations:page:${page}`,
    reviews: (id: string, page: number = 1) => `location:${id}:reviews:${page}`,
    posts: (id: string, page: number = 1) => `location:${id}:posts:${page}`,
    metrics: (id: string) => `location:${id}:metrics`,
    all: 'location:*'
  },
  review: {
    detail: (id: string) => `review:${id}`,
    list: (locationId: string, page: number = 1) => `reviews:location:${locationId}:page:${page}`,
    metrics: (locationId: string) => `reviews:metrics:${locationId}`,
    all: 'review:*'
  },
  post: {
    detail: (id: string) => `post:${id}`,
    list: (locationId: string, page: number = 1) => `posts:location:${locationId}:page:${page}`,
    metrics: (id: string) => `post:${id}:metrics`,
    all: 'post:*'
  },
  keyword: {
    detail: (id: string) => `keyword:${id}`,
    list: (locationId: string, page: number = 1) => `keywords:location:${locationId}:page:${page}`,
    rankings: (id: string) => `keyword:${id}:rankings`,
    all: 'keyword:*'
  },
  user: {
    detail: (id: string) => `user:${id}`,
    preferences: (id: string) => `user:${id}:preferences`,
    permissions: (id: string) => `user:${id}:permissions`,
    all: 'user:*'
  }
}