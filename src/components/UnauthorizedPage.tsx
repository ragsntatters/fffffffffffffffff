import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export default function UnauthorizedPage() {
  return (
    <Box minH="100vh" py={20} px={4}>
      <VStack spacing={8} mx="auto" maxW="lg">
        <Heading>Access Denied</Heading>
        <Text>You don't have permission to access this page.</Text>
        <Link to="/">
          <Button colorScheme="blue">Go to Home</Button>
        </Link>
      </VStack>
    </Box>
  )
}