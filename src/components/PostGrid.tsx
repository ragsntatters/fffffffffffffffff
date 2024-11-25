import { useState, useRef, useEffect } from 'react'
import { 
  SimpleGrid,
  Box,
  Image,
  Text,
  Button,
  HStack,
  IconButton,
  Tooltip,
  Link,
  Badge,
  VStack,
  useDisclosure,
  Avatar
} from '@chakra-ui/react'
import { FaCheck, FaTimes, FaFacebook, FaInstagram, FaWordpress, FaGoogle } from 'react-icons/fa'
import { PostModal } from './PostModal'

interface PostGridProps {
  posts: any[]
  approvePost: (id: number) => void
  openRejectModal: (post: any) => void
}

export const PostGrid = ({ posts, approvePost, openRejectModal }: PostGridProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedPost, setSelectedPost] = useState(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new ResizeObserver
    observerRef.current = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to avoid the loop limit
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return
        }
        // Handle resize if needed
      })
    })

    // Start observing
    if (gridRef.current) {
      observerRef.current.observe(gridRef.current)
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const handlePostClick = (post) => {
    setSelectedPost(post)
    onOpen()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'green'
      case 'pending': return 'yellow'
      case 'rejected': return 'red'
      default: return 'gray'
    }
  }

  return (
    <SimpleGrid 
      ref={gridRef}
      columns={{ base: 1, md: 2, lg: 3 }} 
      spacing={6}
    >
      {posts.map((post) => (
        <Box 
          key={post.id} 
          borderWidth="1px" 
          borderRadius="lg" 
          overflow="hidden"
          bg="white"
          onClick={() => handlePostClick(post)}
          cursor="pointer"
          transition="transform 0.2s"
          _hover={{ transform: 'translateY(-2px)' }}
        >
          <Image
            src={post.image}
            alt={post.title}
            height="200px"
            width="100%"
            objectFit="cover"
          />
          
          <Box p={4}>
            <HStack justify="space-between" mb={2}>
              <Badge colorScheme={getStatusColor(post.status)}>
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </Badge>
              <HStack spacing={2}>
                {post.status === 'published' && (
                  <>
                    <Tooltip label="View on Google Business Profile">
                      <Link href={post.urls?.google} isExternal onClick={(e) => e.stopPropagation()}>
                        <Box as={FaGoogle} color="gray.600" _hover={{ color: 'blue.500' }} />
                      </Link>
                    </Tooltip>
                    <Tooltip label="View on Facebook">
                      <Link href={post.urls?.facebook} isExternal onClick={(e) => e.stopPropagation()}>
                        <Box as={FaFacebook} color="gray.600" _hover={{ color: 'blue.500' }} />
                      </Link>
                    </Tooltip>
                    <Tooltip label="View on Instagram">
                      <Link href={post.urls?.instagram} isExternal onClick={(e) => e.stopPropagation()}>
                        <Box as={FaInstagram} color="gray.600" _hover={{ color: 'blue.500' }} />
                      </Link>
                    </Tooltip>
                    <Tooltip label="View on WordPress">
                      <Link href={post.urls?.wordpress} isExternal onClick={(e) => e.stopPropagation()}>
                        <Box as={FaWordpress} color="gray.600" _hover={{ color: 'blue.500' }} />
                      </Link>
                    </Tooltip>
                  </>
                )}
              </HStack>
            </HStack>

            <VStack align="stretch" spacing={3}>
              <Text fontWeight="bold" fontSize="lg">{post.title}</Text>
              <Text noOfLines={2} color="gray.600">{post.content}</Text>
              
              <HStack spacing={4}>
                <Avatar size="sm" name={post.author} src={post.authorAvatar} />
                <Box>
                  <Text fontSize="sm">{post.author}</Text>
                  <Text fontSize="xs" color="gray.500">{post.postedAt}</Text>
                </Box>
              </HStack>

              {post.status === 'rejected' && post.rejectionNote && (
                <Box bg="red.50" p={3} borderRadius="md">
                  <Text fontSize="sm" color="red.600" fontWeight="medium">
                    Rejection Reason:
                  </Text>
                  <Text fontSize="sm" color="red.700">
                    {post.rejectionNote}
                  </Text>
                </Box>
              )}

              {post.status === 'pending' && (
                <HStack spacing={2} mt={2}>
                  <Button
                    size="sm"
                    colorScheme="green"
                    leftIcon={<FaCheck />}
                    onClick={(e) => {
                      e.stopPropagation()
                      approvePost(post.id)
                    }}
                    flex={1}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    leftIcon={<FaTimes />}
                    onClick={(e) => {
                      e.stopPropagation()
                      openRejectModal(post)
                    }}
                    flex={1}
                  >
                    Reject
                  </Button>
                </HStack>
              )}
            </VStack>
          </Box>
        </Box>
      ))}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </SimpleGrid>
  )
}