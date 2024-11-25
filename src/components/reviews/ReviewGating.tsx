import {
  VStack,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  SimpleGrid,
  Text,
  Badge,
  Card,
  CardBody,
  HStack,
  Icon,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Select,
  Tooltip
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaStar, FaEnvelope, FaCheck, FaTimes, FaGoogle, FaInfoCircle } from 'react-icons/fa'

const ReviewGating = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedTemplate, setSelectedTemplate] = useState('default')
  const toast = useToast()

  const [reviewRequests, setReviewRequests] = useState([
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      message: 'Thank you for visiting us! We would love to hear about your experience.',
      status: 'completed',
      sentAt: '2024-03-15'
    }
  ])

  const [collectedReviews, setCollectedReviews] = useState([
    {
      id: '1',
      requestId: '1',
      name: 'John Doe',
      email: 'john@example.com',
      rating: 4,
      text: 'Great service and atmosphere! Really enjoyed my visit.',
      status: 'pending',
      submittedAt: '2024-03-15'
    }
  ])

  const templates = {
    default: {
      subject: 'How was your experience with us?',
      message: 'Thank you for choosing us! We would love to hear about your experience. Your feedback helps us serve you better.'
    },
    followUp: {
      subject: 'We value your feedback',
      message: 'We noticed you visited us recently and would really appreciate your feedback. It will only take a minute!'
    },
    custom: {
      subject: '',
      message: ''
    }
  }

  const [formData, setFormData] = useState({
    emails: '',
    subject: templates.default.subject,
    message: templates.default.message
  })

  const handleSendRequests = () => {
    const emails = formData.emails.split('\n').filter(email => email.trim())
    
    const newRequests = emails.map(email => ({
      id: Math.random().toString(36).substr(2, 9),
      email: email.trim(),
      name: '',
      message: formData.message,
      status: 'pending' as const,
      sentAt: new Date().toISOString()
    }))

    setReviewRequests([...reviewRequests, ...newRequests])
    
    toast({
      title: 'Review requests sent',
      description: `Sent to ${emails.length} recipient(s)`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    onClose()
  }

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template)
    if (template !== 'custom') {
      setFormData({
        ...formData,
        subject: templates[template].subject,
        message: templates[template].message
      })
    }
  }

  return (
    <Box>
      <Button leftIcon={<FaEnvelope />} colorScheme="blue" onClick={onOpen} mb={6}>
        Send Review Requests
      </Button>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card>
          <CardBody>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Collected Reviews</Text>
            <VStack spacing={4} align="stretch">
              {collectedReviews.map(review => (
                <Box
                  key={review.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  bg={
                    review.status === 'approved' ? 'green.50' :
                    review.status === 'rejected' ? 'red.50' :
                    'white'
                  }
                >
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="bold">{review.name}</Text>
                    <Badge
                      colorScheme={
                        review.status === 'approved' ? 'green' :
                        review.status === 'rejected' ? 'red' :
                        'yellow'
                      }
                    >
                      {review.status}
                    </Badge>
                  </HStack>
                  
                  <HStack spacing={1} mb={2}>
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        as={FaStar}
                        color={i < review.rating ? 'yellow.400' : 'gray.300'}
                      />
                    ))}
                  </HStack>

                  <Text mb={4}>{review.text}</Text>

                  {review.status === 'pending' && (
                    <HStack spacing={2}>
                      <Tooltip label="Post to Google Business Profile">
                        <Button
                          size="sm"
                          colorScheme="green"
                          leftIcon={<FaGoogle />}
                          onClick={() => {
                            setCollectedReviews(reviews =>
                              reviews.map(r =>
                                r.id === review.id ? { ...r, status: 'approved' as const } : r
                              )
                            )
                            toast({
                              title: "Review Approved",
                              description: "Review has been posted to Google Business Profile",
                              status: "success",
                              duration: 3000,
                              isClosable: true,
                            })
                          }}
                        >
                          Approve
                        </Button>
                      </Tooltip>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        leftIcon={<FaTimes />}
                        onClick={() => {
                          setCollectedReviews(reviews =>
                            reviews.map(r =>
                              r.id === review.id ? { ...r, status: 'rejected' as const } : r
                            )
                          )
                          toast({
                            title: "Review Rejected",
                            status: "info",
                            duration: 3000,
                            isClosable: true,
                          })
                        }}
                      >
                        Reject
                      </Button>
                    </HStack>
                  )}
                </Box>
              ))}

              {collectedReviews.length === 0 && (
                <Text color="gray.500" textAlign="center">
                  No reviews collected yet
                </Text>
              )}
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Recent Requests</Text>
            <VStack spacing={4} align="stretch">
              {reviewRequests.map(request => (
                <Box
                  key={request.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                >
                  <HStack justify="space-between" mb={2}>
                    <Text>{request.email}</Text>
                    <Badge
                      colorScheme={request.status === 'completed' ? 'green' : 'yellow'}
                    >
                      {request.status}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    Sent: {new Date(request.sentAt).toLocaleDateString()}
                  </Text>
                </Box>
              ))}

              {reviewRequests.length === 0 && (
                <Text color="gray.500" textAlign="center">
                  No review requests sent yet
                </Text>
              )}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Review Requests</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Template</FormLabel>
                <Select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                >
                  <option value="default">Default Template</option>
                  <option value="followUp">Follow-up Template</option>
                  <option value="custom">Custom Message</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email Addresses</FormLabel>
                <Textarea
                  value={formData.emails}
                  onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                  placeholder="Enter email addresses (one per line)"
                  rows={4}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Subject</FormLabel>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Enter email subject"
                  isDisabled={selectedTemplate !== 'custom'}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter your message"
                  rows={6}
                  isDisabled={selectedTemplate !== 'custom'}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSendRequests}
              isDisabled={!formData.emails.trim() || !formData.subject.trim() || !formData.message.trim()}
            >
              Send Requests
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default ReviewGating