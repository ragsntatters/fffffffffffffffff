import {
  Box,
  SimpleGrid,
  Text,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody
} from '@chakra-ui/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MetricData {
  current: number
  trend: number
  clicks: number
  clicksTrend: number
  data: Array<{
    date: string
    value: number
    clicks: number
  }>
}

interface BusinessMetricsCardProps {
  title: string
  metrics: MetricData
}

const BusinessMetricsCard = ({ title, metrics }: BusinessMetricsCardProps) => (
  <Box>
    <Text fontWeight="medium" mb={2}>{title}</Text>
    <SimpleGrid columns={2} spacing={4} mb={4}>
      <Stat>
        <StatLabel>Impressions</StatLabel>
        <HStack>
          <StatNumber>{metrics.current}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {metrics.trend}%
          </StatHelpText>
        </HStack>
      </Stat>
      <Stat>
        <StatLabel>Clicks</StatLabel>
        <HStack>
          <StatNumber>{metrics.clicks}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {metrics.clicksTrend}%
          </StatHelpText>
        </HStack>
      </Stat>
    </SimpleGrid>
    <Box height="200px">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={metrics.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#F6AD55" 
            strokeWidth={2} 
            name="Impressions"
          />
          <Line 
            type="monotone" 
            dataKey="clicks" 
            stroke="#4299E1" 
            strokeWidth={2} 
            name="Clicks"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Box>
)

export default BusinessMetricsCard