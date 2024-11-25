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
  VStack,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  HStack,
  Alert,
  AlertIcon,
  Badge,
  FormHelperText,
  useToast,
  Code,
  Icon,
  useClipboard,
  Tooltip,
  Divider
} from '@chakra-ui/react'
import { FaFacebook, FaInstagram, FaWordpress, FaGoogle, FaCheck, FaKey, FaCopy } from 'react-icons/fa'

interface LocationSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  locationId: string
  locationName: string
}

export const LocationSettingsModal = ({ isOpen, onClose, locationId, locationName }: LocationSettingsModalProps) => {
  const [isFBConnected, setIsFBConnected] = useState(false)
  const [selectedFbPage, setSelectedFbPage] = useState('')
  const [fbPages, setFbPages] = useState([])
  const toast = useToast()
  const locationIdString = `loc_${locationId}`
  const { hasCopied, onCopy } = useClipboard(locationIdString)

  const handleFacebookLogin = () => {
    // This would typically use the Facebook SDK
    console.log('Initiating Facebook login')
    // Simulating successful connection
    setIsFBConnected(true)
    setFbPages([
      { id: '1', name: 'Business Page 1' },
      { id: '2', name: 'Business Page 2' }
    ])
  }

  const handleGoogleConnect = () => {
    toast({
      title: "Google Business Profile",
      description: "Please contact support to set up your GBP API connection.",
      status: "info",
      duration: 5000,
      isClosable: true,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Location Settings - {locationName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            {/* Location ID Section */}
            <Box p={4} borderWidth="1px" borderRadius="lg" bg="gray.50" width="100%">
              <HStack mb={4}>
                <Icon as={FaKey} />
                <Text fontWeight="bold">Location ID</Text>
              </HStack>
              <HStack>
                <Code p={3} flex="1" borderRadius="md" fontSize="md">
                  {locationIdString}
                </Code>
                <Tooltip
                  label={hasCopied ? "Copied!" : "Copy Location ID"}
                  closeOnClick={false}
                >
                  <Button
                    leftIcon={<FaCopy />}
                    onClick={onCopy}
                    size="sm"
                  >
                    {hasCopied ? "Copied!" : "Copy"}
                  </Button>
                </Tooltip>
              </HStack>
              <Text fontSize="sm" color="gray.600" mt={2}>
                Use this ID to reference this location in the API or widget integrations
              </Text>
            </Box>

            <Divider />

            {/* Google Business Profile Connection */}
            <Box p={4} borderWidth="1px" borderRadius="lg" bg="gray.50" width="100%">
              <HStack mb={4}>
                <FaGoogle size="24px" />
                <Text fontWeight="bold">Google Business Profile Connection</Text>
              </HStack>
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text>Connect your GBP API to enable:</Text>
                  <Text fontSize="sm" color="gray.600">
                    - Automated post publishing
                    - Review monitoring
                    - Performance tracking
                  </Text>
                </VStack>
              </Alert>
              <Button
                mt={4}
                colorScheme="red"
                leftIcon={<FaGoogle />}
                onClick={handleGoogleConnect}
                width="full"
              >
                Connect GBP API
              </Button>
            </Box>

            {/* Facebook Connection */}
            <Box p={4} borderWidth="1px" borderRadius="lg" bg="gray.50" width="100%">
              <HStack mb={4}>
                <FaFacebook size="24px" />
                <Text fontWeight="bold">Facebook Page Connection</Text>
                {isFBConnected && (
                  <Badge colorScheme="green" ml="auto">
                    <HStack spacing={1}>
                      <FaCheck />
                      <Text>Connected</Text>
                    </HStack>
                  </Badge>
                )}
              </HStack>

              {!isFBConnected ? (
                <VStack spacing={4} align="stretch">
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <VStack align="start" spacing={2}>
                      <Text>Connect your Facebook Page to enable cross-posting</Text>
                      <Text fontSize="sm" color="gray.600">
                        This will allow you to:
                        - Post directly to your Facebook Page
                        - Connect Instagram Business accounts
                        - View engagement metrics
                      </Text>
                    </VStack>
                  </Alert>
                  <Button
                    colorScheme="facebook"
                    onClick={handleFacebookLogin}
                    leftIcon={<FaFacebook />}
                    size="lg"
                    width="full"
                    bg="#1877F2"
                    color="white"
                    _hover={{ bg: '#1664D9' }}
                  >
                    Connect with Facebook
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    Facebook connected successfully
                  </Alert>
                  <FormControl>
                    <FormLabel>Select Facebook Page</FormLabel>
                    <Select
                      value={selectedFbPage}
                      onChange={(e) => setSelectedFbPage(e.target.value)}
                      bg="white"
                    >
                      <option value="">Select a page</option>
                      {fbPages.map(page => (
                        <option key={page.id} value={page.id}>
                          {page.name}
                        </option>
                      ))}
                    </Select>
                    <FormHelperText>
                      Choose the Facebook Page you want to manage
                    </FormHelperText>
                  </FormControl>
                  <Button variant="outline" colorScheme="red" size="sm">
                    Disconnect Facebook
                  </Button>
                </VStack>
              )}
            </Box>

            {/* Instagram Connection */}
            <Box p={4} borderWidth="1px" borderRadius="lg" bg="gray.50" width="100%">
              <HStack mb={4}>
                <FaInstagram size="24px" />
                <Text fontWeight="bold">Instagram Connection</Text>
              </HStack>
              <Alert status="warning" borderRadius="md" mb={4}>
                <AlertIcon />
                Connect a Facebook Page first to enable Instagram integration
              </Alert>
              <Button
                leftIcon={<FaInstagram />}
                isDisabled={!isFBConnected}
                width="full"
              >
                Connect Instagram
              </Button>
            </Box>

            {/* WordPress Connection */}
            <Box p={4} borderWidth="1px" borderRadius="lg" bg="gray.50" width="100%">
              <HStack mb={4}>
                <FaWordpress size="24px" />
                <Text fontWeight="bold">WordPress Connection</Text>
              </HStack>
              <FormControl mb={4}>
                <FormLabel>WordPress Site URL</FormLabel>
                <Input placeholder="https://your-site.com" bg="white" />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>API Key</FormLabel>
                <Input type="password" placeholder="Enter your WordPress API key" bg="white" />
              </FormControl>
              <Button
                leftIcon={<FaWordpress />}
                colorScheme="gray"
                width="full"
              >
                Connect WordPress
              </Button>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue">Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}