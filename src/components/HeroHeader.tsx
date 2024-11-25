import {
  Box,
  Container,
  Heading,
  Text,
  Icon,
  VStack,
  useColorModeValue
} from '@chakra-ui/react'
import { IconType } from 'react-icons'

interface HeroHeaderProps {
  title: string
  subtitle: string
  icon: IconType
}

const HeroHeader = ({ title, subtitle, icon }: HeroHeaderProps) => {
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.50, blue.100)',
    'linear(to-r, blue.900, blue.800)'
  )
  const textColor = useColorModeValue('gray.700', 'white')
  const subtitleColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Box 
      bg={useColorModeValue('white', 'gray.800')} 
      borderBottom="1px" 
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      mb={8}
    >
      <Box bgGradient={bgGradient} py={12}>
        <Container maxW="container.xl">
          <VStack spacing={4} align="center" textAlign="center">
            <Icon as={icon} boxSize={12} color="blue.500" />
            <Heading size="xl" color={textColor}>
              {title}
            </Heading>
            <Text fontSize="lg" color={subtitleColor} maxW="2xl">
              {subtitle}
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default HeroHeader