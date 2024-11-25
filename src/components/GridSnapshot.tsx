import {
  Box,
  Badge,
  Text,
  HStack,
  SimpleGrid,
  Image
} from '@chakra-ui/react'

interface GridSnapshotProps {
  snapshot: {
    date: string
    image: string
    rank: number
    avgAGR: number
    ATGR: number
    SoLV: number
  }
}

const GridSnapshot = ({ snapshot }: GridSnapshotProps) => (
  <Box position="relative" height="100%">
    <Image
      src={snapshot.image}
      alt={`Grid snapshot from ${snapshot.date}`}
      borderRadius="md"
      width="100%"
      height="100%"
      objectFit="cover"
    />
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      bg="blackAlpha.700"
      p={2}
      borderBottomRadius="md"
    >
      <HStack justify="space-between" color="white">
        <Text fontSize="sm">{snapshot.date}</Text>
        <Badge colorScheme={snapshot.rank <= 3 ? 'green' : 'yellow'}>
          Rank #{snapshot.rank}
        </Badge>
      </HStack>
      <SimpleGrid columns={3} spacing={2} mt={1}>
        <Text fontSize="xs" color="white">AGR: {snapshot.avgAGR}%</Text>
        <Text fontSize="xs" color="white">ATGR: {snapshot.ATGR}%</Text>
        <Text fontSize="xs" color="white">SoLV: {snapshot.SoLV}%</Text>
      </SimpleGrid>
    </Box>
  </Box>
)

export default GridSnapshot