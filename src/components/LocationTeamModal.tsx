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
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Box,
} from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

interface LocationTeamModalProps {
  isOpen: boolean
  onClose: () => void
  locationId: string
  locationName: string
}

export const LocationTeamModal = ({ isOpen, onClose, locationId, locationName }: LocationTeamModalProps) => {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', hasAccess: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', hasAccess: false },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', hasAccess: true },
  ])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Viewer',
    hasAccess: true
  })

  const handleAddMember = () => {
    setTeamMembers([
      ...teamMembers,
      {
        id: teamMembers.length + 1,
        ...newMember
      }
    ])
    setNewMember({
      name: '',
      email: '',
      role: 'Viewer',
      hasAccess: true
    })
    setShowAddForm(false)
  }

  const handleRoleChange = (id: number, newRole: string) => {
    setTeamMembers(teamMembers.map(member =>
      member.id === id ? { ...member, role: newRole } : member
    ))
  }

  const handleAccessChange = (id: number, hasAccess: boolean) => {
    setTeamMembers(teamMembers.map(member =>
      member.id === id ? { ...member, hasAccess } : member
    ))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Team Management - {locationName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Button
              leftIcon={<FaPlus />}
              colorScheme="blue"
              onClick={() => setShowAddForm(true)}
              size="sm"
              alignSelf="flex-start"
              mb={4}
            >
              Add Team Member
            </Button>

            {showAddForm && (
              <Box p={4} borderWidth="1px" borderRadius="lg" mb={4}>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="Enter name"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      placeholder="Enter email"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Select
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
                    </Select>
                  </FormControl>
                  <Button colorScheme="blue" onClick={handleAddMember}>
                    Add Member
                  </Button>
                </VStack>
              </Box>
            )}

            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Access</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                </Tr>
              </Thead>
              <Tbody>
                {teamMembers.map((member) => (
                  <Tr key={member.id}>
                    <Td>
                      <Checkbox
                        isChecked={member.hasAccess}
                        onChange={(e) => handleAccessChange(member.id, e.target.checked)}
                      />
                    </Td>
                    <Td>{member.name}</Td>
                    <Td>{member.email}</Td>
                    <Td>
                      <Select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        size="sm"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </Select>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3}>Save Changes</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}