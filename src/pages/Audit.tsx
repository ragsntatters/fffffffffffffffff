import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Badge,
  Alert,
  AlertIcon,
  HStack,
  SimpleGrid,
  InputGroup,
  InputRightElement,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  IconButton,
  List,
  ListItem,
  Icon,
  Spinner,
  Tooltip,
  useToast,
  AspectRatio
} from '@chakra-ui/react'
import { FaPlus, FaSearch, FaMapMarkerAlt, FaStar, FaInfoCircle, FaChartLine } from 'react-icons/fa'
import { MetricTooltip } from '../components/MetricTooltips'
import LocationSelector from '../components/LocationSelector'
import { googlePlaces } from '../lib/services/google/places-api'
import { debounce } from 'lodash'
import RankingGrid from '../components/map/RankingGrid'
import HeroHeader from '../components/HeroHeader'

const Audit = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const [pastAudits] = useState([
    {
      id: 1,
      businessName: "Joe's Coffee",
      location: "123 Main St, Seattle, WA",
      keyword: "coffee shop",
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
    },
    {
      id: 2,
      businessName: "Downtown Bakery",
      location: "456 Pike St, Seattle, WA",
      keyword: "bakery",
      gridSize: "3x3",
      radius: "1.5",
      unit: "mi",
      date: "2024-03-14",
      rank: 5,
      avgAGR: 72,
      ATGR: 65,
      SoLV: 45,
      gridPoints: Array(9).fill(null).map(() => ({
        position: [-122.3321, 47.6062],
        rank: Math.floor(Math.random() * 20) + 1
      }))
    }
  ])

  const [formData, setFormData] = useState({
    keyword: '',
    gridSize: '3x3',
    radius: '',
    unit: 'km'
  })

  const handleSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await googlePlaces.searchPlaces(query)
      setSearchResults(results)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search locations',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setIsSearching(false)
    }
  }, 300)

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    setSearchTerm(location.name)
    setSearchResults([])
  }

  const handleRunAudit = () => {
    if (!selectedLocation) {
      toast({
        title: "Location Required",
        description: "Please select a business location first",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    toast({
      title: "Audit Started",
      description: "Your location audit is being processed. This may take a few minutes.",
      status: "info",
      duration: 5000,
      isClosable: true,
    })
  }

  const handleViewAuditReport = (auditId) => {
    navigate(`/audit/${auditId}`)
  }

  const AuditCard = ({ audit }) => (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Badge colorScheme={audit.rank <= 3 ? 'green' : 'yellow'}>
              Rank #{audit.rank}
            </Badge>
            <Text fontSize="sm" color="gray.500">
              {audit.date}
            </Text>
          </HStack>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={1}>
              {audit.businessName}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {audit.location}
            </Text>
          </Box>

          <AspectRatio ratio={1} width="100%">
            <Box borderRadius="md" overflow="hidden">
              <RankingGrid
                center={[-122.3321, 47.6062]}
                radius={parseFloat(audit.radius)}
                gridSize={audit.gridSize}
                rankings={audit.gridPoints}
              />
            </Box>
          </AspectRatio>

          <Box>
            <Text fontSize="sm" mb={1}>
              <strong>Keyword:</strong> {audit.keyword}
            </Text>
            <HStack fontSize="sm" color="gray.600">
              <Text>{audit.gridSize} grid</Text>
              <Text>•</Text>
              <Text>{audit.radius} {audit.unit} radius</Text>
            </HStack>
          </Box>

          <SimpleGrid columns={3} spacing={4}>
            <Stat size="sm">
              <StatLabel>
                <MetricTooltip metric="AGR">AGR</MetricTooltip>
              </StatLabel>
              <StatNumber fontSize="md">{audit.avgAGR}%</StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel>
                <MetricTooltip metric="ATGR">ATGR</MetricTooltip>
              </StatLabel>
              <StatNumber fontSize="md">{audit.ATGR}%</StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel>
                <MetricTooltip metric="SoLV">SoLV</MetricTooltip>
              </StatLabel>
              <StatNumber fontSize="md">{audit.SoLV}%</StatNumber>
            </Stat>
          </SimpleGrid>

          <Button 
            size="sm" 
            colorScheme="blue" 
            width="full"
            onClick={() => handleViewAuditReport(audit.id)}
          >
            View Details
          </Button>
        </VStack>
      </CardBody>
    </Card>
  )

  return (
    <Box>
      <HeroHeader
        icon={FaChartLine}
        title="Location Audit"
        subtitle="Analyze any Google Business location's ranking performance with our comprehensive grid-based audit system. Get detailed insights into your local search visibility and competitive landscape."
      />

      <Card mb={6}>
        <CardBody>
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>
                Business Location
                <Tooltip
                  label="Search for any business on Google Maps"
                  placement="top"
                >
                  <Box as="span" ml={2} cursor="help">
                    <FaInfoCircle />
                  </Box>
                </Tooltip>
              </FormLabel>
              <InputGroup>
                <Input
                  placeholder="Search for any business..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    handleSearch(e.target.value)
                  }}
                />
                {isSearching && (
                  <InputRightElement>
                    <Spinner size="sm" />
                  </InputRightElement>
                )}
              </InputGroup>
              {searchResults.length > 0 && !selectedLocation && (
                <Box
                  mt={2}
                  maxH="200px"
                  overflowY="auto"
                  borderWidth={1}
                  borderRadius="md"
                  boxShadow="sm"
                  position="absolute"
                  bg="white"
                  width="100%"
                  zIndex={1000}
                >
                  <List spacing={0}>
                    {searchResults.map((location) => (
                      <ListItem
                        key={location.id}
                        p={3}
                        cursor="pointer"
                        _hover={{ bg: 'gray.50' }}
                        onClick={() => handleLocationSelect(location)}
                        borderBottomWidth={1}
                        _last={{ borderBottomWidth: 0 }}
                      >
                        <HStack spacing={3}>
                          <Icon as={FaMapMarkerAlt} color="gray.500" />
                          <Box flex={1}>
                            <Text fontWeight="medium">{location.name}</Text>
                            <Text fontSize="sm" color="gray.600">
                              {location.address}
                            </Text>
                            {location.rating && (
                              <HStack spacing={1} mt={1}>
                                <Icon as={FaStar} color="yellow.400" boxSize={3} />
                                <Text fontSize="sm" color="gray.600">
                                  {location.rating} ({location.reviews} reviews)
                                </Text>
                              </HStack>
                            )}
                          </Box>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              {selectedLocation && (
                <Box mt={2} p={3} borderWidth={1} borderRadius="md">
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="green.500" />
                    <Box flex={1}>
                      <Text fontWeight="medium">{selectedLocation.name}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {selectedLocation.address}
                      </Text>
                    </Box>
                    <Badge colorScheme="green">Selected</Badge>
                  </HStack>
                </Box>
              )}
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} width="100%">
              <FormControl>
                <FormLabel>Keyword</FormLabel>
                <Input
                  placeholder="Enter keyword"
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Grid Size</FormLabel>
                <Select
                  value={formData.gridSize}
                  onChange={(e) => setFormData({ ...formData, gridSize: e.target.value })}
                >
                  <option value="3x3">3x3</option>
                  <option value="5x5">5x5</option>
                  <option value="7x7">7x7</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Radius</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter radius"
                  value={formData.radius}
                  onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Unit</FormLabel>
                <Select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="km">Kilometers</option>
                  <option value="mi">Miles</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            <Button
              leftIcon={<FaPlus />}
              colorScheme="blue"
              onClick={handleRunAudit}
              alignSelf="flex-start"
            >
              Run Audit
            </Button>
          </VStack>
        </CardBody>
      </Card>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {pastAudits.map((audit) => (
          <AuditCard key={audit.id} audit={audit} />
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default Audit