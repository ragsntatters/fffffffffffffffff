import {
  Box,
  Text,
  HStack,
  VStack,
  Button,
  Badge,
  SimpleGrid,
  Icon,
  Image,
  useDisclosure,
  Collapse
} from '@chakra-ui/react'
import { 
  FaStar, 
  FaUsers, 
  FaCog, 
  FaChevronDown, 
  FaChevronUp,
  FaMapMarkerAlt,
  FaPhone
} from 'react-icons/fa'
import { LocationTeamModal } from './LocationTeamModal'
import { LocationSettingsModal } from './LocationSettingsModal'
import { useState } from 'react'
import { MetricTooltip } from './MetricTooltips'

interface LocationCardProps {
  id: string | number
  name: string
  address: string
  phone: string
  description: string
  image: string
  rating: number
  reviewCount: number
  trackedKeywords: number
  avgAGR: number
  ATGR: number
  SoLV: number
  primaryCategory: string
  secondaryCategory: string
  businessHours?: Record<string, string>
  attributes?: {
    payments?: string[]
    accessibility?: string[]
    amenities?: string[]
  }
  onVisitDashboard: () => void
}

const LocationCard = ({
  id,
  name,
  address,
  phone,
  description,
  image,
  rating,
  reviewCount,
  trackedKeywords,
  avgAGR,
  ATGR,
  SoLV,
  primaryCategory,
  secondaryCategory,
  businessHours,
  attributes,
  onVisitDashboard
}: LocationCardProps) => {
  const [showMore, setShowMore] = useState(false)
  const { 
    isOpen: isTeamModalOpen, 
    onOpen: onTeamModalOpen, 
    onClose: onTeamModalClose 
  } = useDisclosure()
  const { 
    isOpen: isSettingsModalOpen, 
    onOpen: onSettingsModalOpen, 
    onClose: onSettingsModalClose 
  } = useDisclosure()

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} bg="white" shadow="sm">
      <VStack align="stretch" spacing={4}>
        <HStack spacing={4} justify="space-between">
          <HStack spacing={4} flex={1}>
            <Image
              src={image}
              alt={name}
              borderRadius="full"
              boxSize="50px"
              objectFit="cover"
            />
            <Box flex={1}>
              <Text fontSize="xl" fontWeight="bold" mb={1}>{name}</Text>
              <HStack>
                <Icon as={FaMapMarkerAlt} color="gray.500" />
                <Text fontSize="sm" color="gray.600">{address}</Text>
              </HStack>
            </Box>
          </HStack>
          <HStack>
            <Button
              size="sm"
              leftIcon={<FaUsers />}
              onClick={onTeamModalOpen}
            >
              Team
            </Button>
            <Button
              size="sm"
              leftIcon={<FaCog />}
              onClick={onSettingsModalOpen}
            >
              Settings
            </Button>
          </HStack>
        </HStack>

        <Text noOfLines={showMore ? undefined : 2} color="gray.600">
          {description}
        </Text>
        <Button 
          size="sm" 
          variant="ghost" 
          rightIcon={showMore ? <FaChevronUp /> : <FaChevronDown />}
          onClick={() => setShowMore(!showMore)}
          alignSelf="start"
        >
          {showMore ? 'Show Less' : 'Show More'}
        </Button>

        <HStack spacing={4}>
          <HStack>
            <Icon as={FaStar} color="yellow.400" />
            <Text fontWeight="bold">{rating}</Text>
            <Text color="gray.600">({reviewCount} reviews)</Text>
          </HStack>
          <HStack spacing={2}>
            <Badge colorScheme="blue">{primaryCategory}</Badge>
            {secondaryCategory && (
              <Badge colorScheme="gray">{secondaryCategory}</Badge>
            )}
          </HStack>
        </HStack>

        <SimpleGrid columns={4} spacing={4}>
          <Box p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Text fontSize="sm" color="gray.600" mb={1}>Tracked Keywords</Text>
            <Text fontSize="xl" fontWeight="bold">{trackedKeywords}</Text>
          </Box>
          <Box p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Text fontSize="sm" color="gray.600" mb={1}>
              <MetricTooltip metric="AGR">Avg. AGR</MetricTooltip>
            </Text>
            <Text fontSize="xl" fontWeight="bold">{avgAGR}%</Text>
          </Box>
          <Box p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Text fontSize="sm" color="gray.600" mb={1}>
              <MetricTooltip metric="ATGR">ATGR</MetricTooltip>
            </Text>
            <Text fontSize="xl" fontWeight="bold">{ATGR}%</Text>
          </Box>
          <Box p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Text fontSize="sm" color="gray.600" mb={1}>
              <MetricTooltip metric="SoLV">SoLV</MetricTooltip>
            </Text>
            <Text fontSize="xl" fontWeight="bold">{SoLV}%</Text>
          </Box>
        </SimpleGrid>

        <Collapse in={showMore}>
          <VStack align="stretch" spacing={4} mt={2}>
            <Box>
              <Text fontWeight="bold" mb={2}>Contact Information</Text>
              <HStack>
                <Icon as={FaPhone} color="gray.500" />
                <Text>{phone}</Text>
              </HStack>
            </Box>

            {businessHours && (
              <Box>
                <Text fontWeight="bold" mb={2}>Business Hours</Text>
                <SimpleGrid columns={2} spacing={2}>
                  {Object.entries(businessHours).map(([day, hours]) => (
                    <HStack key={day} justify="space-between">
                      <Text textTransform="capitalize">{day}:</Text>
                      <Text>{hours}</Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {attributes && (
              <Box>
                <Text fontWeight="bold" mb={2}>Business Attributes</Text>
                <SimpleGrid columns={3} spacing={4}>
                  {attributes.payments && (
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                        Payments Accepted
                      </Text>
                      {attributes.payments.map(payment => (
                        <Badge key={payment} mr={1} mb={1}>
                          {payment}
                        </Badge>
                      ))}
                    </Box>
                  )}
                  {attributes.accessibility && (
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                        Accessibility
                      </Text>
                      {attributes.accessibility.map(feature => (
                        <Badge key={feature} mr={1} mb={1}>
                          {feature}
                        </Badge>
                      ))}
                    </Box>
                  )}
                  {attributes.amenities && (
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                        Amenities
                      </Text>
                      {attributes.amenities.map(amenity => (
                        <Badge key={amenity} mr={1} mb={1}>
                          {amenity}
                        </Badge>
                      ))}
                    </Box>
                  )}
                </SimpleGrid>
              </Box>
            )}
          </VStack>
        </Collapse>

        <Button colorScheme="blue" size="sm" onClick={onVisitDashboard}>
          Visit Dashboard
        </Button>
      </VStack>

      <LocationTeamModal
        isOpen={isTeamModalOpen}
        onClose={onTeamModalClose}
        locationId={id.toString()}
        locationName={name}
      />

      <LocationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={onSettingsModalClose}
        locationId={id.toString()}
        locationName={name}
      />
    </Box>
  )
}

export default LocationCard