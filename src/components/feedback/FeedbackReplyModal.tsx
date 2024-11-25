import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  VStack,
  Text,
  HStack,
  Icon,
  Box,
  Badge,
  Avatar,
  useToast
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import type { CustomerReview } from '../../types/feedback'

interface FeedbackReplyModalProps {
  isOpen: boolean
  onClose: () => void
  review: CustomerReview
  onSubmit: (reviewId: string, reply: string) => void
}

const FeedbackReplyModal = ({ isOpen, onClose, review, onSubmit }: FeedbackReplyModalProps) => {
  const [reply, setReply] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const handleSubmit = async () => {
    if (!reply.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(review.id, reply)
      setReply('')
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit reply. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reply to Review</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box p={4} bg="gray.50" borderRadius="md">
              <HStack spacing={4} mb={3}>
                <Avatar size="md" name={review.author} src={review.avatarUrl} />
                <Box>
                  <HStack>
                    <Text fontWeight="bold">{review.author}</Text>
                    {review.isVerified && (
                      <Badge colorScheme="green">Verified</Badge>
                    )}
                  </HStack>
                  <HStack spacing={1}>
                    {[...Array(5)].map((_, index) => (
                      <Icon
                        key={index}
                        as={FaStar}
                        color={index < review.rating ? 'yellow.400' : 'gray.300'}
                        boxSize={3}
                      />
                    ))}
                  </HStack>
                </Box>
                <Text color="gray.500" fontSize="sm" ml="auto">
                  {review.date}
                </Text>
              </HStack>
              <Text>{review.text}</Text>
            </Box>

            <Box>
              <Text mb={2} fontWeight="bold">Your Reply</Text>
              <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply here..."
                minH="150px"
                resize="vertical"
              />
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Submitting"
            isDisabled={!reply.trim()}
          >
            Submit Reply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default FeedbackReplyModal