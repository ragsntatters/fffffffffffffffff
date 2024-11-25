import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Icon,
  Card,
  CardBody
} from '@chakra-ui/react'
import { FaStar } from 'react-icons/fa'
import type { FeedbackStats as FeedbackStatsType } from '../../types/feedback'

interface FeedbackStatsProps {
  stats: FeedbackStatsType
}

const FeedbackStats = ({ stats }: FeedbackStatsProps) => (
  <Box mb={8}>
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
      <Card>
        <CardBody>
          <Stat>
            <StatLabel>Total Reviews</StatLabel>
            <StatNumber>{stats.totalReviews}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.trends.reviews} new this month
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stat>
            <StatLabel>Average Rating</StatLabel>
            <StatNumber>{stats.averageRating}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.trends.rating} points
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stat>
            <StatLabel>Response Rate</StatLabel>
            <StatNumber>{stats.responseRate}%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.trends.responseRate}% increase
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stat>
            <StatLabel>Avg Response Time</StatLabel>
            <StatNumber>{stats.averageResponseTime} days</StatNumber>
          </Stat>
        </CardBody>
      </Card>
    </SimpleGrid>

    <Card>
      <CardBody>
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
      </CardBody>
    </Card>
  </Box>
)

export default FeedbackStats