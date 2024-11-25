import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Box,
  AspectRatio
} from '@chakra-ui/react'
import { MetricTooltip } from './MetricTooltips'
import RankingGrid from './map/RankingGrid'

interface KeywordCardProps {
  keyword: {
    id: number
    keyword: string
    location: string
    gridSize: string
    radius: string
    unit: string
    date: string
    rank: number
    avgAGR: number
    ATGR: number
    SoLV: number
    gridPoints: Array<{
      position: [number, number]
      rank: number
    }>
  }
  onViewReport: (id: number) => void
}

const KeywordCard = ({ keyword, onViewReport }: KeywordCardProps) => (
  <Card>
    <CardBody>
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Badge colorScheme={keyword.rank <= 3 ? 'green' : 'yellow'}>
            Rank #{keyword.rank}
          </Badge>
          <Text fontSize="sm" color="gray.500">
            {keyword.date}
          </Text>
        </HStack>

        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={1}>
            {keyword.keyword}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {keyword.location}
          </Text>
        </Box>

        <AspectRatio ratio={1} width="100%">
          <Box borderRadius="md" overflow="hidden">
            <RankingGrid
              center={[-122.3321, 47.6062]}
              radius={parseFloat(keyword.radius)}
              gridSize={keyword.gridSize}
              rankings={keyword.gridPoints}
            />
          </Box>
        </AspectRatio>

        <Box>
          <Text fontSize="sm" mb={1}>
            <strong>Grid Size:</strong> {keyword.gridSize}
          </Text>
          <HStack fontSize="sm" color="gray.600">
            <Text>Radius: {keyword.radius} {keyword.unit}</Text>
          </HStack>
        </Box>

        <SimpleGrid columns={3} spacing={4}>
          <Stat size="sm">
            <StatLabel>
              <MetricTooltip metric="AGR">AGR</MetricTooltip>
            </StatLabel>
            <StatNumber fontSize="md">{keyword.avgAGR}%</StatNumber>
          </Stat>
          <Stat size="sm">
            <StatLabel>
              <MetricTooltip metric="ATGR">ATGR</MetricTooltip>
            </StatLabel>
            <StatNumber fontSize="md">{keyword.ATGR}%</StatNumber>
          </Stat>
          <Stat size="sm">
            <StatLabel>
              <MetricTooltip metric="SoLV">SoLV</MetricTooltip>
            </StatLabel>
            <StatNumber fontSize="md">{keyword.SoLV}%</StatNumber>
          </Stat>
        </SimpleGrid>

        <Button 
          size="sm" 
          colorScheme="blue" 
          width="full"
          onClick={() => onViewReport(keyword.id)}
        >
          View Details
        </Button>
      </VStack>
    </CardBody>
  </Card>
)

export default KeywordCard