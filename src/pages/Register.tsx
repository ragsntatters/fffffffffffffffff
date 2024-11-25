import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
  Alert,
  AlertIcon,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Icon,
  useColorModeValue,
  HStack,
  Badge
} from '@chakra-ui/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FaCheck, FaCheckCircle } from 'react-icons/fa'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  plan: 'starter' | 'professional' | 'enterprise'
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}

const plans = {
  starter: {
    name: 'Starter',
    price: 49,
    features: [
      'Up to 3 locations',
      '100 keyword tracks/month',
      'Basic review management',
      'Standard post scheduling',
      'Email support'
    ]
  },
  professional: {
    name: 'Professional',
    price: 149,
    features: [
      'Up to 10 locations',
      '500 keyword tracks/month',
      'Advanced review management',
      'Multi-platform posting',
      'Competitor tracking',
      'Priority support'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Unlimited locations',
      'Unlimited keyword tracking',
      'Custom API integration',
      'Dedicated account manager',
      'Custom reporting',
      'White-label options',
      '24/7 phone support'
    ]
  }
}

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    plan: 'professional'
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [error, setError] = useState('')
  const { register } = useAuth()
  const toast = useToast()

  const cardBg = useColorModeValue('white', 'gray.700')
  const selectedBg = useColorModeValue('blue.50', 'blue.900')
  const selectedBorder = useColorModeValue('blue.500', 'blue.200')

  const validateForm = () => {
    const newErrors: FormErrors = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    try {
      setIsLoading(true)
      await register(formData)
      toast({
        title: 'Registration successful',
        description: 'Welcome to Track and Boost!',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to register')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <Box minH="100vh" py={20} px={4} bg="gray.50">
      <VStack spacing={8} mx="auto" maxW="6xl">
        <Heading>Create Your Account</Heading>
        
        {error && (
          <Alert status="error" maxW="lg">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full" maxW="6xl">
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <SimpleGrid columns={2} spacing={4}>
                    <FormControl isRequired isInvalid={!!errors.firstName}>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        autoComplete="given-name"
                      />
                      <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.lastName}>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        autoComplete="family-name"
                      />
                      <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isRequired isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    fontSize="md"
                    isLoading={isLoading}
                    loadingText="Creating account..."
                  >
                    Create Account
                  </Button>
                </Stack>
              </form>
            </CardBody>
          </Card>

          <VStack spacing={4} align="stretch">
            <Heading size="md" mb={2}>Select Your Plan</Heading>
            {Object.entries(plans).map(([key, plan]) => (
              <Card
                key={key}
                bg={formData.plan === key ? selectedBg : cardBg}
                borderWidth={2}
                borderColor={formData.plan === key ? selectedBorder : 'transparent'}
                cursor="pointer"
                onClick={() => setFormData(prev => ({ ...prev, plan: key as FormData['plan'] }))}
                _hover={{ borderColor: selectedBorder }}
                transition="all 0.2s"
              >
                <CardBody>
                  <Stack spacing={4}>
                    <HStack justify="space-between">
                      <Heading size="md">{plan.name}</Heading>
                      <Text fontSize="2xl" fontWeight="bold">
                        {typeof plan.price === 'number' ? `$${plan.price}/mo` : plan.price}
                      </Text>
                    </HStack>
                    <List spacing={3}>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index}>
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          {feature}
                        </ListItem>
                      ))}
                    </List>
                    {formData.plan === key && (
                      <Button colorScheme="blue" variant="solid" leftIcon={<FaCheck />}>
                        Selected Plan
                      </Button>
                    )}
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </SimpleGrid>

        <Text>
          Already have an account?{' '}
          <Link to="/login">
            <Button variant="link" colorScheme="blue">
              Sign in
            </Button>
          </Link>
        </Text>
      </VStack>
    </Box>
  )
}