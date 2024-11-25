import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  SimpleGrid,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Text,
  Badge,
  useToast,
  HStack,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Link,
  FormHelperText,
  Divider,
  AspectRatio,
  Box as ChakraBox
} from '@chakra-ui/react'
import { FaPlus, FaChartLine } from 'react-icons/fa'
import { MetricTooltip } from '../components/MetricTooltips'
import LocationSelector from '../components/LocationSelector'
import HeroHeader from '../components/HeroHeader'
import RankingGrid from '../components/map/RankingGrid'

const Reports = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const [selectedLocation, setSelectedLocation] = useState('1')
  const toast = useToast()

  // Initialize locations state
  const [locations] = useState([
    { id: '1', name: 'Downtown Store' },
    { id: '2', name: 'Westside Branch' },
    { id: '3', name: 'North Point' }
  ])

  const [pastReports] = useState([
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
    location: '',
    keyword: '',
    radius: '',
    distance: '',
    unit: 'km'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    onClose()
    toast({
      title: "Report Started",
      description: "Your keyword report is being generated.",
      status: "success",
      duration: 5000,
      isClosable: true,
    })
  }

  const handleViewReport = (reportId: number) => {
    navigate(`/keyword-report/${reportId}`)
  }

  const KeywordCard = ({ keyword, onViewReport }: { keyword: any, onViewReport: (id: number) => void }) => (
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

  return (
    <Box>
      <HeroHeader
        icon={FaChartLine}
        title="Keyword Performance Reports"
        subtitle="Track and analyze your local search rankings with detailed grid-based reports. Monitor your visibility across multiple locations and keywords to optimize your local SEO strategy."
      />

      <HStack spacing={4} mb={6}>
        <LocationSelector
          locations={locations}
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        />

        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onOpen}>
          Run New Report
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {pastReports.map((report) => (
          <KeywordCard
            key={report.id}
            keyword={report}
            onViewReport={() => handleViewReport(report.id)}
          />
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Run Keyword Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Select
                  placeholder="Select location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  <option value="location1">Downtown Store</option>
                  <option value="location2">Westside Branch</option>
                </Select>
                <FormHelperText>
                  Select an existing location from your account. Can't find your location?{' '}
                  <Link as={RouterLink} to="/locations" color="blue.500">
                    Add it in the Locations page
                  </Link>
                </FormHelperText>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Keyword</FormLabel>
                <Input
                  placeholder="Enter keyword"
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Radius</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter radius"
                  value={formData.radius}
                  onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Distance</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter distance"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
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
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Run Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Reports