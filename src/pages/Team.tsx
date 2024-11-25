import { useState } from 'react'
import { 
  Box, 
  SimpleGrid, 
  Button, 
  HStack, 
  Text, 
  Image, 
  Badge, 
  VStack, 
  useDisclosure, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  ModalCloseButton, 
  FormControl, 
  FormLabel, 
  Input, 
  Select, 
  CheckboxGroup, 
  Checkbox, 
  useToast, 
  Icon,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react'
import { FaPlus, FaUsers } from 'react-icons/fa'
import HeroHeader from '../components/HeroHeader'

const Team = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', locations: ['Downtown Store', 'Westside Branch'] },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', locations: ['Downtown Store'] },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', locations: ['Westside Branch'] },
  ])

  const [editingMember, setEditingMember] = useState(null)

  const addTeamMember = (newMember) => {
    setTeamMembers([...teamMembers, { ...newMember, id: teamMembers.length + 1 }])
    onClose()
  }

  const updateTeamMember = (updatedMember) => {
    setTeamMembers(teamMembers.map(member => member.id === updatedMember.id ? updatedMember : member))
    setEditingMember(null)
    onClose()
  }

  const openEditModal = (member) => {
    setEditingMember(member)
    onOpen()
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'blue.500'
      case 'Editor':
        return 'green.500'
      case 'Viewer':
        return 'gray.500'
      default:
        return 'gray.500'
    }
  }

  const evenRowBg = useColorModeValue('gray.50', 'gray.700')
  const hoverBg = useColorModeValue('gray.100', 'gray.600')

  return (
    <Box>
      <HeroHeader 
        icon={FaUsers}
        title="Team Management"
        subtitle="Manage your team members, assign roles, and control access permissions across all your business locations. Streamline collaboration and maintain security with granular access controls."
      />
      
      <Button leftIcon={<FaPlus />} colorScheme="blue" mb={6} onClick={() => { setEditingMember(null); onOpen(); }}>
        Add Team Member
      </Button>

      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th py={4}>Name</Th>
              <Th py={4}>Email</Th>
              <Th py={4}>Role</Th>
              <Th py={4}>Assigned Locations</Th>
              <Th py={4}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {teamMembers.map((member, index) => (
              <Tr 
                key={member.id}
                _hover={{ bg: hoverBg }}
                bg={index % 2 === 0 ? evenRowBg : 'white'}
                transition="background-color 0.2s"
              >
                <Td py={4} fontWeight="medium">{member.name}</Td>
                <Td py={4}>{member.email}</Td>
                <Td py={4}>
                  <Box
                    as="span"
                    color={getRoleColor(member.role)}
                    fontWeight="medium"
                  >
                    {member.role}
                  </Box>
                </Td>
                <Td py={4}>
                  <Box>
                    {member.locations.join(', ')}
                  </Box>
                </Td>
                <Td py={4}>
                  <Button 
                    size="sm" 
                    mr={2} 
                    onClick={() => openEditModal(member)}
                    colorScheme="blue"
                    variant="outline"
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    colorScheme="red"
                    variant="ghost"
                  >
                    Remove
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <TeamMemberModal
        isOpen={isOpen}
        onClose={() => { onClose(); setEditingMember(null); }}
        addTeamMember={addTeamMember}
        updateTeamMember={updateTeamMember}
        editingMember={editingMember}
      />
    </Box>
  )
}

const TeamMemberModal = ({ isOpen, onClose, addTeamMember, updateTeamMember, editingMember }) => {
  const [member, setMember] = useState(editingMember || { name: '', email: '', role: 'Viewer', locations: [] })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingMember) {
      updateTeamMember(member)
    } else {
      addTeamMember(member)
    }
    setMember({ name: '', email: '', role: 'Viewer', locations: [] })
  }

  const locations = ['Downtown Store', 'Westside Branch', 'North Point']

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input value={member.name} onChange={(e) => setMember({ ...member, name: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={member.email} onChange={(e) => setMember({ ...member, email: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Role</FormLabel>
              <Select value={member.role} onChange={(e) => setMember({ ...member, role: e.target.value })}>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Assigned Locations</FormLabel>
              <CheckboxGroup colorScheme="blue" value={member.locations} onChange={(values) => setMember({ ...member, locations: values })}>
                <VStack align="start">
                  {locations.map((location) => (
                    <Checkbox key={location} value={location}>
                      {location}
                    </Checkbox>
                  ))}
                </VStack>
              </CheckboxGroup>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            {editingMember ? 'Update' : 'Add'}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default Team