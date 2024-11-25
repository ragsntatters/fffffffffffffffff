import {
  VStack,
  Text,
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  Badge,
  HStack,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Progress,
  Heading,
  Divider
} from '@chakra-ui/react'
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa'
import { MetricTooltip } from '../MetricTooltips'
import RankingGrid from '../map/RankingGrid'
import RankingGridLegend from '../maps/RankingGridLegend'

interface AuditResultsProps {
  location: any
  auditData: {
    keyword: string
    gridSize: string
    radius: string
    unit: string
  }
}

const AuditResults = ({ location, auditData }: AuditResultsProps) => {
  // Mock audit results with more detailed data
  const results = {
    rank: Math.floor(Math.random() * 20) + 1,
    avgAGR: Math.floor(Math.random() * 100),
    ATGR: Math.floor(Math.random() * 100),
    SoLV: Math.floor(Math.random() * 100),
    competitors: Array(6).fill(null).map((_, index) => ({
      name: `Competitor ${index + 1}`,
      rank: index + 1,
      rating: (5 - (index * 0.2)).toFixed(1),
      reviews: 245 - (index * 20),
      responseRate: "95%",
      avgResponseTime: "1 day",
      posts: {
        total: 89 - (index * 10),
        lastPosted: "2024-03-14",
        frequency: "3.2 per week"
      },
      metrics: {
        avgAGR: 92 - (index * 5),
        ATGR: 88 - (index * 4),
        SoLV: 65 - (index * 5)
      }
    })),
    gridPoints: Array(9).fill(null).map(() => ({
      position: [location.longitude || -122.4194, location.latitude || 37.7749],
      rank: Math.floor(Math.random() * 20) + 1
    })),
    improvement: Math.floor(Math.random() * 50) + 10,
    reviewDistribution: {
      5: 75,
      4: 15,
      3: 5,
      2: 3,
      1: 2
    }
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Audit Results for {location.name}
        </Text>
        <HStack spacing={2} flexWrap="wrap">
          <Badge colorScheme="blue">Keyword: {auditData.keyword}</Badge>
          <Badge colorScheme="green">Grid: {auditData.gridSize}</Badge>
          <Badge colorScheme="purple">
            Radius: {auditData.radius} {auditData.unit}
          </Badge>
        </HStack>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Current Rank</StatLabel>
              <StatNumber>#{results.rank}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {results.improvement}% potential improvement
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <MetricTooltip metric="AGR">Average Growth Rate</MetricTooltip>
              </StatLabel>
              <StatNumber>{results.avgAGR}%</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <MetricTooltip metric="ATGR">ATGR</MetricTooltip>
              </StatLabel>
              <StatNumber>{results.ATGR}%</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <MetricTooltip metric="SoLV">Share of Local Voice</MetricTooltip>
              </StatLabel>
              <StatNumber>{results.SoLV}%</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Local Search Grid</Heading>
          <Box height="400px" mb={4}>
            <RankingGrid
              center={[location.longitude || -122.4194, location.latitude || 37.7749]}
              radius={parseFloat(auditData.radius)}
              gridSize={auditData.gridSize}
              rankings={results.gridPoints}
            />
          </Box>
          <RankingGridLegend
            gridSize={auditData.gridSize}
            radius={parseFloat(auditData.radius)}
            unit={auditData.unit}
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Competitor Analysis</Heading>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Business</Th>
                  <Th>Rank</Th>
                  <Th>Rating</Th>
                  <Th>Reviews</Th>
                  <Th>Response Rate</Th>
                  <Th>AGR</Th>
                  <Th>ATGR</Th>
                  <Th>SoLV</Th>
                </Tr>
              </Thead>
              <Tbody>
                {results.competitors.map((competitor) => (
                  <Tr key={competitor.name}>
                    <Td fontWeight={competitor.rank === results.rank ? "bold" : "normal"}>
                      {competitor.name}
                      {competitor.rank === results.rank && (
                        <Badge ml={2} colorScheme="blue">Your Business</Badge>
                      )}
                    </Td>
                    <Td>#{competitor.rank}</Td>
                    <Td>
                      <HStack>
                        <Icon as={FaStar} color="yellow.400" />
                        <Text>{competitor.rating}</Text>
                      </HStack>
                    </Td>
                    <Td>{competitor.reviews}</Td>
                    <Td>{competitor.responseRate}</Td>
                    <Td>{competitor.metrics.avgAGR}%</Td>
                    <Td>{competitor.metrics.ATGR}%</Td>
                    <Td>{competitor.metrics.SoLV}%</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Review Distribution</Heading>
          <VStack spacing={3}>
            {[5, 4, 3, 2, 1].map((rating) => (
              <HStack key={rating} width="100%" spacing={4}>
                <HStack width="60px">
                  <Icon as={FaStar} color="yellow.400" />
                  <Text>{rating}</Text>
                </HStack>
                <Progress
                  value={results.reviewDistribution[rating]}
                  size="sm"
                  colorScheme={rating >= 4 ? 'green' : rating === 3 ? 'yellow' : 'red'}
                  flex={1}
                />
                <Text width="60px">{results.reviewDistribution[rating]}%</Text>
              </HStack>
            ))}
          </VStack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Recommendations</Heading>
          <VStack align="start" spacing={4}>
            <Box>
              <Text fontWeight="bold" color="blue.600" mb={2}>
                Immediate Actions:
              </Text>
              <Text>
                • Focus on improving your ranking for "{auditData.keyword}" - potential {results.improvement}% improvement
                <br />
                • Increase review response rate to match top competitors
                <br />
                • Optimize your business profile with more frequent posts
              </Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold" color="green.600" mb={2}>
                Long-term Strategy:
              </Text>
              <Text>
                • Monitor and adapt to competitor ranking changes
                <br />
                • Implement a consistent review management strategy
                <br />
                • Expand your local search presence with additional keywords
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      <Button
        colorScheme="blue"
        size="lg"
        as="a"
        href="https://gbptracker.com/contact"
        target="_blank"
      >
        Get Your Full Report & Personalized Strategy
      </Button>
    </VStack>
  )
}

export default AuditResults