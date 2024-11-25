import { useState, useRef } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  SimpleGrid,
  IconButton,
  Flex,
  TableContainer,
  AspectRatio,
  useDisclosure,
  Container
} from '@chakra-ui/react'
import { FaStar, FaThLarge, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import RankingGrid from '../components/map/RankingGrid'
import RankingGridLegend from '../components/maps/RankingGridLegend'
import HeroHeader from '../components/HeroHeader'
import LocationSelector from '../components/LocationSelector'
import AddKeywordModal from '../components/AddKeywordModal'

const GridReports = () => {
  const [selectedLocation, setSelectedLocation] = useState('1')
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [selectedHistoricIndex, setSelectedHistoricIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [locations] = useState([
    { id: '1', name: 'Downtown Store' },
    { id: '2', name: 'Westside Branch' },
    { id: '3', name: 'North Point' }
  ])

  const [reports] = useState([
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
      sparklineData: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
        value: Math.floor(Math.random() * 10) + 1
      })),
      gridPoints: Array(25).fill(null).map(() => ({
        position: [-122.3321, 47.6062],
        rank: Math.floor(Math.random() * 20) + 1
      })),
      competitors: Array(10).fill(null).map((_, i) => ({
        name: i === 0 ? "Downtown Coffee Shop" : `Competitor ${i}`,
        rank: i + 1,
        rating: (5 - (i * 0.2)).toFixed(1),
        reviews: 245 - (i * 20),
        responseRate: "95%",
        avgResponseTime: "1 day",
        posts: {
          total: 89 - (i * 10),
          frequency: "3.2 per week"
        },
        metrics: {
          avgAGR: 92 - (i * 5),
          ATGR: 88 - (i * 4),
          SoLV: 65 - (i * 5)
        }
      }))
    }
  ])

  const [historicReports] = useState(Array(5).fill(null).map((_, i) => ({
    date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    rank: Math.floor(Math.random() * 10) + 1,
    avgAGR: Math.floor(Math.random() * 30) + 60,
    ATGR: Math.floor(Math.random() * 30) + 60,
    SoLV: Math.floor(Math.random() * 30) + 60,
    gridPoints: Array(25).fill(null).map(() => ({
      position: [-122.3321, 47.6062],
      rank: Math.floor(Math.random() * 20) + 1
    }))
  })))

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 350
    const container = scrollContainerRef.current
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  return (
    <Box>
      <HeroHeader 
        icon={FaThLarge}
        title="Grid Reports"
        subtitle="View and analyze your local search grid performance across all your tracked keywords and locations."
      />

      <Container maxW="container.xl" px={0}>
        <HStack spacing={4} mb={6}>
          <LocationSelector
            locations={locations}
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          />
        </HStack>

        <Button leftIcon={<FaPlus />} colorScheme="blue" mb={6} onClick={onOpen}>
          Run New Report
        </Button>

        <Flex 
          direction={{ base: 'column', lg: 'row' }} 
          gap={6} 
          align="start"
          position="relative"
        >
          {/* Keyword Reports List - Fixed width sidebar */}
          <Card 
            w={{ base: "100%", lg: "300px" }} 
            flexShrink={0}
            position={{ lg: "sticky" }}
            top={{ lg: "20px" }}
            maxH={{ lg: "calc(100vh - 200px)" }}
            overflowY={{ lg: "auto" }}
          >
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text fontWeight="bold">Keyword Reports</Text>
                {reports.map(report => (
                  <Box
                    key={report.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => setSelectedReport(report)}
                    bg={selectedReport?.id === report.id ? "blue.50" : undefined}
                    _hover={{ bg: "gray.50" }}
                  >
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold">{report.keyword}</Text>
                      <HStack>
                        <Badge colorScheme={report.rank <= 3 ? "green" : "yellow"}>
                          Rank #{report.rank}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          {report.date}
                        </Text>
                      </HStack>
                      <SimpleGrid columns={3} spacing={4}>
                        <Box>
                          <Text fontSize="xs" color="gray.500">AGR</Text>
                          <Text fontWeight="medium">{report.avgAGR}%</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500">ATGR</Text>
                          <Text fontWeight="medium">{report.ATGR}%</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500">SoLV</Text>
                          <Text fontWeight="medium">{report.SoLV}%</Text>
                        </Box>
                      </SimpleGrid>
                      <Box width="100%" height="30px">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={report.sparklineData}>
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#3182CE"
                              strokeWidth={1}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </VStack>
                  </Box>
                ))}
                <Button colorScheme="blue" size="sm" onClick={onOpen}>
                  Run New Report
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Main Content Area - Flexible width with max width constraint */}
          {selectedReport && (
            <Box flex="1" minW="0" maxW={{ lg: "calc(100% - 332px)" }}>
              <VStack spacing={6} align="stretch">
                {/* Current Rankings Card */}
                <Card>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Text fontSize="lg" fontWeight="bold">{selectedReport.keyword}</Text>
                      <Box height="500px">
                        <RankingGrid
                          center={[-122.3321, 47.6062]}
                          radius={parseFloat(selectedReport.radius)}
                          gridSize={selectedReport.gridSize}
                          rankings={selectedReport.gridPoints}
                        />
                      </Box>
                      <RankingGridLegend
                        gridSize={selectedReport.gridSize}
                        radius={parseFloat(selectedReport.radius)}
                        unit={selectedReport.unit}
                      />
                    </VStack>
                  </CardBody>
                </Card>

                {/* Historic Reports Section */}
                <Card>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <Text fontWeight="bold">Historic Reports</Text>
                        <HStack>
                          <IconButton
                            aria-label="Scroll left"
                            icon={<FaChevronLeft />}
                            onClick={() => handleScroll('left')}
                            size="sm"
                          />
                          <IconButton
                            aria-label="Scroll right"
                            icon={<FaChevronRight />}
                            onClick={() => handleScroll('right')}
                            size="sm"
                          />
                        </HStack>
                      </HStack>
                      
                      <Box
                        ref={scrollContainerRef}
                        overflowX="auto"
                        css={{
                          '&::-webkit-scrollbar': {
                            display: 'none'
                          },
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none'
                        }}
                      >
                        <Flex gap={4} pb={2}>
                          {historicReports.map((report, index) => (
                            <Card
                              key={report.date}
                              w="300px"
                              flexShrink={0}
                              cursor="pointer"
                              onClick={() => setSelectedHistoricIndex(index)}
                              borderColor={selectedHistoricIndex === index ? "blue.500" : undefined}
                              borderWidth={2}
                            >
                              <CardBody>
                                <VStack align="stretch" spacing={3}>
                                  <HStack justify="space-between">
                                    <Badge colorScheme={report.rank <= 3 ? "green" : "yellow"}>
                                      Rank #{report.rank}
                                    </Badge>
                                    <Text fontSize="sm" color="gray.500">
                                      {report.date}
                                    </Text>
                                  </HStack>
                                  
                                  <AspectRatio ratio={1} maxH="200px">
                                    <Box borderRadius="md" overflow="hidden">
                                      <RankingGrid
                                        center={[-122.3321, 47.6062]}
                                        radius={parseFloat(selectedReport.radius)}
                                        gridSize={selectedReport.gridSize}
                                        rankings={report.gridPoints}
                                      />
                                    </Box>
                                  </AspectRatio>

                                  <SimpleGrid columns={3} spacing={2}>
                                    <Box>
                                      <Text fontSize="xs" color="gray.500">AGR</Text>
                                      <Text fontWeight="medium">{report.avgAGR}%</Text>
                                    </Box>
                                    <Box>
                                      <Text fontSize="xs" color="gray.500">ATGR</Text>
                                      <Text fontWeight="medium">{report.ATGR}%</Text>
                                    </Box>
                                    <Box>
                                      <Text fontSize="xs" color="gray.500">SoLV</Text>
                                      <Text fontWeight="medium">{report.SoLV}%</Text>
                                    </Box>
                                  </SimpleGrid>
                                </VStack>
                              </CardBody>
                            </Card>
                          ))}
                        </Flex>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Competitors Table Card */}
                <Card>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Text fontWeight="bold">Top Ranking Businesses</Text>
                      <TableContainer>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Business</Th>
                              <Th>Rank</Th>
                              <Th>Rating</Th>
                              <Th isNumeric>Reviews</Th>
                              <Th>Response Rate</Th>
                              <Th isNumeric>AGR</Th>
                              <Th isNumeric>ATGR</Th>
                              <Th isNumeric>SoLV</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {selectedReport.competitors.map((business) => (
                              <Tr 
                                key={business.name}
                                bg={business.name === "Downtown Coffee Shop" ? "blue.50" : undefined}
                                _hover={{ bg: business.name === "Downtown Coffee Shop" ? "blue.100" : "gray.50" }}
                              >
                                <Td fontWeight={business.name === "Downtown Coffee Shop" ? "bold" : "normal"}>
                                  {business.name}
                                  {business.name === "Downtown Coffee Shop" && (
                                    <Badge ml={2} colorScheme="blue">Your Business</Badge>
                                  )}
                                </Td>
                                <Td>
                                  <Badge 
                                    colorScheme={business.rank <= 3 ? "green" : "yellow"}
                                  >
                                    #{business.rank}
                                  </Badge>
                                </Td>
                                <Td>
                                  <HStack>
                                    <Icon as={FaStar} color="yellow.400" />
                                    <Text>{business.rating}</Text>
                                    <Text color="gray.500">({business.reviews})</Text>
                                  </HStack>
                                </Td>
                                <Td isNumeric>{business.reviews}</Td>
                                <Td>
                                  <VStack align="start" spacing={0}>
                                    <Text>{business.responseRate}</Text>
                                    <Text fontSize="sm" color="gray.500">
                                      avg {business.avgResponseTime}
                                    </Text>
                                  </VStack>
                                </Td>
                                <Td isNumeric>
                                  <Text fontWeight="medium">{business.metrics.avgAGR}%</Text>
                                </Td>
                                <Td isNumeric>
                                  <Text fontWeight="medium">{business.metrics.ATGR}%</Text>
                                </Td>
                                <Td isNumeric>
                                  <Text fontWeight="medium">{business.metrics.SoLV}%</Text>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </Box>
          )}
        </Flex>
      </Container>

      <AddKeywordModal
        isOpen={isOpen}
        onClose={onClose}
        onAddKeyword={() => {}}
        location={{
          name: locations.find(loc => loc.id === selectedLocation)?.name || '',
          address: '123 Main St, Seattle, WA',
          latitude: 47.6062,
          longitude: -122.3321
        }}
      />
    </Box>
  )
}

export default GridReports