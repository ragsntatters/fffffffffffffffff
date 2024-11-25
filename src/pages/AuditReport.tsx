import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Button,
  VStack,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  useToast,
  HStack,
  Badge,
  Heading,
  Divider,
  Skeleton
} from '@chakra-ui/react'
import { FaDownload } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import PageHeader from '../components/PageHeader'
import CompetitorCard from '../components/audit/CompetitorCard'
import RankingGrid from '../components/map/RankingGrid'
import RankingGridLegend from '../components/maps/RankingGridLegend'

const AuditReport = () => {
  const { id } = useParams()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [auditData, setAuditData] = useState<any>(null)

  useEffect(() => {
    // Simulate loading audit data
    setTimeout(() => {
      setAuditData({
        businessName: "Downtown Coffee Shop",
        dateGenerated: new Date().toLocaleDateString(),
        coordinates: {
          latitude: 47.6062,
          longitude: -122.3321
        },
        client: {
          name: "Downtown Coffee Shop",
          logo: "https://via.placeholder.com/50",
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
        competitors: [
          {
            name: "Starbucks Reserve",
            logo: "https://via.placeholder.com/50",
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
            name: "Seattle Coffee Works",
            logo: "https://via.placeholder.com/50",
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
          }
        ]
      })
      setIsLoading(false)
    }, 1000)
  }, [id])

  if (isLoading) {
    return (
      <Box maxW="100%" overflow="hidden">
        <Skeleton height="40px" mb={4} />
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
          <Skeleton height="400px" />
          <Skeleton height="400px" />
        </SimpleGrid>
        <Skeleton height="200px" mb={6} />
      </Box>
    )
  }

  if (!auditData) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Failed to load audit report. Please try again later.</Text>
      </Box>
    )
  }

  const postData = [
    { month: 'Oct', myBusiness: 8, competitor1: 10, competitor2: 6 },
    { month: 'Nov', myBusiness: 10, competitor1: 12, competitor2: 7 },
    { month: 'Dec', myBusiness: 12, competitor1: 13, competitor2: 8 },
    { month: 'Jan', myBusiness: 11, competitor1: 14, competitor2: 9 },
    { month: 'Feb', myBusiness: 13, competitor1: 15, competitor2: 10 },
    { month: 'Mar', myBusiness: 15, competitor1: 16, competitor2: 11 }
  ]

  const reviewData = [
    { month: 'Oct', myBusiness: 35, competitor1: 42, competitor2: 28 },
    { month: 'Nov', myBusiness: 38, competitor1: 45, competitor2: 30 },
    { month: 'Dec', myBusiness: 42, competitor1: 48, competitor2: 32 },
    { month: 'Jan', myBusiness: 45, competitor1: 50, competitor2: 35 },
    { month: 'Feb', myBusiness: 48, competitor1: 52, competitor2: 38 },
    { month: 'Mar', myBusiness: 52, competitor1: 55, competitor2: 40 }
  ]

  return (
    <Box maxW="100%" overflow="hidden">
      <PageHeader 
        title={`Audit Report: ${auditData.businessName}`}
        subtitle={`Generated on ${auditData.dateGenerated}`}
      />

      <Button
        leftIcon={<FaDownload />}
        colorScheme="blue"
        mb={6}
        onClick={() => toast({
          title: "Report Download Started",
          description: "Your PDF report is being generated and will download shortly.",
          status: "success",
          duration: 3000,
          isClosable: true,
        })}
      >
        Download Full Report
      </Button>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
        <Card height="full">
          <CardBody>
            <VStack height="100%" spacing={4}>
              <CompetitorCard 
                business={auditData.client} 
                isClient={true} 
                competitors={auditData.competitors}
              />
            </VStack>
          </CardBody>
        </Card>

        <Card height="full">
          <CardBody display="flex" flexDirection="column">
            <Heading size="md" mb={4}>Local Search Grid</Heading>
            <Box flex="1" minH="500px">
              <RankingGrid
                center={[auditData.coordinates.longitude, auditData.coordinates.latitude]}
                radius={2}
                gridSize="3x3"
                rankings={Array(9).fill(null).map(() => ({
                  position: [auditData.coordinates.longitude, auditData.coordinates.latitude],
                  rank: Math.floor(Math.random() * 20) + 1
                }))}
              />
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Box mb={6}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Top Competitors</Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {auditData.competitors.map((competitor) => (
            <CompetitorCard 
              key={competitor.name} 
              business={competitor}
              isClient={false}
              competitors={[auditData.client, ...auditData.competitors.filter(c => c !== competitor)]}
            />
          ))}
        </SimpleGrid>
      </Box>

      <Box mb={6}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Visual Comparison</Text>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card height="full">
            <CardBody>
              <Text fontSize="lg" fontWeight="bold" mb={4}>Total Posts Over Time</Text>
              <Box height="400px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={postData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="myBusiness"
                      name="My Business"
                      stroke="#3182CE"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                    {auditData.competitors.map((_, index) => (
                      <Line
                        key={`competitor${index + 1}`}
                        type="monotone"
                        dataKey={`competitor${index + 1}`}
                        name={`Competitor ${index + 1}`}
                        stroke={`hsl(${index * 60}, 70%, 50%)`}
                        strokeWidth={1}
                        dot={{ r: 4 }}
                        opacity={0.7}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card height="full">
            <CardBody>
              <Text fontSize="lg" fontWeight="bold" mb={4}>Total Reviews Over Time</Text>
              <Box height="400px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reviewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="myBusiness"
                      name="My Business"
                      stroke="#3182CE"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                    {auditData.competitors.map((_, index) => (
                      <Line
                        key={`competitor${index + 1}`}
                        type="monotone"
                        dataKey={`competitor${index + 1}`}
                        name={`Competitor ${index + 1}`}
                        stroke={`hsl(${index * 60}, 70%, 50%)`}
                        strokeWidth={1}
                        dot={{ r: 4 }}
                        opacity={0.7}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export default AuditReport