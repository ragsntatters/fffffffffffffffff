import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  Image,
  Icon,
  Box,
  SimpleGrid,
  Progress,
  Stat,
  StatLabel,
  StatNumber
} from '@chakra-ui/react'
import { FaStar } from 'react-icons/fa'
import { MetricTooltip } from '../MetricTooltips'

interface CompetitorCardProps {
  business: any
  isClient: boolean
  competitors: any[]
}

const CompetitorCard = ({ business, isClient, competitors }: CompetitorCardProps) => (
  <Card
    borderWidth={isClient ? 2 : 1}
    borderColor={isClient ? 'blue.500' : 'gray.200'}
    bg={isClient ? 'blue.50' : 'white'}
  >
    <CardBody>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Image
              src={business.logo}
              alt={`${business.name} logo`}
              boxSize="50px"
              borderRadius="md"
              objectFit="cover"
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="lg">
                {business.name}
                {isClient && <Badge colorScheme="blue" ml={2}>Your Business</Badge>}
              </Text>
              <Badge colorScheme={business.rank <= 3 ? 'green' : 'yellow'}>
                Rank #{business.rank}
              </Badge>
            </VStack>
          </HStack>
          <HStack>
            <Icon as={FaStar} color="yellow.400" />
            <Text fontWeight="bold">{business.reviews.rating.toFixed(1)}</Text>
            <Text color="gray.600">({business.reviews.total})</Text>
          </HStack>
        </HStack>

        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={2}>Review Distribution</Text>
          {[5, 4, 3, 2, 1].map((stars) => (
            <HStack key={stars} spacing={4} mb={1}>
              <HStack spacing={1} width="60px">
                <Icon as={FaStar} color="yellow.400" boxSize={3} />
                <Text fontSize="xs" width="20px">{stars}</Text>
              </HStack>
              <Progress 
                value={business.reviews.breakdown[stars]} 
                size="xs"
                flex={1}
                colorScheme={stars >= 4 ? 'green' : stars === 3 ? 'yellow' : 'red'}
              />
              <Text fontSize="xs" width="30px">
                {business.reviews.breakdown[stars]}%
              </Text>
            </HStack>
          ))}
        </Box>

        <SimpleGrid columns={3} spacing={4}>
          <Stat size="sm">
            <StatLabel>
              <MetricTooltip metric="AGR">AGR</MetricTooltip>
            </StatLabel>
            <StatNumber fontSize="lg">{business.metrics.avgAGR}%</StatNumber>
          </Stat>
          <Stat size="sm">
            <StatLabel>
              <MetricTooltip metric="ATGR">ATGR</MetricTooltip>
            </StatLabel>
            <StatNumber fontSize="lg">{business.metrics.ATGR}%</StatNumber>
          </Stat>
          <Stat size="sm">
            <StatLabel>
              <MetricTooltip metric="SoLV">SoLV</MetricTooltip>
            </StatLabel>
            <StatNumber fontSize="lg">{business.metrics.SoLV}%</StatNumber>
          </Stat>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={4}>
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={1}>Posts</Text>
            <Text fontSize="sm">{business.posts.total} total</Text>
            <Text fontSize="xs" color="gray.600">
              ~{business.posts.frequency}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={1}>Reviews</Text>
            <Text fontSize="sm">{business.reviews.responseRate} response rate</Text>
            <Text fontSize="xs" color="gray.600">
              Avg. {business.reviews.avgResponseTime} response
            </Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </CardBody>
  </Card>
)

export default CompetitorCard