import { Fragment } from 'react'
import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardBody,
  Progress,
  Icon,
} from '@chakra-ui/react'
import { FaDesktop, FaMobile } from 'react-icons/fa'
import PageHeader from '../components/PageHeader'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

const Test = () => {
  const businessDetails = {
    name: "Downtown Coffee Shop",
    location: "123 Main St, Seattle, WA",
    keyword: "coffee shop",
    placeId: "ChIJ2eUgeAK6j4ARbn5u_wAGqWA",
    address: "123 Main Street, Seattle, WA 98101",
    storeCode: "SEA001",
    schedule: "Daily at 9:00 AM PST"
  }

  const metrics = {
    agr: 85,
    atgr: 78,
    solv: 50
  }

  const competitors = {
    myBusiness: {
      name: "Downtown Coffee Shop",
      primaryCategory: "Coffee Shop",
      secondaryCategories: ["Cafe", "Bakery"],
      rating: 4.7,
      totalReviews: 245,
      responseRate: "92%",
      reviewVelocity: {
        "180d": 45,
        "90d": 28,
        "30d": 12
      }
    },
    competitor1: {
      name: "Seattle Coffee Works",
      primaryCategory: "Coffee Shop",
      secondaryCategories: ["Cafe"],
      rating: 4.8,
      totalReviews: 312,
      responseRate: "88%",
      reviewVelocity: {
        "180d": 52,
        "90d": 31,
        "30d": 15
      }
    },
    competitor2: {
      name: "Bean & Brew",
      primaryCategory: "Coffee Shop",
      secondaryCategories: ["Cafe", "Restaurant"],
      rating: 4.6,
      totalReviews: 198,
      responseRate: "75%",
      reviewVelocity: {
        "180d": 38,
        "90d": 22,
        "30d": 9
      }
    }
  }

  const pageSpeedInsights = {
    myBusiness: {
      mobile: { psi: 92, fcp: 1.8, lcp: 2.5 },
      desktop: { psi: 95, fcp: 1.2, lcp: 1.8 }
    },
    competitor1: {
      mobile: { psi: 85, fcp: 2.1, lcp: 2.8 },
      desktop: { psi: 88, fcp: 1.5, lcp: 2.0 }
    },
    competitor2: {
      mobile: { psi: 78, fcp: 2.4, lcp: 3.2 },
      desktop: { psi: 82, fcp: 1.8, lcp: 2.3 }
    }
  }

  const reviewsOverTime = [
    { date: '2023-10', myBusiness: 35, competitor1: 42, competitor2: 28 },
    { date: '2023-11', myBusiness: 38, competitor1: 45, competitor2: 30 },
    { date: '2023-12', myBusiness: 42, competitor1: 48, competitor2: 32 },
    { date: '2024-01', myBusiness: 45, competitor1: 50, competitor2: 35 },
    { date: '2024-02', myBusiness: 48, competitor1: 52, competitor2: 38 },
    { date: '2024-03', myBusiness: 52, competitor1: 55, competitor2: 40 }
  ]

  const mediaPosts = {
    myBusiness: {
      videos: 12,
      images: 45,
      streetViews: 2,
      panoramas: 3,
      total: 62
    },
    competitor1: {
      videos: 15,
      images: 52,
      streetViews: 2,
      panoramas: 4,
      total: 73
    },
    competitor2: {
      videos: 8,
      images: 38,
      streetViews: 1,
      panoramas: 2,
      total: 49
    }
  }

  const postsOverTime = [
    { month: 'Oct', myBusiness: 8, competitor1: 10, competitor2: 6 },
    { month: 'Nov', myBusiness: 10, competitor1: 12, competitor2: 7 },
    { month: 'Dec', myBusiness: 12, competitor1: 13, competitor2: 8 },
    { month: 'Jan', myBusiness: 11, competitor1: 14, competitor2: 9 },
    { month: 'Feb', myBusiness: 13, competitor1: 15, competitor2: 10 },
    { month: 'Mar', myBusiness: 15, competitor1: 16, competitor2: 11 }
  ]

  const postsByType = {
    myBusiness: {
      standard: 25,
      event: 8,
      offer: 5
    },
    competitor1: {
      standard: 28,
      event: 10,
      offer: 7
    },
    competitor2: {
      standard: 20,
      event: 6,
      offer: 4
    }
  }

  return (
    <Box>
      <PageHeader 
        title="Business Audit Report"
        subtitle={`${businessDetails.name} - ${businessDetails.location}`}
      />

      <SimpleGrid columns={1} spacing={6}>
        {/* Business Details */}
        <Card>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Text fontSize="lg" fontWeight="bold">Business Details</Text>
              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text fontWeight="bold">Keyword</Text>
                  <Text>{businessDetails.keyword}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Place ID</Text>
                  <Text>{businessDetails.placeId}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Address</Text>
                  <Text>{businessDetails.address}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Store Code</Text>
                  <Text>{businessDetails.storeCode}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Schedule</Text>
                  <Text>{businessDetails.schedule}</Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Key Metrics */}
        <SimpleGrid columns={3} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>AGR</StatLabel>
                <StatNumber>{metrics.agr}%</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>ATGR</StatLabel>
                <StatNumber>{metrics.atgr}%</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>SoLV</StatLabel>
                <StatNumber>{metrics.solv}%</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Reviews Over Time */}
        <Card>
          <CardBody>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Reviews Over Time</Text>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reviewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="myBusiness" stroke="#3182CE" name="My Business" />
                <Line type="monotone" dataKey="competitor1" stroke="#38A169" name="Competitor 1" />
                <Line type="monotone" dataKey="competitor2" stroke="#E53E3E" name="Competitor 2" />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Page Speed Insights */}
        <Card>
          <CardBody>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Page Speed Insights</Text>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Business</Th>
                  <Th>Device</Th>
                  <Th isNumeric>PSI</Th>
                  <Th isNumeric>FCP</Th>
                  <Th isNumeric>LCP</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.entries(pageSpeedInsights).map(([business, data]) => (
                  <Fragment key={business}>
                    <Tr>
                      <Td rowSpan={2}>{business === 'myBusiness' ? 'My Business' : `Competitor ${business.slice(-1)}`}</Td>
                      <Td><Icon as={FaMobile} mr={2} />Mobile</Td>
                      <Td isNumeric>
                        <Badge colorScheme={data.mobile.psi >= 90 ? 'green' : data.mobile.psi >= 50 ? 'yellow' : 'red'}>
                          {data.mobile.psi}
                        </Badge>
                      </Td>
                      <Td isNumeric>{data.mobile.fcp}s</Td>
                      <Td isNumeric>{data.mobile.lcp}s</Td>
                    </Tr>
                    <Tr>
                      <Td><Icon as={FaDesktop} mr={2} />Desktop</Td>
                      <Td isNumeric>
                        <Badge colorScheme={data.desktop.psi >= 90 ? 'green' : data.desktop.psi >= 50 ? 'yellow' : 'red'}>
                          {data.desktop.psi}
                        </Badge>
                      </Td>
                      <Td isNumeric>{data.desktop.fcp}s</Td>
                      <Td isNumeric>{data.desktop.lcp}s</Td>
                    </Tr>
                  </Fragment>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  )
}

export default Test