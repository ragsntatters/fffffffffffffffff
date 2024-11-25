import { VStack } from '@chakra-ui/react'
import ReviewCard from './ReviewCard'
import type { Review } from '../../types/review'

interface ReviewListProps {
  reviews: Review[]
  onReplyClick: (review: Review) => void
  onFlagReview: (reviewId: string) => void
  onMarkAsResolved: (reviewId: string) => void
}

const ReviewList = ({ reviews, onReplyClick, onFlagReview, onMarkAsResolved }: ReviewListProps) => (
  <VStack spacing={4} align="stretch">
    {reviews.map((review) => (
      <ReviewCard
        key={review.id}
        review={review}
        onReplyClick={onReplyClick}
        onFlagReview={onFlagReview}
        onMarkAsResolved={onMarkAsResolved}
      />
    ))}
  </VStack>
)

export default ReviewList