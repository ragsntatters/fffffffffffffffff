import { useState } from 'react'
import {
  Box,
  IconButton,
  HStack,
  Circle,
  Flex,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
  VStack,
  useColorModeValue
} from '@chakra-ui/react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import RankingGrid from './map/RankingGrid'
import { MetricTooltip } from './MetricTooltips'

interface HistoricSnapshot {
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

interface HistoricGridSliderProps {
  snapshots: HistoricSnapshot[]
  center: [number, number]
  radius: number
  gridSize: string
}

const HistoricGridSlider = ({ snapshots, center, radius, gridSize }: HistoricGridSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const bgColor = useColorModeValue('white', 'gray.700')

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? snapshots.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === snapshots.length - 1 ? 0 : prev + 1))
  }

  if (!snapshots.length) {
    return (
      <Box p={6} textAlign="center" bg={bgColor} borderRadius="lg">
        <Text>No historic data available yet</Text>
      </Box>
    )
  }

  return (
    <Box position="relative">
      <Flex
        position="absolute"
        left={0}
        right={0}
        top="50%"
        transform="translateY(-50%)"
        justify="space-between"
        px={4}
        zIndex={2}
      >
        <IconButton
          aria-label="Previous snapshot"
          icon={<FaChevronLeft />}
          onClick={handlePrevious}
          variant="solid"
          colorScheme="blackAlpha"
          rounded="full"
          size="lg"
        />
        <IconButton
          aria-label="Next snapshot"
          icon={<FaChevronRight />}
          onClick={handleNext}
          variant="solid"
          colorScheme="blackAlpha"
          rounded="full"
          size="lg"
        />
      </Flex>

      <Box bg={bgColor} p={6} borderRadius="lg" shadow="base">
        <VStack spacing={6}>
          <HStack justify="space-between" width="100%">
            <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
              {snapshots[currentIndex].date}
            </Badge>
            <Badge 
              colorScheme={snapshots[currentIndex].rank <= 3 ? 'green' : 'yellow'}
              fontSize="md"
              px={3}
              py={1}
            >
              Rank #{snapshots[currentIndex].rank}
            </Badge>
          </HStack>

          <Box height="400px" width="100%">
            <RankingGrid
              center={center}
              radius={radius}
              gridSize={gridSize}
              rankings={snapshots[currentIndex].gridPoints}
            />
          </Box>

          <SimpleGrid columns={3} spacing={4} width="100%">
            <Stat size="sm">
              <StatLabel>
                <MetricTooltip metric="AGR">AGR</MetricTooltip>
              </StatLabel>
              <StatNumber>{snapshots[currentIndex].avgAGR}%</StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel>
                <MetricTooltip metric="ATGR">ATGR</MetricTooltip>
              </StatLabel>
              <StatNumber>{snapshots[currentIndex].ATGR}%</StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel>
                <MetricTooltip metric="SoLV">SoLV</MetricTooltip>
              </StatLabel>
              <StatNumber>{snapshots[currentIndex].SoLV}%</StatNumber>
            </Stat>
          </SimpleGrid>
        </VStack>
      </Box>

      <HStack justify="center" mt={4} spacing={2}>
        {snapshots.map((_, index) => (
          <Circle
            key={index}
            size={2}
            bg={index === currentIndex ? 'blue.500' : 'gray.200'}
            cursor="pointer"
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </HStack>
    </Box>
  )
}

export default HistoricGridSlider