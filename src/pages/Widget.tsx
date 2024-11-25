import {
  Box,
  VStack,
  Text,
  Card,
  CardBody,
  Button,
  useToast,
  Code,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Tooltip,
  Heading,
  Alert,
  AlertIcon,
  Link,
  List,
  ListItem,
  ListIcon,
  HStack,
  Divider
} from '@chakra-ui/react'
import { FaCopy, FaDownload, FaKey, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa'
import PageHeader from '../components/PageHeader'
import AuditWidget from '../components/widget/AuditWidget'

const Widget = () => {
  const toast = useToast()

  const widgetCode = `<script src="https://app.gbptracker.com/widget.js"></script>
<div id="gbp-audit-widget" data-theme="light"></div>
<script>
  GBPTracker.init({
    container: '#gbp-audit-widget',
    notificationEmail: 'rags@digigo.co.nz'
  });
</script>`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(widgetCode)
    toast({
      title: 'Code copied!',
      description: 'Widget code has been copied to your clipboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box>
      <PageHeader
        title="Embeddable Widget"
        subtitle="Add a location audit widget to your website"
      />

      <VStack spacing={6} align="stretch">
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Widget Preview</Heading>
              <Text color="gray.600">
                This is how the widget will appear on your website. Try it out below!
              </Text>
              <Alert status="info" mb={4}>
                <AlertIcon />
                Search for a business or click any result to see the full audit form
              </Alert>
              <Box borderWidth={1} borderRadius="md" p={6}>
                <AuditWidget isPreview={true} />
              </Box>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Installation</Heading>
              <Text color="gray.600">
                Copy and paste this code into your website where you want the widget to appear.
              </Text>

              <Tabs variant="enclosed">
                <TabList>
                  <Tab>HTML</Tab>
                  <Tab>WordPress</Tab>
                  <Tab>Configuration</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Box position="relative">
                      <Code
                        display="block"
                        whiteSpace="pre"
                        p={4}
                        borderRadius="md"
                        bg="gray.50"
                      >
                        {widgetCode}
                      </Code>
                      <Tooltip label="Copy code">
                        <IconButton
                          aria-label="Copy code"
                          icon={<FaCopy />}
                          size="sm"
                          position="absolute"
                          top={2}
                          right={2}
                          onClick={handleCopyCode}
                        />
                      </Tooltip>
                    </Box>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <Button
                          as="a"
                          href="/wordpress/gbp-tracker.zip"
                          download
                          leftIcon={<FaDownload />}
                          colorScheme="blue"
                          size="lg"
                          mb={4}
                        >
                          Download WordPress Plugin
                        </Button>
                        
                        <Alert status="info" mt={4}>
                          <AlertIcon />
                          <VStack align="start" spacing={2}>
                            <Text fontWeight="medium">Before installing, you'll need:</Text>
                            <List spacing={2}>
                              <ListItem>
                                <HStack>
                                  <ListIcon as={FaKey} color="blue.500" />
                                  <Text>API Key - Found in your <Link color="blue.500" href="/settings">Settings → API Keys</Link> section</Text>
                                </HStack>
                              </ListItem>
                              <ListItem>
                                <HStack>
                                  <ListIcon as={FaMapMarkerAlt} color="blue.500" />
                                  <Text>Location ID - Found in your <Link color="blue.500" href="/locations">Locations</Link> dashboard for each location</Text>
                                </HStack>
                              </ListItem>
                            </List>
                          </VStack>
                        </Alert>
                      </Box>

                      <Divider />

                      <Text>
                        After installation, add this shortcode to any page or post:
                      </Text>
                      <Code
                        display="block"
                        whiteSpace="pre"
                        p={4}
                        mt={4}
                        borderRadius="md"
                        bg="gray.50"
                      >
                        [gbp_audit_widget theme="light"]
                      </Code>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack align="stretch" spacing={4}>
                      <Text fontWeight="bold">Available Options:</Text>
                      <Box>
                        <Text fontWeight="medium">theme</Text>
                        <Text color="gray.600">Widget theme (light or dark)</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="medium">primaryColor</Text>
                        <Text color="gray.600">Primary button and accent color (hex code)</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="medium">fontFamily</Text>
                        <Text color="gray.600">Custom font family to match your website</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="medium">radius</Text>
                        <Text color="gray.600">Border radius for buttons and inputs (in pixels)</Text>
                      </Box>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  )
}

export default Widget