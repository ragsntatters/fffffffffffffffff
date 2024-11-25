import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast
} from '@chakra-ui/react'
import { useState } from 'react'

interface ContactFormProps {
  onSubmit: (data: any) => Promise<void>
}

const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    role: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit form',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <VStack as="form" spacing={4} onSubmit={handleSubmit}>
      <Text fontSize="lg" fontWeight="bold">
        Enter your details to view the audit results
      </Text>

      <FormControl isRequired>
        <FormLabel>First Name</FormLabel>
        <Input
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Last Name</FormLabel>
        <Input
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Phone</FormLabel>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Company</FormLabel>
        <Input
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Role</FormLabel>
        <Input
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
      </FormControl>

      <Button
        type="submit"
        colorScheme="blue"
        width="full"
        isLoading={isSubmitting}
      >
        View Results
      </Button>
    </VStack>
  )
}

export default ContactForm