import {
  VStack,
  Box,
  Text,
  Button,
  HStack,
  Code,
  IconButton,
  useToast,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Tooltip,
  Divider
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaCopy, FaSync, FaEye, FaEyeSlash } from 'react-icons/fa'

const APIKeySettings = () => {
  const [apiKey, setApiKey] = useState('gbp_tk_xxxxxxxxxxxxxxxxxxxx')
  const [showKey, setShowKey] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const toast = useToast()

  const handleGenerateKey = async () => {
    setIsGenerating(true)
    // Simulate API key generation
    setTimeout(() => {
      setApiKey('gbp_tk_' + Math.random().toString(36).substring(2, 15))
      setIsGenerating(false)
      toast({
        title: 'New API Key Generated',
        description: 'Your old API key has been revoked.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }, 1000)
  }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey)
    toast({
      title: 'API Key Copied',
      description: 'API key has been copied to clipboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Card>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>API Key Management</Text>
            <Text color="gray.600">
              Use this API key to authenticate your requests and widget integrations.
            </Text>
          </Box>

          <Alert status="warning">
            <AlertIcon />
            Keep your API key secure. Never share it or commit it to version control.
          </Alert>

          <Box>
            <Text fontWeight="medium" mb={2}>Your API Key</Text>
            <HStack>
              <Code 
                flex="1" 
                p={3} 
                borderRadius="md"
                fontFamily="mono"
              >
                {showKey ? apiKey : apiKey.replace(/[^gbp_tk_]/g, '•')}
              </Code>
              <Tooltip label={showKey ? "Hide API key" : "Show API key"}>
                <IconButton
                  aria-label="Toggle API key visibility"
                  icon={showKey ? <FaEyeSlash /> : <FaEye />}
                  onClick={() => setShowKey(!showKey)}
                />
              </Tooltip>
              <Tooltip label="Copy API key">
                <IconButton
                  aria-label="Copy API key"
                  icon={<FaCopy />}
                  onClick={handleCopyKey}
                />
              </Tooltip>
            </HStack>
          </Box>

          <Divider />

          <Box>
            <Button
              leftIcon={<FaSync />}
              colorScheme="red"
              variant="outline"
              isLoading={isGenerating}
              loadingText="Generating..."
              onClick={handleGenerateKey}
            >
              Generate New API Key
            </Button>
            <Text fontSize="sm" color="gray.500" mt={2}>
              Warning: Generating a new key will revoke the existing one
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default APIKeySettings