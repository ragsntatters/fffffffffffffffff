import {
  Box,
  Text,
  HStack,
  Icon,
  Badge,
  Avatar,
  Card,
  CardBody,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button
} from '@chakra-ui/react'
import { FaStar, FaEllipsisV, FaReply, FaFlag, FaCheck } from 'react-icons/fa'
import type { Review } from '../../types/review'

interface ReviewCardProps {
  review: Review
  onReplyClick: (review: Review) => void
  onFlagReview: (reviewId: string) => void
  onMarkAsResolved: (reviewId: string) => void
}

const ReviewCard = ({ review, onReplyClick, onFlagReview, onMarkAsResolved }: ReviewCardProps) => (
  <Card>
    <CardBody>
      <HStack spacing={4} mb={4}>
        <Avatar size="md" name={review.author} src={review.avatarUrl} />
        <Box flex={1}>
          <HStack justify="space-between">
            <HStack>
              <Text fontWeight="bold">
                {review.author}
              </Text>
              {review.isVerified && (
                <Badge colorScheme="green">Verified</Badge>
              )}
              {review.status === 'flagged' && (
                <Badge colorScheme="red">Flagged</Badge>
              )}
            </HStack>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaEllipsisV />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                {!review.reply && (
                  <MenuItem icon={<FaReply />} onClick={() => onReplyClick(review)}>
                    Reply
                  </MenuItem>
                )}
                {review.status !== 'flagged' && (
                  <MenuItem icon={<FaFlag />} onClick={() => onFlagReview(review.id)}>
                    Flag Review
                  </MenuItem>
                )}
                {review.status === 'flagged' && (
                  <MenuItem icon={<FaCheck />} onClick={() => onMarkAsResolved(review.id)}>
                    Mark as Resolved
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
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

      {!review.reply && review.status !== 'flagged' && (
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

export default ReviewCard