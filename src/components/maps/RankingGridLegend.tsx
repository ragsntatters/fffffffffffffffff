import { Box, HStack, Text, VStack } from '@chakra-ui/react'

interface RankingGridLegendProps {
  gridSize: string
  radius: number
  unit: string
}

const RankingGridLegend = ({ gridSize, radius, unit }: RankingGridLegendProps) => {
  return (
    <VStack spacing={2} align="start" width="100%" p={4} bg="gray.50" borderRadius="md">
      <Text fontWeight="bold">Grid Configuration</Text>
      <HStack spacing={4}>
        <HStack>
          <Text fontSize="sm" color="gray.600">Grid Size:</Text>
          <Text fontSize="sm" fontWeight="medium">{gridSize}</Text>
        </HStack>
        <HStack>
          <Text fontSize="sm" color="gray.600">Radius:</Text>
          <Text fontSize="sm" fontWeight="medium">{radius} {unit}</Text>
        </HStack>
      </HStack>
      
      <Text fontWeight="bold" mt={2}>Ranking Colors</Text>
      <HStack spacing={6}>
        <HStack>
          <Box w="12px" h="12px" borderRadius="full" bg="green.500" />
          <Text fontSize="sm">Top 3</Text>
        </HStack>
        <HStack>
          <Box w="12px" h="12px" borderRadius="full" bg="yellow.500" />
          <Text fontSize="sm">Top 4-10</Text>
        </HStack>
        <HStack>
          <Box w="12px" h="12px" borderRadius="full" bg="red.500" />
          <Text fontSize="sm">Below Top 10</Text>
        </HStack>
      </HStack>
    </VStack>
  )
}

export default RankingGridLegend