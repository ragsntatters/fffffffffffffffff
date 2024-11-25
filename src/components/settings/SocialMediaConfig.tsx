import {
  VStack,
  Box,
  Text,
  Button,
  HStack,
  Badge,
  Alert,
  AlertIcon,
  Select,
  Card,
  CardBody,
  useToast,
  Icon,
  Divider,
  List,
  ListItem,
  ListIcon,
  Link
} from '@chakra-ui/react'
import { useState } from 'react'
import { 
  FaFacebook, 
  FaInstagram, 
  FaCheck, 
  FaExternalLinkAlt, 
  FaStore, 
  FaGlobe,
  FaShareAlt
} from 'react-icons/fa'

interface SocialMediaConfigProps {
  onUpdate: (config: any) => void
}

const SocialMediaConfig = ({ onUpdate }: SocialMediaConfigProps) => {
  const [fbConfig, setFbConfig] = useState({
    connected: false,
    selectedPage: '',
    pages: []
  })

  const [igConfig, setIgConfig] = useState({
    connected: false,
    accountId: '',
    accounts: []
  })

  const toast = useToast()

  const handleFacebookConnect = () => {
    // Use your SaaS platform's Facebook App ID
    window.FB.login((response) => {
      if (response.authResponse) {
        // Send auth response to your backend
        // Backend will:
        // 1. Exchange short-lived token for long-lived token
        // 2. Get list of pages user manages
        // 3. Store tokens securely
        // 4. Return pages list to frontend
        
        // Simulate successful connection
        setFbConfig({
          ...fbConfig,
          connected: true,
          pages: [
            { id: '1', name: 'Business Page 1' },
            { id: '2', name: 'Business Page 2' }
          ]
        })

        toast({
          title: "Facebook Connected",
          description: "Successfully connected your Facebook Business Page",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      }
    }, {
      scope: 'pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish'
    })
  }

  const handleInstagramConnect = async () => {
    if (!fbConfig.selectedPage) {
      toast({
        title: "Select Facebook Page",
        description: "Please select a Facebook Page first to connect its Instagram account",
        status: "warning",
        duration: 5000,
        isClosable: true,
      })
      return
    }

    // Backend will:
    // 1. Get Instagram Business Account ID for the selected Facebook Page
    // 2. Verify Instagram account is properly set up
    // 3. Store the connection

    // Simulate successful connection
    setIgConfig({
      ...igConfig,
      connected: true,
      accounts: [
        { id: '1', username: '@businessaccount' }
      ]
    })
  }

  const handleDisconnectFacebook = () => {
    // Backend will revoke tokens and clean up stored data
    setFbConfig({
      connected: false,
      selectedPage: '',
      pages: []
    })
    setIgConfig({
      connected: false,
      accountId: '',
      accounts: []
    })
  }

  return (
    <Card>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Social Media Integration</Text>
            <Text color="gray.600" mb={4}>
              Connect your business social media accounts to enable cross-platform posting
            </Text>
          </Box>

          {/* Requirements Check */}
          <Alert status="info" variant="left-accent">
            <AlertIcon />
            <VStack align="start" spacing={2} width="100%">
              <Text fontWeight="bold">Before connecting, ensure you have:</Text>
              <List spacing={2}>
                <ListItem>
                  <ListIcon as={FaStore} color="blue.500" />
                  A Facebook Business Page for your business
                </ListItem>
                <ListItem>
                  <ListIcon as={FaInstagram} color="pink.500" />
                  An Instagram Business Account
                </ListItem>
                <ListItem>
                  <ListIcon as={FaGlobe} color="green.500" />
                  Admin access to your Facebook Page
                </ListItem>
                <ListItem>
                  <ListIcon as={FaShareAlt} color="purple.500" />
                  Instagram account linked to your Facebook Page
                </ListItem>
              </List>
              <Link
                href="https://www.facebook.com/business/help/898752960195806"
                isExternal
                color="blue.500"
                fontSize="sm"
                mt={2}
              >
                Learn how to set these up <Icon as={FaExternalLinkAlt} mx={1} boxSize={3} />
              </Link>
            </VStack>
          </Alert>

          {/* Facebook Configuration */}
          <Box>
            <HStack mb={4}>
              <Icon as={FaFacebook} color="#1877F2" boxSize={6} />
              <Text fontWeight="bold">Facebook Business Page</Text>
              {fbConfig.connected && (
                <Badge colorScheme="green">Connected</Badge>
              )}
            </HStack>

            {!fbConfig.connected ? (
              <Button
                colorScheme="facebook"
                leftIcon={<FaFacebook />}
                onClick={handleFacebookConnect}
                width="full"
              >
                Connect Facebook Business Page
              </Button>
            ) : (
              <VStack align="stretch" spacing={4}>
                <Select
                  value={fbConfig.selectedPage}
                  onChange={(e) => setFbConfig({ ...fbConfig, selectedPage: e.target.value })}
                  placeholder="Select your business page"
                >
                  {fbConfig.pages.map(page => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </Select>

                <Button 
                  variant="outline" 
                  colorScheme="red" 
                  size="sm"
                  onClick={handleDisconnectFacebook}
                >
                  Disconnect Facebook
                </Button>
              </VStack>
            )}
          </Box>

          <Divider />

          {/* Instagram Configuration */}
          <Box>
            <HStack mb={4}>
              <Icon as={FaInstagram} color="#E1306C" boxSize={6} />
              <Text fontWeight="bold">Instagram Business Account</Text>
              {igConfig.connected && (
                <Badge colorScheme="green">Connected</Badge>
              )}
            </HStack>

            {!igConfig.connected ? (
              <VStack align="stretch" spacing={4}>
                {!fbConfig.connected ? (
                  <Alert status="warning">
                    <AlertIcon />
                    Connect your Facebook Business Page first
                  </Alert>
                ) : (
                  <Button
                    colorScheme="pink"
                    leftIcon={<FaInstagram />}
                    onClick={handleInstagramConnect}
                    isDisabled={!fbConfig.selectedPage}
                    width="full"
                  >
                    Connect Instagram Business Account
                  </Button>
                )}
              </VStack>
            ) : (
              <VStack align="stretch" spacing={4}>
                <HStack>
                  <Icon as={FaCheck} color="green.500" />
                  <Text>Connected to {igConfig.accounts[0]?.username}</Text>
                </HStack>
                <Button 
                  variant="outline" 
                  colorScheme="red" 
                  size="sm"
                  onClick={() => setIgConfig({ ...igConfig, connected: false, accountId: '', accounts: [] })}
                >
                  Disconnect Instagram
                </Button>
              </VStack>
            )}
          </Box>

          {(fbConfig.connected || igConfig.connected) && (
            <Alert status="success" variant="subtle">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">Your social media accounts are ready!</Text>
                <Text fontSize="sm">
                  You can now create posts that will be automatically published to your connected accounts.
                </Text>
              </VStack>
            </Alert>
          )}
        </VStack>
      </CardBody>
    </Card>
  )
}

export default SocialMediaConfig