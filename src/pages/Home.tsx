import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  List,
  ListItem,
  ListIcon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import {
  FaChartLine,
  FaMapMarkerAlt,
  FaStar,
  FaNewspaper,
  FaSearch,
  FaCheck,
  FaCrown,
  FaRocket,
  FaGlobe,
  FaChartBar,
  FaUsers
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const bgGradient = useColorModeValue(
    'linear(to-b, blue.50, white)',
    'linear(to-b, gray.900, gray.800)'
  )

  const features = [
    {
      icon: FaMapMarkerAlt,
      title: 'Multi-Location Management',
      description: 'Manage all your business locations from a single dashboard with location-specific insights and controls.'
    },
    {
      icon: FaChartLine,
      title: 'Rank Tracking',
      description: 'Monitor your Google Business Profile rankings for important keywords across all your locations.'
    },
    {
      icon: FaStar,
      title: 'Review Management',
      description: 'Respond to customer reviews, track sentiment, and maintain high engagement across all platforms.'
    },
    {
      icon: FaNewspaper,
      title: 'Post Management',
      description: 'Create, schedule, and publish posts across multiple platforms with location-specific targeting.'
    },
    {
      icon: FaSearch,
      title: 'Competitor Analysis',
      description: 'Track competitor performance, analyze their strategies, and stay ahead in your local market.'
    }
  ]

  const plans = [
    {
      name: 'Starter',
      price: 49,
      features: [
        '3 Locations',
        '1,500 Grid Points/mo',
        '500 Search Queries/mo',
        '5 Basic Audits/mo',
        'Daily Review Monitoring',
        'Review Response Management',
        'Keyword Reports',
        'Email Support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      price: 89,
      features: [
        '10 Locations',
        '5,000 Grid Points/mo',
        '2,500 Search Queries/mo',
        'All Audit Types',
        'Real-time Review Monitoring',
        'Multi-Platform Posting',
        'Scheduled Reports',
        'Embeddable Widget',
        'Priority Support'
      ],
      cta: 'Get Started',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 190,
      features: [
        '70 Locations',
        '20,000 Grid Points/mo',
        '10,000 Search Queries/mo',
        'Unlimited Audits',
        'Real-time Monitoring',
        'Multi-Platform Posting',
        'Advanced Reporting',
        'Embeddable Widget',
        '24/7 Dedicated Support'
      ],
      cta: 'Get Started',
      popular: false
    }
  ]

  return (
    <Box>
      <Box
        bgGradient={bgGradient}
        pt={20}
        pb={16}
        px={8}
        textAlign="center"
      >
        <Container maxW="container.lg">
          <Heading
            as="h1"
            size="2xl"
            mb={6}
            bgGradient="linear(to-r, blue.400, blue.600)"
            bgClip="text"
          >
            Track and Boost Your Local Search Presence
          </Heading>
          <Text fontSize="xl" mb={8} color="gray.600">
            Complete Google Business Profile management solution for multi-location businesses.
            Track rankings, manage reviews, and outperform competitors - all from one dashboard.
          </Text>
          <HStack spacing={4} justify="center">
            <Button
              size="lg"
              colorScheme="blue"
              onClick={() => navigate('/register')}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/audit')}
            >
              Free Audit
            </Button>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={16}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mb={16}>
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardBody>
                <Icon
                  as={feature.icon}
                  boxSize={12}
                  color="blue.500"
                  mb={4}
                />
                <Heading size="md" mb={4}>
                  {feature.title}
                </Heading>
                <Text color="gray.600">
                  {feature.description}
                </Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <Box textAlign="center" mb={16}>
          <Heading size="xl" mb={4}>
            Simple, Transparent Pricing
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
            Choose the plan that fits your business. Scale up or down anytime as your needs change.
            All plans include core features with increased capacity and capabilities.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mb={8}>
          {plans.map((plan) => (
            <Card
              key={plan.name}
              position="relative"
              borderWidth={plan.popular ? 2 : 1}
              borderColor={plan.popular ? 'blue.500' : 'gray.200'}
            >
              {plan.popular && (
                <Badge
                  colorScheme="blue"
                  position="absolute"
                  top="-2"
                  right="-2"
                  rounded="full"
                  px={3}
                  py={1}
                >
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <VStack spacing={4}>
                  <Heading size="md">{plan.name}</Heading>
                  <HStack>
                    <Text fontSize="4xl" fontWeight="bold">
                      ${plan.price}
                    </Text>
                    <Text color="gray.600">/month</Text>
                  </HStack>
                </VStack>
              </CardHeader>
              <CardBody>
                <List spacing={3}>
                  {plan.features.map((feature) => (
                    <ListItem key={feature}>
                      <ListIcon as={FaCheck} color="green.500" />
                      {feature}
                    </ListItem>
                  ))}
                </List>
              </CardBody>
              <CardFooter>
                <Button
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  variant={plan.popular ? 'solid' : 'outline'}
                  onClick={() => navigate('/register')}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default Home