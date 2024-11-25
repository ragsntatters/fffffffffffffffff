import { useState } from 'react'
import { Box, SimpleGrid, Button, HStack, useDisclosure, Icon } from '@chakra-ui/react'
import { FaPlus, FaMapMarkerAlt } from 'react-icons/fa'
import { AddLocationModal } from '../components/AddLocationModal'
import { useNavigate } from 'react-router-dom'
import HeroHeader from '../components/HeroHeader'
import LocationCard from '../components/LocationCard'

const Locations = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: 'Downtown Store',
      address: '123 Main St, San Francisco, CA',
      phone: '(415) 555-0123',
      description: 'Our flagship location in the heart of downtown, serving artisanal coffee and fresh pastries daily. Known for our welcoming atmosphere and expert baristas who craft the perfect cup every time.',
      image: 'https://via.placeholder.com/150',
      rating: 4.5,
      reviewCount: 157,
      trackedKeywords: 25,
      avgAGR: 85,
      ATGR: 78,
      SoLV: 50,
      primaryCategory: 'Restaurant',
      secondaryCategory: 'Coffee Shop',
      businessHours: {
        monday: '7:00 AM - 8:00 PM',
        tuesday: '7:00 AM - 8:00 PM',
        wednesday: '7:00 AM - 8:00 PM',
        thursday: '7:00 AM - 8:00 PM',
        friday: '7:00 AM - 9:00 PM',
        saturday: '8:00 AM - 9:00 PM',
        sunday: '8:00 AM - 7:00 PM'
      },
      attributes: {
        payments: ['Credit Cards', 'Apple Pay', 'Google Pay'],
        accessibility: ['Wheelchair accessible', 'Gender-neutral restroom'],
        amenities: ['Wi-Fi', 'Outdoor seating', 'Power outlets']
      }
    },
    {
      id: 2,
      name: 'Westside Branch',
      address: '456 Oak Ave, San Francisco, CA',
      phone: '(415) 555-0124',
      description: 'Serving the westside community since 2020, this location features a spacious interior perfect for working and studying. Our specialty is pour-over coffee and we host weekly coffee tasting events.',
      image: 'https://via.placeholder.com/150',
      rating: 4.8,
      reviewCount: 203,
      trackedKeywords: 18,
      avgAGR: 92,
      ATGR: 85,
      SoLV: 65,
      primaryCategory: 'Cafe',
      secondaryCategory: 'Bakery',
      businessHours: {
        monday: '6:30 AM - 7:00 PM',
        tuesday: '6:30 AM - 7:00 PM',
        wednesday: '6:30 AM - 7:00 PM',
        thursday: '6:30 AM - 7:00 PM',
        friday: '6:30 AM - 8:00 PM',
        saturday: '7:00 AM - 8:00 PM',
        sunday: '7:00 AM - 6:00 PM'
      },
      attributes: {
        payments: ['Credit Cards', 'Apple Pay', 'Cash'],
        accessibility: ['Wheelchair accessible', 'Service animal friendly'],
        amenities: ['Wi-Fi', 'Study space', 'Meeting rooms']
      }
    }
  ])

  const handleAddLocation = (newLocation) => {
    setLocations([...locations, { ...newLocation, id: locations.length + 1 }])
  }

  const handleVisitDashboard = (locationId) => {
    navigate(`/locations/${locationId}`)
  }

  return (
    <Box>
      <HeroHeader 
        icon={FaMapMarkerAlt}
        title="Location Management"
        subtitle="Manage all your business locations from one central dashboard. Track performance metrics, monitor rankings, and maintain consistent information across all your Google Business Profiles."
      />

      <HStack justify="flex-end" mb={6}>
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onOpen}>
          Add Location
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {locations.map((location) => (
          <LocationCard 
            key={location.id}
            id={location.id}
            name={location.name}
            address={location.address}
            phone={location.phone}
            description={location.description}
            image={location.image}
            rating={location.rating}
            reviewCount={location.reviewCount}
            trackedKeywords={location.trackedKeywords}
            avgAGR={location.avgAGR}
            ATGR={location.ATGR}
            SoLV={location.SoLV}
            primaryCategory={location.primaryCategory}
            secondaryCategory={location.secondaryCategory}
            businessHours={location.businessHours}
            attributes={location.attributes}
            onVisitDashboard={() => handleVisitDashboard(location.id)}
          />
        ))}
      </SimpleGrid>

      <AddLocationModal
        isOpen={isOpen}
        onClose={onClose}
        onAddLocation={handleAddLocation}
      />
    </Box>
  )
}

export default Locations