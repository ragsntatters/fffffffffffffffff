import { useState } from 'react'
import {
  Box,
  useDisclosure,
  useToast,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  HStack,
  Text,
  Badge,
  SimpleGrid
} from '@chakra-ui/react'
import { FaStar, FaSync } from 'react-icons/fa'
import PageHeader from '../components/PageHeader'
import FeedbackList from '../components/feedback/FeedbackList'
import FeedbackStats from '../components/feedback/FeedbackStats'
import FeedbackReplyModal from '../components/feedback/FeedbackReplyModal'
import LocationSelector from '../components/LocationSelector'
import HeroHeader from '../components/HeroHeader'
import ReviewGating from '../components/reviews/ReviewGating'
import type { CustomerReview } from '../types/feedback'

const Reviews = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedLocation, setSelectedLocation] = useState<string>('1')
  const [selectedReview, setSelectedReview] = useState<CustomerReview | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const toast = useToast()

  const locations = [
    { id: '1', name: 'Downtown Store' },
    { id: '2', name: 'Westside Branch' },
    { id: '3', name: 'North Point' }
  ]

  const reviews: CustomerReview[] = [
    {
      id: '1',
      author: 'John Doe',
      rating: 4,
      text: 'Great service and atmosphere! The staff was very friendly and attentive.',
      date: '2024-03-15',
      reply: null,
      avatarUrl: 'https://bit.ly/dan-abramov',
      isVerified: true,
      status: 'active'
    },
    {
      id: '2',
      author: 'Jane Smith',
      rating: 5,
      text: 'Absolutely fantastic experience!',
      date: '2024-03-14',
      reply: "Thank you for your wonderful feedback!",
      avatarUrl: 'https://bit.ly/kent-c-dodds',
      isVerified: true,
      status: 'active'
    }
  ]

  const reviewStats = {
    totalReviews: 157,
    averageRating: 4.7,
    responseRate: 92,
    averageResponseTime: '1.5',
    ratingDistribution: {
      5: 75,
      4: 15,
      3: 5,
      2: 3,
      1: 2
    },
    trends: {
      reviews: 12,
      rating: 0.2,
      responseRate: 5
    }
  }

  const handleReplyClick = (review: CustomerReview) => {
    setSelectedReview(review)
    onOpen()
  }

  const handleReplySubmit = async (reviewId: string, reply: string) => {
    try {
      setIsSyncing(true)
      // API call to post reply to Google Business Profile
      // await googleBusinessProfile.replyToReview(locationId, reviewId, reply)
      
      toast({
        title: "Reply Posted",
        description: "Your response has been posted to Google Business Profile successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply to Google Business Profile. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSyncReviews = async () => {
    try {
      setIsSyncing(true)
      // API call to sync reviews from Google Business Profile
      // await googleBusinessProfile.syncReviews(locationId)
      
      toast({
        title: "Reviews Synced",
        description: "Successfully synced reviews from Google Business Profile.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync reviews. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Filter reviews by status
  const pendingReviews = reviews.filter(review => !review.reply)
  const repliedReviews = reviews.filter(review => review.reply)

  return (
    <Box>
      <HeroHeader 
        icon={FaStar}
        title="Review Management"
        subtitle="Monitor and respond to customer reviews across all your locations. Build your online reputation with timely, professional responses and track your review performance metrics."
      />

      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <LocationSelector
            locations={locations}
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          />
          <Button
            leftIcon={<FaSync />}
            onClick={handleSyncReviews}
            isLoading={isSyncing}
            loadingText="Syncing"
          >
            Sync Reviews
          </Button>
        </HStack>

        <FeedbackStats stats={reviewStats} />
        
        <Box>
          <Tabs>
            <TabList>
              <Tab>All Reviews ({reviews.length})</Tab>
              <Tab>
                Pending Reviews ({pendingReviews.length})
                {pendingReviews.length > 0 && (
                  <Badge ml={2} colorScheme="red">
                    {pendingReviews.length}
                  </Badge>
                )}
              </Tab>
              <Tab>Replied Reviews ({repliedReviews.length})</Tab>
              <Tab>Review Gating</Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <FeedbackList 
                  reviews={reviews}
                  onReplyClick={handleReplyClick}
                  onFlagReview={() => {}}
                  onMarkAsResolved={() => {}}
                />
              </TabPanel>
              <TabPanel px={0}>
                <Text mb={4} color="gray.600">
                  These reviews are waiting for your response. Once you reply, they will be automatically posted to your Google Business Profile.
                </Text>
                <FeedbackList 
                  reviews={pendingReviews}
                  onReplyClick={handleReplyClick}
                  onFlagReview={() => {}}
                  onMarkAsResolved={() => {}}
                />
              </TabPanel>
              <TabPanel px={0}>
                <FeedbackList 
                  reviews={repliedReviews}
                  onReplyClick={() => {}}
                  onFlagReview={() => {}}
                  onMarkAsResolved={() => {}}
                />
              </TabPanel>
              <TabPanel px={0}>
                <ReviewGating />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {selectedReview && (
          <FeedbackReplyModal
            isOpen={isOpen}
            onClose={onClose}
            review={selectedReview}
            onSubmit={handleReplySubmit}
          />
        )}
      </VStack>
    </Box>
  )
}

export default Reviews