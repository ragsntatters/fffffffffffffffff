import { VStack } from '@chakra-ui/react'
import FeedbackCard from './FeedbackCard'
import type { CustomerReview } from '../../types/feedback'

interface FeedbackListProps {
  reviews: CustomerReview[]
  onReplyClick: (review: CustomerReview) => void
  onFlagReview: (reviewId: string) => void
  onMarkAsResolved: (reviewId: string) => void
}

const FeedbackList = ({ reviews, onReplyClick, onFlagReview, onMarkAsResolved }: FeedbackListProps) => (
  <VStack spacing={4} align="stretch">
    {reviews.map((review) => (
      <FeedbackCard
        key={review.id}
        review={review}
        onReplyClick={onReplyClick}
        onFlagReview={onFlagReview}
        onMarkAsResolved={onMarkAsResolved}
      />
    ))}
  </VStack>
)

export default FeedbackList