import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  HStack,
  IconButton,
  Card,
  CardBody,
  Divider,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaCamera } from 'react-icons/fa'

interface ProfileSettingsProps {
  onUpdate: (data: any) => void
}

const ProfileSettings = ({ onUpdate }: ProfileSettingsProps) => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    role: 'Account Manager',
    avatar: 'https://bit.ly/dan-abramov'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(profile)
  }

  return (
    <Card>
      <CardBody>
        <VStack spacing={6} align="stretch" as="form" onSubmit={handleSubmit}>
          <HStack spacing={4}>
            <Avatar 
              size="xl" 
              name={profile.name} 
              src={profile.avatar}
            />
            <IconButton
              aria-label="Change avatar"
              icon={<FaCamera />}
              isRound
              size="sm"
              position="relative"
              left="-40px"
              top="30px"
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow="md"
            />
          </HStack>

          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Phone</FormLabel>
            <Input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Role</FormLabel>
            <Input
              value={profile.role}
              isReadOnly
              bg={useColorModeValue('gray.50', 'gray.700')}
            />
          </FormControl>

          <Divider />

          <Button type="submit" colorScheme="blue">
            Save Changes
          </Button>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default ProfileSettings