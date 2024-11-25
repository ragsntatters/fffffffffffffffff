import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  VStack,
  Text,
  HStack,
  Box
} from '@chakra-ui/react'

interface BusinessAttribute {
  category: string
  attributes: string[]
}

interface Business {
  name: string
  attributes: {
    accessibility: string[]
    amenities: string[]
    atmosphere: string[]
    children: string[]
    crowd: string[]
    diningOptions: string[]
    fromTheBusiness: string[]
    highlights: string[]
    offerings: string[]
    parking: string[]
    payments: string[]
    planning: string[]
    popularFor: string[]
    serviceOptions: string[]
  }
}

interface BusinessAttributesTableProps {
  businesses: Business[]
  clientIndex: number
}

const ATTRIBUTE_CATEGORIES = [
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'amenities', label: 'Amenities' },
  { key: 'atmosphere', label: 'Atmosphere' },
  { key: 'children', label: 'Children' },
  { key: 'crowd', label: 'Crowd' },
  { key: 'diningOptions', label: 'Dining Options' },
  { key: 'fromTheBusiness', label: 'From the Business' },
  { key: 'highlights', label: 'Highlights' },
  { key: 'offerings', label: 'Offerings' },
  { key: 'parking', label: 'Parking' },
  { key: 'payments', label: 'Payments' },
  { key: 'planning', label: 'Planning' },
  { key: 'popularFor', label: 'Popular For' },
  { key: 'serviceOptions', label: 'Service Options' }
]

// Mock data for demonstration
const mockBusinessData = {
  accessibility: ['Wheelchair accessible entrance', 'Wheelchair accessible restroom', 'Elevator'],
  amenities: ['Free Wi-Fi', 'Power outlets', 'Air conditioning', 'Outdoor seating'],
  atmosphere: ['Casual', 'Cozy', 'Modern', 'Family-friendly'],
  children: ['High chairs', 'Kids menu', 'Changing tables'],
  crowd: ['Tourists', 'Business people', 'Students', 'Families'],
  diningOptions: ['Breakfast', 'Lunch', 'Dinner', 'Takeout', 'Delivery'],
  fromTheBusiness: ['Locally owned', 'Eco-friendly', 'Community focused'],
  highlights: ['Award winning coffee', 'Fresh baked goods', 'Local ingredients'],
  offerings: ['Coffee', 'Tea', 'Pastries', 'Sandwiches', 'Salads'],
  parking: ['Street parking', 'Parking lot', 'Bike racks'],
  payments: ['Credit cards', 'Mobile payments', 'Cash'],
  planning: ['Reservations accepted', 'Private events', 'Catering'],
  popularFor: ['Coffee', 'Breakfast', 'Business meetings', 'Study sessions'],
  serviceOptions: ['Table service', 'Counter service', 'Drive-through']
}

const BusinessAttributesTable = ({ businesses, clientIndex }: BusinessAttributesTableProps) => {
  // If no businesses provided, create mock data
  const populatedBusinesses = businesses.length > 0 ? businesses : [
    {
      name: "Downtown Coffee Shop",
      attributes: {
        ...mockBusinessData,
        accessibility: ['Wheelchair accessible entrance', 'Wheelchair accessible restroom'],
        amenities: ['Free Wi-Fi', 'Power outlets', 'Air conditioning'],
        atmosphere: ['Casual', 'Cozy', 'Modern'],
        offerings: ['Coffee', 'Tea', 'Pastries', 'Sandwiches']
      }
    },
    {
      name: "Starbucks Reserve",
      attributes: {
        ...mockBusinessData,
        amenities: ['Free Wi-Fi', 'Power outlets', 'Air conditioning', 'Outdoor seating', 'Meeting rooms'],
        atmosphere: ['Modern', 'Upscale', 'Business casual'],
        offerings: ['Coffee', 'Tea', 'Pastries', 'Light meals']
      }
    },
    {
      name: "Seattle Coffee Works",
      attributes: {
        ...mockBusinessData,
        atmosphere: ['Artisanal', 'Rustic', 'Cozy'],
        offerings: ['Specialty coffee', 'Pour-over', 'Pastries']
      }
    },
    {
      name: "Bean & Brew",
      attributes: {
        ...mockBusinessData,
        atmosphere: ['Casual', 'Student-friendly', 'Relaxed'],
        offerings: ['Coffee', 'Tea', 'Smoothies', 'Light snacks']
      }
    },
    {
      name: "Cafe Allegro",
      attributes: {
        ...mockBusinessData,
        atmosphere: ['Historic', 'Artistic', 'Bohemian'],
        offerings: ['Coffee', 'Tea', 'Baked goods']
      }
    },
    {
      name: "Urban Coffee House",
      attributes: {
        ...mockBusinessData,
        atmosphere: ['Industrial', 'Modern', 'Hip'],
        offerings: ['Coffee', 'Tea', 'Breakfast', 'Lunch']
      }
    }
  ]

  const hasUniqueFeature = (category: string, attribute: string, businessIndex: number) => {
    if (businessIndex !== clientIndex) return false
    return !populatedBusinesses.some((b, i) => 
      i !== clientIndex && b.attributes[category].includes(attribute)
    )
  }

  const isMissingFeature = (category: string, attribute: string, businessIndex: number) => {
    if (businessIndex !== clientIndex) return false
    return !populatedBusinesses[clientIndex].attributes[category].includes(attribute)
  }

  return (
    <Box 
      maxWidth="100%"
      overflowX="auto"
      sx={{
        '&::-webkit-scrollbar': {
          height: '8px',
          borderRadius: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
      }}
    >
      <Table size="sm">
        <Thead>
          <Tr>
            <Th position="sticky" left={0} bg="white" zIndex={1} width="200px">
              Attribute Category
            </Th>
            {populatedBusinesses.map((business, index) => (
              <Th key={business.name} minWidth="200px">
                <HStack>
                  <Text>{business.name}</Text>
                  {index === clientIndex && (
                    <Badge colorScheme="blue">Your Business</Badge>
                  )}
                </HStack>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {ATTRIBUTE_CATEGORIES.map(category => (
            <Tr key={category.key}>
              <Td 
                position="sticky" 
                left={0} 
                bg="white" 
                zIndex={1}
                width="200px"
                fontWeight="semibold"
              >
                {category.label}
              </Td>
              {populatedBusinesses.map((business, businessIndex) => (
                <Td key={`${category.key}-${business.name}`} bg={businessIndex === clientIndex ? 'blue.50' : undefined}>
                  <VStack align="start" spacing={1}>
                    {business.attributes[category.key].map((attr, i) => (
                      <Badge
                        key={i}
                        colorScheme={
                          hasUniqueFeature(category.key, attr, businessIndex) ? 'green' :
                          isMissingFeature(category.key, attr, businessIndex) ? 'red' :
                          undefined
                        }
                      >
                        {attr}
                      </Badge>
                    ))}
                  </VStack>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default BusinessAttributesTable