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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Icon,
  Divider,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Select,
  FormControl,
  FormLabel,
  Switch,
  Tooltip,
  AspectRatio
} from '@chakra-ui/react'
import { FaPlus, FaSearch, FaMapMarkerAlt, FaStar, FaInfoCircle, FaChartLine } from 'react-icons/fa'
import { MetricTooltip } from '../components/MetricTooltips'
import RankingGrid from '../components/map/RankingGrid'
import RankingGridLegend from '../components/maps/RankingGridLegend'
import CompetitorCard from '../components/audit/CompetitorCard'
import HistoricGridSlider from '../components/HistoricGridSlider'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'

const KeywordReport = () => {
  const { id } = useParams()
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [scheduleSettings, setScheduleSettings] = useState({
    frequency: 'weekly',
    enabled: false,
    notifyTeam: true
  })
  const toast = useToast()

  const [keywordData] = useState({
    keyword: 'coffee shop',
    location: {
      name: 'Downtown Coffee Shop',
      coordinates: {
        latitude: 47.6062,
        longitude: -122.3321
      }
    },
    currentRank: 3,
    rankChange: -2,
    avgAGR: 85,
    ATGR: 78,
    SoLV: 50,
    lastRun: '2024-03-15 14:30',
    nextScheduledRun: '2024-03-22 14:30',
    gridSize: '3x3',
    radius: 2,
    unit: 'km',
    gridPoints: Array(9).fill(null).map(() => ({
      position: [-122.3321, 47.6062],
      rank: Math.floor(Math.random() * 20) + 1
    })),
    historicSnapshots: [
      {
        date: '2024-03-15',
        rank: 3,
        avgAGR: 85,
        ATGR: 78,
        SoLV: 50,
        gridPoints: Array(9).fill(null).map(() => ({
          position: [-122.3321, 47.6062],
          rank: Math.floor(Math.random() * 20) + 1
        }))
      },
      {
        date: '2024-03-08',
        rank: 4,
        avgAGR: 82,
        ATGR: 76,
        SoLV: 48,
        gridPoints: Array(9).fill(null).map(() => ({
          position: [-122.3321, 47.6062],
          rank: Math.floor(Math.random() * 20) + 1
        }))
      },
      {
        date: '2024-03-01',
        rank: 5,
        avgAGR: 80,
        ATGR: 75,
        SoLV: 45,
        gridPoints: Array(9).fill(null).map(() => ({
          position: [-122.3321, 47.6062],
          rank: Math.floor(Math.random() * 20) + 1
        }))
      }
    ],
    competitors: [
      {
        name: 'Starbucks Reserve',
        logo: 'https://via.placeholder.com/50',
        rank: 1,
        reviews: {
          total: 425,
          rating: 4.8,
          breakdown: { 5: 90, 4: 5, 3: 3, 2: 1, 1: 1 },
          responseRate: "92%",
          avgResponseTime: "1 day"
        },
        posts: {
          total: 95,
          lastPosted: "2024-03-15",
          frequency: "3.5 per week"
        },
        metrics: {
          avgAGR: 95,
          ATGR: 90,
          SoLV: 70
        }
      },
      {
        name: 'Seattle Coffee Works',
        logo: 'https://via.placeholder.com/50',
        rank: 2,
        reviews: {
          total: 312,
          rating: 4.7,
          breakdown: { 5: 85, 4: 8, 3: 4, 2: 2, 1: 1 },
          responseRate: "88%",
          avgResponseTime: "2 days"
        },
        posts: {
          total: 76,
          lastPosted: "2024-03-15",
          frequency: "2.8 per week"
        },
        metrics: {
          avgAGR: 88,
          ATGR: 82,
          SoLV: 60
        }
      },
      {
        name: 'Downtown Coffee Shop',
        logo: 'https://via.placeholder.com/50',
        rank: 3,
        reviews: {
          total: 245,
          rating: 4.8,
          breakdown: { 5: 88, 4: 7, 3: 3, 2: 1, 1: 1 },
          responseRate: "95%",
          avgResponseTime: "1 day"
        },
        posts: {
          total: 89,
          lastPosted: "2024-03-14",
          frequency: "3.2 per week"
        },
        metrics: {
          avgAGR: 92,
          ATGR: 88,
          SoLV: 65
        }
      },
      {
        name: 'Bean & Brew',
        logo: 'https://via.placeholder.com/50',
        rank: 4,
        reviews: {
          total: 198,
          rating: 4.6,
          breakdown: { 5: 82, 4: 10, 3: 5, 2: 2, 1: 1 },
          responseRate: "75%",
          avgResponseTime: "3 days"
        },
        posts: {
          total: 65,
          lastPosted: "2024-03-13",
          frequency: "2.5 per week"
        },
        metrics: {
          avgAGR: 85,
          ATGR: 78,
          SoLV: 55
        }
      },
      {
        name: 'Cafe Allegro',
        logo: 'https://via.placeholder.com/50',
        rank: 5,
        reviews: {
          total: 178,
          rating: 4.5,
          breakdown: { 5: 80, 4: 12, 3: 5, 2: 2, 1: 1 },
          responseRate: "70%",
          avgResponseTime: "4 days"
        },
        posts: {
          total: 58,
          lastPosted: "2024-03-12",
          frequency: "2.2 per week"
        },
        metrics: {
          avgAGR: 82,
          ATGR: 75,
          SoLV: 52
        }
      },
      {
        name: 'Urban Coffee House',
        logo: 'https://via.placeholder.com/50',
        rank: 6,
        reviews: {
          total: 156,
          rating: 4.4,
          breakdown: { 5: 75, 4: 15, 3: 7, 2: 2, 1: 1 },
          responseRate: "65%",
          avgResponseTime: "5 days"
        },
        posts: {
          total: 52,
          lastPosted: "2024-03-11",
          frequency: "2.0 per week"
        },
        metrics: {
          avgAGR: 78,
          ATGR: 72,
          SoLV: 48
        }
      }
    ].sort((a, b) => a.rank - b.rank),
    historicData: [
      { date: '2024-01', rank: 5, avgAGR: 80, ATGR: 75, SoLV: 45 },
      { date: '2024-02', rank: 4, avgAGR: 82, ATGR: 76, SoLV: 47 },
      { date: '2024-03', rank: 3, avgAGR: 85, ATGR: 78, SoLV: 50 }
    ]
  })

  const handleScheduleUpdate = () => {
    setIsScheduleModalOpen(false)
    toast({
      title: "Schedule Updated",
      description: `Report will run ${scheduleSettings.enabled ? scheduleSettings.frequency : 'manually'}.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    })
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Keyword Report: {keywordData.keyword}
        <Text fontSize="md" color="gray.600" mt={2}>
          Location: {keywordData.location.name}
        </Text>
      </Heading>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Current Rankings</Heading>
            <RankingGrid
              center={[keywordData.location.coordinates.longitude, keywordData.location.coordinates.latitude]}
              radius={keywordData.radius}
              gridSize={keywordData.gridSize}
              rankings={keywordData.gridPoints}
            />
            <RankingGridLegend
              gridSize={keywordData.gridSize}
              radius={keywordData.radius}
              unit={keywordData.unit}
            />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Historic Grid Rankings</Heading>
            <HistoricGridSlider 
              snapshots={keywordData.historicSnapshots}
              center={[keywordData.location.coordinates.longitude, keywordData.location.coordinates.latitude]}
              radius={keywordData.radius}
              gridSize={keywordData.gridSize}
            />
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card mb={6}>
        <CardBody>
          <Heading size="md" mb={4}>Metrics Over Time</Heading>
          <Box height="400px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={keywordData.historicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="rank" 
                  stroke="#3182CE" 
                  name="Rank"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="avgAGR" 
                  stroke="#38A169" 
                  name="AGR"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="ATGR" 
                  stroke="#D69E2E" 
                  name="ATGR"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="SoLV" 
                  stroke="#E53E3E" 
                  name="SoLV"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardBody>
      </Card>

      <Box>
        <Heading size="md" mb={4}>Top Competitors</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {keywordData.competitors.map((competitor) => (
            <CompetitorCard
              key={competitor.name}
              business={competitor}
              isClient={competitor.name === keywordData.location.name}
              competitors={keywordData.competitors}
            />
          ))}
        </SimpleGrid>
      </Box>

      <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Configure Report Schedule</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  Enable Recurring Reports
                </FormLabel>
                <Switch
                  isChecked={scheduleSettings.enabled}
                  onChange={(e) => setScheduleSettings({
                    ...scheduleSettings,
                    enabled: e.target.checked
                  })}
                />
              </FormControl>

              <FormControl isDisabled={!scheduleSettings.enabled}>
                <FormLabel>Frequency</FormLabel>
                <Select
                  value={scheduleSettings.frequency}
                  onChange={(e) => setScheduleSettings({
                    ...scheduleSettings,
                    frequency: e.target.value
                  })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly</option>
                  <option value="monthly">Monthly</option>
                </Select>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  Notify Team on Updates
                </FormLabel>
                <Switch
                  isChecked={scheduleSettings.notifyTeam}
                  onChange={(e) => setScheduleSettings({
                    ...scheduleSettings,
                    notifyTeam: e.target.checked
                  })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleScheduleUpdate}>
              Save Schedule
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default KeywordReport