import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Text,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { FaStar } from 'react-icons/fa'
import { useState } from 'react'

interface ReviewStatsProps {
  locationId: string
}

const ReviewStats = ({ locationId }: ReviewStatsProps) => {
  // Mock stats data - in production this would come from an API
  const [stats] = useState({
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
  })

  return (
    <Box mb={8}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
        <Box p={5} shadow="sm" borderWidth="1px" borderRadius="lg" bg="white">
          <Stat>
            <StatLabel>Total Reviews</StatLabel>
            <StatNumber>{stats.totalReviews}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.trends.reviews} new this month
            </StatHelpText>
          </Stat>
        </Box>

        <Box p={5} shadow="sm" borderWidth="1px" borderRadius="lg" bg="white">
          <Stat>
            <StatLabel>Average Rating</StatLabel>
            <StatNumber>{stats.averageRating}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.trends.rating} points
            </StatHelpText>
          </Stat>
        </Box>

        <Box p={5} shadow="sm" borderWidth="1px" borderRadius="lg" bg="white">
          <Stat>
            <StatLabel>Response Rate</StatLabel>
            <StatNumber>{stats.responseRate}%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.trends.responseRate}% increase
            </StatHelpText>
          </Stat>
        </Box>

        <Box p={5} shadow="sm" borderWidth="1px" borderRadius="lg" bg="white">
          <Stat>
            <StatLabel>Avg Response Time</StatLabel>
            <StatNumber>{stats.averageResponseTime} days</StatNumber>
          </Stat>
        </Box>
      </SimpleGrid>

      <Box p={6} shadow="sm" borderWidth="1px" borderRadius="lg" bg="white">
        <Text fontWeight="bold" mb={4}>Rating Distribution</Text>
        <VStack spacing={3}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <HStack key={rating} width="100%" spacing={4}>
              <HStack width="60px">
                <Icon as={FaStar} color="yellow.400" />
                <Text>{rating}</Text>
              </HStack>
              <Progress
                value={stats.ratingDistribution[rating]}
                size="sm"
                colorScheme={rating >= 4 ? 'green' : rating === 3 ? 'yellow' : 'red'}
                flex={1}
              />
              <Text width="60px">{stats.ratingDistribution[rating]}%</Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>
  )
}

export default ReviewStats