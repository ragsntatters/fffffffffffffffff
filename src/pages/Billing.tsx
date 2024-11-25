import { Box, Text, SimpleGrid, Button, Table, Thead, Tbody, Tr, Th, Td, Progress } from '@chakra-ui/react'
import { FaCreditCard } from 'react-icons/fa'
import PageHeader from '../components/PageHeader'

const Billing = () => {
  // Mock data for billing information
  const currentPlan = {
    name: 'Pro',
    price: 99,
    billingCycle: 'monthly',
  }

  const apiUsage = {
    used: 8500,
    limit: 10000,
  }

  const billingHistory = [
    { id: 1, date: '2023-04-01', amount: 99, status: 'Paid' },
    { id: 2, date: '2023-03-01', amount: 99, status: 'Paid' },
    { id: 3, date: '2023-02-01', amount: 99, status: 'Paid' },
  ]

  return (
    <Box>
      <PageHeader 
        title="Billing & Subscription"
        subtitle="Manage your subscription plan and billing information"
      />
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={8}>
        <Box p={5} shadow="sm" borderWidth="1px" borderRadius="md" bg="white">
          <Text fontSize="lg" fontWeight="bold" mb={4}>Current Plan</Text>
          <Text fontSize="2xl" fontWeight="bold">{currentPlan.name}</Text>
          <Text>${currentPlan.price}/{currentPlan.billingCycle}</Text>
          <Button mt={4} colorScheme="blue">Upgrade Plan</Button>
        </Box>
        
        <Box p={5} shadow="sm" borderWidth="1px" borderRadius="md" bg="white">
          <Text fontSize="lg" fontWeight="bold" mb={4}>API Usage</Text>
          <Text mb={2}>{apiUsage.used} / {apiUsage.limit} requests</Text>
          <Progress value={(apiUsage.used / apiUsage.limit) * 100} colorScheme="blue" />
          <Button mt={4} colorScheme="green">Purchase Additional Credits</Button>
        </Box>
      </SimpleGrid>

      <Box p={5} shadow="sm" borderWidth="1px" borderRadius="md" bg="white" mb={8}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>Payment Method</Text>
        <Button leftIcon={<FaCreditCard />}>Update Payment Method</Button>
      </Box>

      <Box p={5} shadow="sm" borderWidth="1px" borderRadius="md" bg="white">
        <Text fontSize="lg" fontWeight="bold" mb={4}>Billing History</Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {billingHistory.map((item) => (
              <Tr key={item.id}>
                <Td>{item.date}</Td>
                <Td>${item.amount}</Td>
                <Td>{item.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}

export default Billing