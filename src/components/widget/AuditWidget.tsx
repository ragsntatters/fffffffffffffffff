import {
  VStack,
  Box,
  Input,
  Button,
  Text,
  Progress,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Spinner,
  Select,
  SimpleGrid,
  useToast
} from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { googlePlaces } from '../../lib/services/google/places-api'
import ContactForm from './ContactForm'
import AuditResults from './AuditResults'
import LocationSearchResults from './LocationSearchResults'

interface AuditWidgetProps {
  isPreview?: boolean
}

const AuditWidget = ({ isPreview = false }: AuditWidgetProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [auditProgress, setAuditProgress] = useState(0)
  const [auditComplete, setAuditComplete] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({
    keyword: '',
    gridSize: '3x3',
    radius: '',
    unit: 'km'
  })
  const searchTimeout = useRef(null)
  const toast = useToast()

  // For preview mode, set a default location
  useEffect(() => {
    if (isPreview) {
      setSelectedLocation({
        id: 'preview',
        name: 'Example Business',
        address: '123 Main St, City',
        rating: 4.5,
        reviews: 100
      })
    }
  }, [isPreview])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    searchTimeout.current = setTimeout(async () => {
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
          isClosable: true,
        })
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    setSearchResults([])
    setSearchTerm(location.name)
  }

  const runAudit = async () => {
    if (!formData.keyword || !formData.radius) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Simulate audit progress
    setAuditProgress(0)
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setAuditComplete(true)
          setShowContactForm(true)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleContactSubmit = async (contactData) => {
    try {
      // Send email with contact and audit data
      await fetch('/api/send-audit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'rags@digigo.co.nz',
          subject: 'New Audit Widget Lead',
          contactData,
          locationData: selectedLocation,
          auditData: formData,
          auditResults: {
            // Mock audit results
            rank: Math.floor(Math.random() * 20) + 1,
            visibility: Math.floor(Math.random() * 100),
            competitors: Math.floor(Math.random() * 10) + 1,
          }
        })
      })

      setShowContactForm(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit contact information',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <VStack spacing={6} align="stretch" width="100%" maxW="600px" mx="auto">
      {!auditComplete ? (
        <>
          <FormControl isRequired>
            <FormLabel>Search for your business</FormLabel>
            <InputGroup>
              <Input
                placeholder="Enter business name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  handleSearch(e.target.value)
                }}
              />
              <InputRightElement>
                {isSearching ? <Spinner size="sm" /> : <FaSearch />}
              </InputRightElement>
            </InputGroup>
          </FormControl>

          {searchResults.length > 0 && (
            <LocationSearchResults
              results={searchResults}
              onSelect={handleLocationSelect}
            />
          )}

          {selectedLocation && (
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Keyword</FormLabel>
                <Input
                  placeholder="Enter keyword to track"
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel>Grid Size</FormLabel>
                  <Select
                    value={formData.gridSize}
                    onChange={(e) => setFormData({ ...formData, gridSize: e.target.value })}
                  >
                    <option value="3x3">3x3</option>
                    <option value="5x5">5x5</option>
                    <option value="7x7">7x7</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Radius</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter radius"
                    value={formData.radius}
                    onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Unit</FormLabel>
                <Select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="km">Kilometers</option>
                  <option value="mi">Miles</option>
                </Select>
              </FormControl>

              {!auditProgress && (
                <Button
                  colorScheme="blue"
                  onClick={runAudit}
                  isDisabled={!formData.keyword || !formData.radius}
                >
                  Run Free Audit
                </Button>
              )}
            </VStack>
          )}

          {auditProgress > 0 && (
            <Box>
              <Text mb={2}>Running audit...</Text>
              <Progress value={auditProgress} size="sm" colorScheme="blue" />
            </Box>
          )}
        </>
      ) : showContactForm ? (
        <ContactForm onSubmit={handleContactSubmit} />
      ) : (
        <AuditResults location={selectedLocation} auditData={formData} />
      )}
    </VStack>
  )
}

export default AuditWidget