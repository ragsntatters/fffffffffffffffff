import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import { FallbackProps } from 'react-error-boundary'

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <Box p={8}>
      <VStack spacing={4} align="start">
        <Heading size="lg" color="red.500">Something went wrong</Heading>
        <Text>{error.message}</Text>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </VStack>
    </Box>
  )
}

export default ErrorFallback