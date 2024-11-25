import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardBody,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Badge,
  Select,
  Icon,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Image,
  Input,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Divider
} from '@chakra-ui/react'
import { FaUsers, FaCog, FaStar, FaPhone, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa'
import { LocationTeamModal } from '../components/LocationTeamModal'
import { LocationSettingsModal } from '../components/LocationSettingsModal'
import { PostGrid } from '../components/PostGrid'
import { AddPostModal } from '../components/AddPostModal'
import FeedbackList from '../components/feedback/FeedbackList'
import FeedbackStats from '../components/feedback/FeedbackStats'
import FeedbackReplyModal from '../components/feedback/FeedbackReplyModal'
import AddKeywordModal from '../components/AddKeywordModal'
import KeywordCard from '../components/KeywordCard'
import BusinessMetricsCard from '../components/metrics/BusinessMetricsCard'
import ReviewGating from '../components/reviews/ReviewGating'
import type { CustomerReview } from '../types/feedback'

const IndividualLocation = () => {
  const { id } = useParams()
  const [selectedLocation, setSelectedLocation] = useState(id)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isReviewReplyModalOpen, setIsReviewReplyModalOpen] = useState(false)
  const { isOpen: isKeywordModalOpen, onOpen: onKeywordModalOpen, onClose: onKeywordModalClose } = useDisclosure()
  const [selectedReview, setSelectedReview] = useState<CustomerReview | null>(null)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
    compareStartDate: '',
    compareEndDate: ''
  })

  const [locationData] = useState({
    name: 'Downtown Store',
    address: '123 Main St, City',
    phone: '(555) 123-4567',
    website: 'www.example.com',
    placeId: 'ChIJ2eUgeAK6j4ARbn5u_wAGqWA',
    categories: ['Restaurant', 'Cafe'],
    openingHours: {
      monday: '9:00 AM - 10:00 PM',
      tuesday: '9:00 AM - 10:00 PM',
      wednesday: '9:00 AM - 10:00 PM',
      thursday: '9:00 AM - 10:00 PM',
      friday: '9:00 AM - 11:00 PM',
      saturday: '10:00 AM - 11:00 PM',
      sunday: '10:00 AM - 9:00 PM'
    },
    photos: [
      {
        url: 'https://via.placeholder.com/800x400',
        width: 800,
        height: 400,
        type: 'COVER'
      },
      {
        url: 'https://via.placeholder.com/400x400',
        width: 400,
        height: 400,
        type: 'INTERIOR'
      }
    ],
    attributes: {
      payments: ['Credit Cards', 'Apple Pay', 'Google Pay'],
      accessibility: ['Wheelchair accessible', 'Gender-neutral restroom'],
      amenities: ['Wi-Fi', 'Outdoor seating', 'Power outlets']
    }
  })

  const [performanceData] = useState({
    customerActions: {
      calls: {
        total: 245,
        change: 12,
        data: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: Math.floor(Math.random() * 20) + 5
        }))
      },
      directions: {
        total: 789,
        change: 15,
        data: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: Math.floor(Math.random() * 40) + 15
        }))
      },
      messages: {
        total: 123,
        change: -5,
        data: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: Math.floor(Math.random() * 10) + 2
        }))
      }
    },
    searchQueries: [
      { query: 'coffee shop near me', impressions: 1200, clicks: 89, change: 15 },
      { query: 'best coffee downtown', impressions: 850, clicks: 62, change: 8 },
      { query: 'cafe with wifi', impressions: 650, clicks: 45, change: -3 }
    ],
    photoViews: [
      { photo: 'Storefront', views: 2500, change: 12 },
      { photo: 'Interior', views: 1800, change: 5 },
      { photo: 'Menu', views: 1200, change: -2 }
    ]
  })

  const [businessMetrics] = useState({
    listingStats: {
      maps: {
        current: 402,
        trend: 12,
        clicks: 145,
        clicksTrend: 8,
        data: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: Math.floor(Math.random() * 50) + 350,
          clicks: Math.floor(Math.random() * 20) + 130
        }))
      },
      search: {
        current: 1400,
        trend: 15,
        clicks: 320,
        clicksTrend: 10,
        data: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: Math.floor(Math.random() * 200) + 1200,
          clicks: Math.floor(Math.random() * 50) + 280
        }))
      }
    }
  })

  const [keywordReports] = useState([
    {
      id: 1,
      keyword: "coffee shop",
      location: "123 Main St, Seattle, WA",
      gridSize: "5x5",
      radius: "2",
      unit: "km",
      date: "2024-03-15",
      rank: 3,
      avgAGR: 85,
      ATGR: 78,
      SoLV: 50,
      gridPoints: Array(25).fill(null).map(() => ({
        position: [-122.3321, 47.6062],
        rank: Math.floor(Math.random() * 20) + 1
      }))
    }
  ])

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'New Project Launch',
      content: 'Excited to announce our latest web application!',
      image: 'https://via.placeholder.com/300',
      status: 'published',
      platforms: ['google', 'facebook', 'instagram'],
      urls: {
        google: 'https://business.google.com/posts/l/12345',
        facebook: 'https://facebook.com/post/67890',
        instagram: 'https://instagram.com/p/abcdef'
      },
      author: 'John Doe',
      authorAvatar: 'https://via.placeholder.com/40',
      role: 'Marketing Manager',
      postedAt: '2024-03-15 14:30',
      lastModified: '2024-03-15 15:45',
      locationId: id
    }
  ])

  const [reviews] = useState<CustomerReview[]>([
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
    }
  ])

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

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value)
  }

  const handleAddPost = (newPost: any) => {
    setPosts([...posts, { 
      ...newPost, 
      id: posts.length + 1, 
      status: 'pending',
      locationId: id 
    }])
  }

  const approvePost = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: 'published' } : post
    ))
  }

  const openRejectModal = (post: any) => {
    // Handle post rejection
  }

  const handleReplyClick = (review: CustomerReview) => {
    setSelectedReview(review)
    setIsReviewReplyModalOpen(true)
  }

  const handleReplySubmit = async (reviewId: string, reply: string) => {
    setIsReviewReplyModalOpen(false)
  }

  const handleDateRangeChange = (field: string, value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <VStack spacing={6} align="stretch">
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <HStack>
                    <Image
                      src={locationData.photos[0].url}
                      alt={locationData.name}
                      borderRadius="md"
                      objectFit="cover"
                      maxH="200px"
                      w="100%"
                    />
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box>
                      <HStack mb={2}>
                        <Icon as={FaMapMarkerAlt} color="gray.500" />
                        <Text fontWeight="bold">Address:</Text>
                      </HStack>
                      <Text>{locationData.address}</Text>
                    </Box>

                    <Box>
                      <HStack mb={2}>
                        <Icon as={FaPhone} color="gray.500" />
                        <Text fontWeight="bold">Phone:</Text>
                      </HStack>
                      <Text>{locationData.phone}</Text>
                    </Box>

                    <Box>
                      <HStack mb={2}>
                        <Icon as={FaGlobe} color="gray.500" />
                        <Text fontWeight="bold">Website:</Text>
                      </HStack>
                      <Text>{locationData.website}</Text>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={2}>Categories:</Text>
                      <HStack>
                        {locationData.categories.map(category => (
                          <Badge key={category} colorScheme="blue">
                            {category}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                  </SimpleGrid>

                  <Divider />

                  <Box>
                    <Text fontWeight="bold" mb={2}>Business Hours</Text>
                    <SimpleGrid columns={2} spacing={2}>
                      {Object.entries(locationData.openingHours).map(([day, hours]) => (
                        <HStack key={day} justify="space-between">
                          <Text textTransform="capitalize">{day}:</Text>
                          <Text>{hours}</Text>
                        </HStack>
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  <Box>
                    <Text fontWeight="bold" mb={2}>Business Attributes</Text>
                    <SimpleGrid columns={3} spacing={4}>
                      {Object.entries(locationData.attributes).map(([category, items]) => (
                        <Box key={category}>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </Text>
                          {items.map(item => (
                            <Badge key={item} mr={1} mb={1}>
                              {item}
                            </Badge>
                          ))}
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <BusinessMetricsCard
                title="Business Impressions & Clicks - Maps"
                metrics={businessMetrics.listingStats.maps}
              />
              <BusinessMetricsCard
                title="Business Impressions & Clicks - Search"
                metrics={businessMetrics.listingStats.search}
              />
            </SimpleGrid>
          </VStack>
        )

      case 'performance':
        return (
          <VStack spacing={6} align="stretch">
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="lg" fontWeight="bold">Performance Metrics</Text>
                      <Text color="gray.600">Track your business performance over time</Text>
                    </Box>
                    <HStack spacing={4}>
                      <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" mb={1}>Date Range</Text>
                          <HStack>
                            <Input
                              type="date"
                              value={dateRange.startDate}
                              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                              size="sm"
                            />
                            <Text>to</Text>
                            <Input
                              type="date"
                              value={dateRange.endDate}
                              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                              size="sm"
                            />
                          </HStack>
                        </Box>
                        <Box>
                          <Text fontSize="sm" mb={1}>Compare To</Text>
                          <HStack>
                            <Input
                              type="date"
                              value={dateRange.compareStartDate}
                              onChange={(e) => handleDateRangeChange('compareStartDate', e.target.value)}
                              size="sm"
                            />
                            <Text>to</Text>
                            <Input
                              type="date"
                              value={dateRange.compareEndDate}
                              onChange={(e) => handleDateRangeChange('compareEndDate', e.target.value)}
                              size="sm"
                            />
                          </HStack>
                        </Box>
                      </Stack>
                    </HStack>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">Customer Actions</Heading>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Action</Th>
                          <Th isNumeric>Total</Th>
                          <Th isNumeric>Change</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>Calls</Td>
                          <Td isNumeric>{performanceData.customerActions.calls.total}</Td>
                          <Td isNumeric>
                            <Stat size="sm">
                              <StatHelpText mb={0}>
                                <StatArrow type={performanceData.customerActions.calls.change >= 0 ? 'increase' : 'decrease'} />
                                {Math.abs(performanceData.customerActions.calls.change)}%
                              </StatHelpText>
                            </Stat>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>Directions</Td>
                          <Td isNumeric>{performanceData.customerActions.directions.total}</Td>
                          <Td isNumeric>
                            <Stat size="sm">
                              <StatHelpText mb={0}>
                                <StatArrow type={performanceData.customerActions.directions.change >= 0 ? 'increase' : 'decrease'} />
                                {Math.abs(performanceData.customerActions.directions.change)}%
                              </StatHelpText>
                            </Stat>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>Messages</Td>
                          <Td isNumeric>{performanceData.customerActions.messages.total}</Td>
                          <Td isNumeric>
                            <Stat size="sm">
                              <StatHelpText mb={0}>
                                <StatArrow type={performanceData.customerActions.messages.change >= 0 ? 'increase' : 'decrease'} />
                                {Math.abs(performanceData.customerActions.messages.change)}%
                              </StatHelpText>
                            </Stat>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </VStack>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">Top Search Queries</Heading>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Query</Th>
                          <Th isNumeric>Impressions</Th>
                          <Th isNumeric>Clicks</Th>
                          <Th isNumeric>Change</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {performanceData.searchQueries.map((query, index) => (
                          <Tr key={index}>
                            <Td>{query.query}</Td>
                            <Td isNumeric>{query.impressions}</Td>
                            <Td isNumeric>{query.clicks}</Td>
                            <Td isNumeric>
                              <Stat size="sm">
                                <StatHelpText mb={0}>
                                  <StatArrow type={query.change >= 0 ? 'increase' : 'decrease'} />
                                  {Math.abs(query.change)}%
                                </StatHelpText>
                              </Stat>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </VStack>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">Photo Performance</Heading>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Photo</Th>
                          <Th isNumeric>Views</Th>
                          <Th isNumeric>Change</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {performanceData.photoViews.map((photo, index) => (
                          <Tr key={index}>
                            <Td>{photo.photo}</Td>
                            <Td isNumeric>{photo.views}</Td>
                            <Td isNumeric>
                              <Stat size="sm">
                                <StatHelpText mb={0}>
                                  <StatArrow type={photo.change >= 0 ? 'increase' : 'decrease'} />
                                  {Math.abs(photo.change)}%
                                </StatHelpText>
                              </Stat>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </VStack>
        )

      case 'reviews':
        return (
          <VStack spacing={6} align="stretch">
            <FeedbackStats stats={reviewStats} />
            <Tabs>
              <TabList>
                <Tab>All Reviews</Tab>
                <Tab>Pending Reviews</Tab>
                <Tab>Replied Reviews</Tab>
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
                  <FeedbackList 
                    reviews={reviews.filter(r => !r.reply)}
                    onReplyClick={handleReplyClick}
                    onFlagReview={() => {}}
                    onMarkAsResolved={() => {}}
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <FeedbackList 
                    reviews={reviews.filter(r => r.reply)}
                    onReplyClick={handleReplyClick}
                    onFlagReview={() => {}}
                    onMarkAsResolved={() => {}}
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <ReviewGating />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        )

      case 'posts':
        return (
          <VStack spacing={6} align="stretch">
            <Button colorScheme="blue" onClick={() => setIsPostModalOpen(true)}>
              Create New Post
            </Button>
            <Tabs>
              <TabList>
                <Tab>All Posts</Tab>
                <Tab>Published</Tab>
                <Tab>Pending</Tab>
                <Tab>Rejected</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <PostGrid 
                    posts={posts} 
                    approvePost={approvePost} 
                    openRejectModal={openRejectModal} 
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <PostGrid 
                    posts={posts.filter(post => post.status === 'published')} 
                    approvePost={approvePost} 
                    openRejectModal={openRejectModal} 
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <PostGrid 
                    posts={posts.filter(post => post.status === 'pending')} 
                    approvePost={approvePost} 
                    openRejectModal={openRejectModal} 
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <PostGrid 
                    posts={posts.filter(post => post.status === 'rejected')} 
                    approvePost={approvePost} 
                    openRejectModal={openRejectModal} 
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        )

      case 'keywords':
        return (
          <VStack spacing={6} align="stretch">
            <Button 
              colorScheme="blue" 
              onClick={onKeywordModalOpen}
            >
              Run New Report
            </Button>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {keywordReports.map((report) => (
                <KeywordCard
                  key={report.id}
                  keyword={report}
                  onViewReport={() => {}}
                />
              ))}
            </SimpleGrid>
          </VStack>
        )

      default:
        return null
    }
  }

  const menuItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'performance', label: 'Performance' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'posts', label: 'Posts' },
    { id: 'keywords', label: 'Keywords' }
  ]

  return (
    <Box>
      <Card mb={6}>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Select
                value={selectedLocation}
                onChange={handleLocationChange}
                maxW="300px"
              >
                <option value="1">Downtown Store</option>
                <option value="2">Westside Branch</option>
                <option value="3">North Point</option>
              </Select>
              <HStack>
                <Button leftIcon={<FaUsers />} onClick={() => setIsTeamModalOpen(true)}>
                  Team
                </Button>
                <Button leftIcon={<FaCog />} onClick={() => setIsSettingsModalOpen(true)}>
                  Settings
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <HStack align="start" spacing={6}>
        <VStack
          spacing={2}
          align="stretch"
          minW="200px"
          position="sticky"
          top="20px"
        >
          {menuItems.map(item => (
            <Button
              key={item.id}
              variant={selectedTab === item.id ? 'solid' : 'ghost'}
              colorScheme={selectedTab === item.id ? 'blue' : 'gray'}
              justifyContent="flex-start"
              onClick={() => setSelectedTab(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </VStack>

        <Box flex={1}>
          {renderContent()}
        </Box>
      </HStack>

      <LocationTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        locationId={id || ''}
        locationName={locationData.name}
      />

      <LocationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        locationId={id || ''}
        locationName={locationData.name}
      />

      <AddPostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        addPost={handleAddPost}
        location={{
          name: locationData.name,
          address: locationData.address,
          latitude: 37.7749,
          longitude: -122.4194
        }}
      />

      {selectedReview && (
        <FeedbackReplyModal
          isOpen={isReviewReplyModalOpen}
          onClose={() => setIsReviewReplyModalOpen(false)}
          review={selectedReview}
          onSubmit={handleReplySubmit}
        />
      )}

      <AddKeywordModal
        isOpen={isKeywordModalOpen}
        onClose={onKeywordModalClose}
        onAddKeyword={() => {}}
        location={{
          name: locationData.name,
          address: locationData.address,
          latitude: 37.7749,
          longitude: -122.4194
        }}
      />
    </Box>
  )
}

export default IndividualLocation