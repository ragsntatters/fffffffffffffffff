import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  VStack,
  HStack,
  Box,
  Badge,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Avatar,
  Link,
} from '@chakra-ui/react'
import { FaFacebook, FaInstagram, FaWordpress, FaGoogle } from 'react-icons/fa'

interface PostModalProps {
  post: any
  isOpen: boolean
  onClose: () => void
}

export const PostModal = ({ post, isOpen, onClose }: PostModalProps) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'green'
      case 'pending': return 'yellow'
      case 'rejected': return 'red'
      default: return 'gray'
    }
  }

  // Mock performance metrics for published posts
  const metrics = {
    google: { views: 245, clicks: 32, change: 12 },
    facebook: { likes: 56, shares: 8, comments: 12, change: 15 },
    instagram: { likes: 89, comments: 15, saves: 23, change: 8 },
    wordpress: { views: 167, comments: 5, change: -3 }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack justify="space-between">
            <Text>{post.title}</Text>
            <Badge colorScheme={getStatusColor(post.status)}>
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            <Image
              src={post.image}
              alt={post.title}
              borderRadius="md"
              objectFit="cover"
              maxH="300px"
              w="100%"
            />

            <Box>
              <Text>{post.content}</Text>
            </Box>

            <HStack>
              <Avatar size="sm" name={post.author} src={post.authorAvatar} />
              <Box>
                <Text fontSize="sm" fontWeight="bold">{post.author}</Text>
                <Text fontSize="xs" color="gray.500">{post.role}</Text>
              </Box>
            </HStack>

            <Box>
              <Text fontSize="sm" color="gray.500">
                Posted: {post.postedAt}
                {post.lastModified && ` • Last modified: ${post.lastModified}`}
              </Text>
            </Box>

            {post.status === 'rejected' && (
              <Box bg="red.50" p={4} borderRadius="md">
                <Text fontWeight="bold" color="red.600">Rejection Reason:</Text>
                <Text color="red.600">{post.rejectionNote}</Text>
              </Box>
            )}

            {post.status === 'published' && (
              <>
                <Divider />
                <Text fontWeight="bold" mb={4}>Performance Metrics</Text>
                
                {post.platforms?.includes('google') && (
                  <Box mb={4}>
                    <HStack mb={2}>
                      <FaGoogle />
                      <Text fontWeight="bold">Google Business Profile</Text>
                    </HStack>
                    <SimpleGrid columns={3} spacing={4}>
                      <Stat>
                        <StatLabel>Views</StatLabel>
                        <StatNumber>{metrics.google.views}</StatNumber>
                        <StatHelpText>
                          <StatArrow type={metrics.google.change >= 0 ? 'increase' : 'decrease'} />
                          {Math.abs(metrics.google.change)}%
                        </StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel>Clicks</StatLabel>
                        <StatNumber>{metrics.google.clicks}</StatNumber>
                      </Stat>
                    </SimpleGrid>
                  </Box>
                )}

                {post.platforms?.includes('facebook') && (
                  <Box mb={4}>
                    <HStack mb={2}>
                      <FaFacebook />
                      <Text fontWeight="bold">Facebook</Text>
                    </HStack>
                    <SimpleGrid columns={3} spacing={4}>
                      <Stat>
                        <StatLabel>Likes</StatLabel>
                        <StatNumber>{metrics.facebook.likes}</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>Shares</StatLabel>
                        <StatNumber>{metrics.facebook.shares}</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>Comments</StatLabel>
                        <StatNumber>{metrics.facebook.comments}</StatNumber>
                      </Stat>
                    </SimpleGrid>
                  </Box>
                )}

                {post.platforms?.includes('instagram') && (
                  <Box mb={4}>
                    <HStack mb={2}>
                      <FaInstagram />
                      <Text fontWeight="bold">Instagram</Text>
                    </HStack>
                    <SimpleGrid columns={3} spacing={4}>
                      <Stat>
                        <StatLabel>Likes</StatLabel>
                        <StatNumber>{metrics.instagram.likes}</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>Comments</StatLabel>
                        <StatNumber>{metrics.instagram.comments}</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>Saves</StatLabel>
                        <StatNumber>{metrics.instagram.saves}</StatNumber>
                      </Stat>
                    </SimpleGrid>
                  </Box>
                )}

                {post.platforms?.includes('wordpress') && (
                  <Box mb={4}>
                    <HStack mb={2}>
                      <FaWordpress />
                      <Text fontWeight="bold">WordPress</Text>
                    </HStack>
                    <SimpleGrid columns={3} spacing={4}>
                      <Stat>
                        <StatLabel>Views</StatLabel>
                        <StatNumber>{metrics.wordpress.views}</StatNumber>
                        <StatHelpText>
                          <StatArrow type={metrics.wordpress.change >= 0 ? 'increase' : 'decrease'} />
                          {Math.abs(metrics.wordpress.change)}%
                        </StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel>Comments</StatLabel>
                        <StatNumber>{metrics.wordpress.comments}</StatNumber>
                      </Stat>
                    </SimpleGrid>
                  </Box>
                )}
              </>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}