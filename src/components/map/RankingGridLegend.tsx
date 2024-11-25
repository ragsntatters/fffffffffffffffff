import { Box, VStack, HStack, Text, Icon, Divider } from '@chakra-ui/react'
import { FaCircle } from 'react-icons/fa'

interface RankingGridLegendProps {
  gridSize: string
  radius: number
  unit: string
}

const RankingGridLegend = ({ gridSize, radius, unit }: RankingGridLegendProps) => {
  const [rows, cols] = gridSize.split('x').map(Number)
  const totalPoints = rows * cols
  const coverage = Math.round((totalPoints / (Math.PI * radius * radius)) * 100)

  return (
    <Box 
      p={4} 
      bg="white" 
      borderRadius="md" 
      boxShadow="sm"
      border="1px"
      borderColor="gray.200"
    >
      <VStack align="start" spacing={4}>
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={2}>Grid Configuration</Text>
          <HStack spacing={6}>
            <Box>
              <Text fontSize="xs" color="gray.600">Size</Text>
              <Text fontSize="sm" fontWeight="medium">{gridSize}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.600">Points</Text>
              <Text fontSize="sm" fontWeight="medium">{totalPoints}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.600">Radius</Text>
              <Text fontSize="sm" fontWeight="medium">{radius} {unit}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.600">Coverage</Text>
              <Text fontSize="sm" fontWeight="medium">{coverage}%</Text>
            </Box>
          </HStack>
        </Box>

        <Divider />
        
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={2}>Ranking Colors</Text>
          <HStack spacing={6}>
            <HStack>
              <Icon as={FaCircle} color="green.500" boxSize={3} />
              <Text fontSize="sm">Top 3</Text>
            </HStack>
            <HStack>
              <Icon as={FaCircle} color="yellow.500" boxSize={3} />
              <Text fontSize="sm">Top 4-10</Text>
            </HStack>
            <HStack>
              <Icon as={FaCircle} color="red.500" boxSize={3} />
              <Text fontSize="sm">Below Top 10</Text>
            </HStack>
          </HStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default RankingGridLegend