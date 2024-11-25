import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Switch,
  Box,
  Text,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  FormHelperText,
  Badge
} from '@chakra-ui/react'
import { useState } from 'react'

interface AddKeywordModalProps {
  isOpen: boolean
  onClose: () => void
  onAddKeyword: (keyword: any) => void
  location: {
    name: string
    address: string
    latitude: number
    longitude: number
  }
}

const AddKeywordModal = ({ isOpen, onClose, onAddKeyword, location }: AddKeywordModalProps) => {
  const [formData, setFormData] = useState({
    term: '',
    gridSize: '3x3',
    radius: '',
    unit: 'km',
    schedule: {
      enabled: false,
      frequency: 'weekly',
      dayOfWeek: '1', // Monday
      time: '09:00',
      notifyOnChanges: true
    }
  })
  const toast = useToast()

  const handleSubmit = () => {
    if (!formData.term || !formData.radius) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    onAddKeyword({
      ...formData,
      location
    })
    
    setFormData({
      term: '',
      gridSize: '3x3',
      radius: '',
      unit: 'km',
      schedule: {
        enabled: false,
        frequency: 'weekly',
        dayOfWeek: '1',
        time: '09:00',
        notifyOnChanges: true
      }
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Run Keyword Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <Box width="100%" p={4} bg="blue.50" borderRadius="md">
              <Text fontWeight="bold" mb={2}>Location</Text>
              <HStack>
                <Text>{location.name}</Text>
                <Badge colorScheme="blue">Selected</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">{location.address}</Text>
            </Box>

            <FormControl isRequired>
              <FormLabel>Keyword</FormLabel>
              <Input
                placeholder="Enter keyword to track"
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
              />
              <FormHelperText>
                Enter the keyword you want to track for this location
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Grid Size</FormLabel>
              <Select
                value={formData.gridSize}
                onChange={(e) => setFormData({ ...formData, gridSize: e.target.value })}
              >
                <option value="3x3">3x3 (Basic)</option>
                <option value="5x5">5x5 (Standard)</option>
                <option value="7x7">7x7 (Comprehensive)</option>
              </Select>
              <FormHelperText>
                Larger grids provide more detailed coverage but use more API credits
              </FormHelperText>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Radius</FormLabel>
              <HStack>
                <Input
                  type="number"
                  placeholder="Enter radius"
                  value={formData.radius}
                  onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                />
                <Select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  width="100px"
                >
                  <option value="km">km</option>
                  <option value="mi">mi</option>
                </Select>
              </HStack>
            </FormControl>

            <Box width="100%" borderWidth={1} borderRadius="md" p={4}>
              <FormControl display="flex" alignItems="center" mb={4}>
                <FormLabel mb="0">
                  Schedule Regular Reports
                </FormLabel>
                <Switch
                  isChecked={formData.schedule.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    schedule: {
                      ...formData.schedule,
                      enabled: e.target.checked
                    }
                  })}
                />
              </FormControl>

              {formData.schedule.enabled && (
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Frequency</FormLabel>
                    <RadioGroup
                      value={formData.schedule.frequency}
                      onChange={(value) => setFormData({
                        ...formData,
                        schedule: {
                          ...formData.schedule,
                          frequency: value
                        }
                      })}
                    >
                      <Stack direction="row" spacing={4}>
                        <Radio value="daily">Daily</Radio>
                        <Radio value="weekly">Weekly</Radio>
                        <Radio value="monthly">Monthly</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>

                  {formData.schedule.frequency === 'weekly' && (
                    <FormControl>
                      <FormLabel>Day of Week</FormLabel>
                      <Select
                        value={formData.schedule.dayOfWeek}
                        onChange={(e) => setFormData({
                          ...formData,
                          schedule: {
                            ...formData.schedule,
                            dayOfWeek: e.target.value
                          }
                        })}
                      >
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                        <option value="0">Sunday</option>
                      </Select>
                    </FormControl>
                  )}

                  <FormControl>
                    <FormLabel>Time</FormLabel>
                    <Input
                      type="time"
                      value={formData.schedule.time}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedule: {
                          ...formData.schedule,
                          time: e.target.value
                        }
                      })}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">
                      Notify on Significant Changes
                    </FormLabel>
                    <Switch
                      isChecked={formData.schedule.notifyOnChanges}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedule: {
                          ...formData.schedule,
                          notifyOnChanges: e.target.checked
                        }
                      })}
                    />
                  </FormControl>
                </VStack>
              )}
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Run Report
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AddKeywordModal