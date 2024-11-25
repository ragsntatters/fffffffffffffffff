import {
  VStack,
  Box,
  Text,
  HStack,
  Icon,
  List,
  ListItem
} from '@chakra-ui/react'
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa'

interface LocationSearchResultsProps {
  results: any[]
  onSelect: (location: any) => void
}

const LocationSearchResults = ({ results, onSelect }: LocationSearchResultsProps) => {
  return (
    <List
      spacing={0}
      borderWidth={1}
      borderRadius="md"
      maxH="200px"
      overflowY="auto"
    >
      {results.map((location) => (
        <ListItem
          key={location.id}
          p={3}
          cursor="pointer"
          _hover={{ bg: 'gray.50' }}
          onClick={() => onSelect(location)}
          borderBottomWidth={1}
          _last={{ borderBottomWidth: 0 }}
        >
          <HStack spacing={3}>
            <Icon as={FaMapMarkerAlt} color="gray.500" />
            <Box flex={1}>
              <Text fontWeight="medium">{location.name}</Text>
              <Text fontSize="sm" color="gray.600">
                {location.address}
              </Text>
              {location.rating && (
                <HStack spacing={1} mt={1}>
                  <Icon as={FaStar} color="yellow.400" boxSize={3} />
                  <Text fontSize="sm" color="gray.600">
                    {location.rating} ({location.reviews} reviews)
                  </Text>
                </HStack>
              )}
            </Box>
          </HStack>
        </ListItem>
      ))}
    </List>
  )
}

export default LocationSearchResults