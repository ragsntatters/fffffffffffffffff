import {
  VStack,
  Box,
  Text,
  HStack,
  Avatar,
  Button,
  Icon,
  Badge,
} from '@chakra-ui/react'
import { FaStar, FaReply } from 'react-icons/fa'
import { useState } from 'react'

interface ReviewListProps {
  locationId: string
  onReplyClick: (review: any) => void
}

const ReviewList = ({ locationId, onReplyClick }: ReviewListProps) => {
  // Mock reviews data - in production this would come from an API
  const [reviews] = useState([
    {
      id: '1',
      author: 'John Doe',
      rating: 4,
      text: 'Great service and atmosphere! The staff was very friendly and attentive. Would definitely come back again.',
      date: '2024-03-15',
      reply: null,
      avatarUrl: 'https://bit.ly/dan-abramov',
      isVerified: true
    },
    {
      id: '2',
      author: 'Jane Smith',
      rating: 5,
      text: 'Absolutely fantastic experience! The attention to detail and customer service were outstanding.',
      date: '2024-03-14',
      reply: "Thank you for your wonderful feedback! We're so glad you enjoyed your experience with us.",
      avatarUrl: 'https://bit.ly/kent-c-dodds',
      isVerified: true
    },
    {
      id: '3',
      author: 'Mike Johnson',
      rating: 3,
      text: 'Decent service but room for improvement. The wait times could be shorter.',
      date: '2024-03-13',
      reply: null,
      avatarUrl: 'https://bit.ly/ryan-florence',
      isVerified: false
    }
  ])

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Icon
        key={index}
        as={FaStar}
        color={index < rating ? 'yellow.400' : 'gray.300'}
        boxSize={4}
      />
    ))
  }

  return (
    <VStack spacing={4} align="stretch">
      {reviews.map((review) => (
        <Box
          key={review.id}
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          shadow="sm"
        >
          <HStack spacing={4} mb={4}>
            <Avatar size="md" name={review.author} src={review.avatarUrl} />
            <Box flex={1}>
              <HStack justify="space-between">
                <Text fontWeight="bold">
                  {review.author}
                  {review.isVerified && (
                    <Badge ml={2} colorScheme="green">Verified</Badge>
                  )}
                </Text>
                <Text color="gray.500" fontSize="sm">{review.date}</Text>
              </HStack>
              <HStack spacing={1}>
                {renderStars(review.rating)}
              </HStack>
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
        </Box>
      ))}
    </VStack>
  )
}

export default ReviewList