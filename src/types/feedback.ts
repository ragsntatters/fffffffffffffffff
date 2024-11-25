export interface CustomerReview {
  id: string
  author: string
  rating: number
  text: string
  date: string
  reply: string | null
  avatarUrl: string
  isVerified: boolean // True if Google confirms the reviewer visited/purchased
  status: 'active' | 'pending' | 'replied'
}

export interface FeedbackStats {
  totalReviews: number
  averageRating: number
  responseRate: number
  averageResponseTime: string
  ratingDistribution: Record<number, number>
  trends: {
    reviews: number
    rating: number
    responseRate: number
  }
  verifiedReviews: {
    total: number
    percentage: number
  }
}