import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Badge,
  useToast,
  List,
  ListItem,
  Box,
  HStack,
  Icon,
  Spinner,
  InputGroup,
  InputRightElement,
  Checkbox,
  CheckboxGroup,
  Divider,
  Select,
  FormHelperText
} from '@chakra-ui/react'
import { FaMapMarkerAlt, FaStar, FaSearch } from 'react-icons/fa'
import { debounce } from 'lodash'
import { googlePlaces } from '../lib/services/google/places-api'

interface AddLocationModalProps {
  isOpen: boolean
  onClose: () => void
  onAddLocation: (location: any) => void
}

export const AddLocationModal = ({ isOpen, onClose, onAddLocation }: AddLocationModalProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [notifications, setNotifications] = useState({
    rankChanges: true,
    reviews: true,
    posts: true,
    competitors: false
  })
  const [notifyTeamMembers, setNotifyTeamMembers] = useState([])
  const toast = useToast()

  const handleSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await googlePlaces.searchPlaces(query)
      setSearchResults(results)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search locations',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setIsSearching(false)
    }
  }, 300)

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    setSearchResults([])
    setSearchTerm(location.name)
  }

  const handleSubmit = () => {
    if (!selectedLocation) {
      toast({
        title: 'Error',
        description: 'Please select a location',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    const newLocation = {
      ...selectedLocation,
      notifications,
      notifyTeamMembers
    }

    onAddLocation(newLocation)
    onClose()
    
    // Reset form
    setSearchTerm('')
    setSelectedLocation(null)
    setNotifications({
      rankChanges: true,
      reviews: true,
      posts: true,
      competitors: false
    })
    setNotifyTeamMembers([])
  }

  const teamMembers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' }
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Location</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>Search Business</FormLabel>
              <InputGroup>
                <Input
                  placeholder="Search for your business..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    handleSearch(e.target.value)
                  }}
                />
                {isSearching && (
                  <InputRightElement>
                    <Spinner size="sm" />
                  </InputRightElement>
                )}
              </InputGroup>
              {searchResults.length > 0 && !selectedLocation && (
                <Box
                  mt={2}
                  maxH="200px"
                  overflowY="auto"
                  borderWidth={1}
                  borderRadius="md"
                  boxShadow="sm"
                  position="absolute"
                  bg="white"
                  width="100%"
                  zIndex={1000}
                >
                  <List spacing={0}>
                    {searchResults.map((location) => (
                      <ListItem
                        key={location.id}
                        p={3}
                        cursor="pointer"
                        _hover={{ bg: 'gray.50' }}
                        onClick={() => handleLocationSelect(location)}
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
                </Box>
              )}
              {selectedLocation && (
                <Box mt={2} p={3} borderWidth={1} borderRadius="md">
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="green.500" />
                    <Box flex={1}>
                      <Text fontWeight="medium">{selectedLocation.name}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {selectedLocation.address}
                      </Text>
                    </Box>
                    <Badge colorScheme="green">Selected</Badge>
                  </HStack>
                </Box>
              )}
            </FormControl>

            <Divider />
            
            <Box width="100%">
              <Text mb={4} fontWeight="bold">Notification Settings</Text>
              <VStack align="start" spacing={3}>
                <Checkbox
                  isChecked={notifications.rankChanges}
                  onChange={(e) => setNotifications({ ...notifications, rankChanges: e.target.checked })}
                >
                  Notify on significant rank changes
                </Checkbox>
                <Checkbox
                  isChecked={notifications.reviews}
                  onChange={(e) => setNotifications({ ...notifications, reviews: e.target.checked })}
                >
                  Notify on new reviews
                </Checkbox>
                <Checkbox
                  isChecked={notifications.posts}
                  onChange={(e) => setNotifications({ ...notifications, posts: e.target.checked })}
                >
                  Notify when posts need approval
                </Checkbox>
                <Checkbox
                  isChecked={notifications.competitors}
                  onChange={(e) => setNotifications({ ...notifications, competitors: e.target.checked })}
                >
                  Notify on competitor changes
                </Checkbox>
              </VStack>
            </Box>

            <Box width="100%">
              <Text mb={4} fontWeight="bold">Notify Team Members</Text>
              <CheckboxGroup
                value={notifyTeamMembers}
                onChange={(values) => setNotifyTeamMembers(values)}
              >
                <VStack align="start" spacing={3}>
                  {teamMembers.map((member) => (
                    <Checkbox key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </Checkbox>
                  ))}
                </VStack>
              </CheckboxGroup>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Add Location
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}