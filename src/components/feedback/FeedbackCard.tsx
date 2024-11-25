import {
  Box,
  Text,
  HStack,
  Icon,
  Badge,
  Avatar,
  Card,
  CardBody,
  Button,
  Tooltip
} from '@chakra-ui/react'
import { FaStar, FaReply, FaCheckCircle } from 'react-icons/fa'
import type { CustomerReview } from '../../types/feedback'

interface FeedbackCardProps {
  review: CustomerReview
  onReplyClick: (review: CustomerReview) => void
}

const FeedbackCard = ({ review, onReplyClick }: FeedbackCardProps) => (
  <Card>
    <CardBody>
      <HStack spacing={4} mb={4}>
        <Avatar size="md" name={review.author} src={review.avatarUrl} />
        <Box flex={1}>
          <HStack>
            <Text fontWeight="bold">{review.author}</Text>
            {review.isVerified && (
              <Tooltip label="Google has verified this reviewer's visit">
                <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                  <Icon as={FaCheckCircle} boxSize={3} />
                  Verified Visit
                </Badge>
              </Tooltip>
            )}
          </HStack>
          <HStack spacing={1}>
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                as={FaStar}
                color={index < review.rating ? 'yellow.400' : 'gray.300'}
                boxSize={4}
              />
            ))}
          </HStack>
          <Text color="gray.500" fontSize="sm">{review.date}</Text>
        </Box>
      </HStack>

      <Text mb={4}>{review.text}</Text>

      {review.reply && (
        <Box ml={8} mt={4} p={4} bg="gray.50" borderRadius="md">
          <Text fontSize="sm" fontWeight="bold" mb={2}>
            Business Response
          </Text>
          <Text fontSize="sm">{review.reply}</Text>
        </Box>
      )}

      {!review.reply && (
        <Button
          size="sm"
          leftIcon={<FaReply />}
          onClick={() => onReplyClick(review)}
          mt={2}
        >
          Reply
        </Button>
      )}
    </CardBody>
  </Card>
)

export default FeedbackCard