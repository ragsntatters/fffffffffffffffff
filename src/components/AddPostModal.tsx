import { useState, useRef } from 'react'
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
  Textarea,
  VStack,
  HStack,
  Switch,
  Text,
  Box,
  Image,
  useColorModeValue,
  FormHelperText,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Badge,
  Tooltip
} from '@chakra-ui/react'
import { FaFacebook, FaInstagram, FaWordpress, FaGoogle, FaImage, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'

interface Location {
  name: string
  address: string
  latitude: number
  longitude: number
}

interface AddPostModalProps {
  isOpen: boolean
  onClose: () => void
  addPost: (post: any) => void
  location?: Location
}

export const AddPostModal = ({ isOpen, onClose, addPost, location }: AddPostModalProps) => {
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image: '',
    platforms: {
      google: true,
      facebook: false,
      instagram: false,
      wordpress: false
    },
    scheduling: {
      type: 'now',
      date: '',
      time: ''
    },
    geotag: true
  })
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef()
  const bgColor = useColorModeValue('gray.50', 'gray.700')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        setNewPost({ ...newPost, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const scheduledTime = newPost.scheduling.type === 'scheduled' 
      ? new Date(`${newPost.scheduling.date}T${newPost.scheduling.time}`)
      : new Date()
      
    const postWithGeotag = {
      ...newPost,
      scheduledTime,
      location: newPost.geotag && location ? {
        name: location.name,
        address: location.address,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      } : null
    }
    
    addPost(postWithGeotag)
    
    setNewPost({
      title: '',
      content: '',
      image: '',
      platforms: {
        google: true,
        facebook: false,
        instagram: false,
        wordpress: false
      },
      scheduling: {
        type: 'now',
        date: '',
        time: ''
      },
      geotag: true
    })
    setPreviewImage(null)
    onClose()
  }

  // Get current date and time in format required for input fields
  const getCurrentDateTime = () => {
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().slice(0, 5)
    return { date, time }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <Box
              w="100%"
              h="200px"
              bg={bgColor}
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              overflow="hidden"
            >
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Preview"
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
              ) : (
                <IconButton
                  icon={<FaImage />}
                  size="lg"
                  variant="ghost"
                  onClick={() => fileInputRef.current.click()}
                  aria-label="Upload image"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                display="none"
                onChange={handleImageChange}
              />
            </Box>

            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Enter post title"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Content</FormLabel>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Enter post content"
                rows={4}
              />
            </FormControl>

            {location && (
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  <HStack spacing={2}>
                    <FaMapMarkerAlt />
                    <Text>Add Location Tag</Text>
                    {newPost.geotag && (
                      <Badge colorScheme="blue" ml={2}>
                        {location.name}
                      </Badge>
                    )}
                  </HStack>
                </FormLabel>
                <Tooltip 
                  label={newPost.geotag ? 
                    `Post will be tagged at ${location.address}` : 
                    "Enable to add location information to your post"
                  }
                >
                  <Switch
                    isChecked={newPost.geotag}
                    onChange={(e) => setNewPost({
                      ...newPost,
                      geotag: e.target.checked
                    })}
                  />
                </Tooltip>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Post Timing</FormLabel>
              <RadioGroup
                value={newPost.scheduling.type}
                onChange={(value) => setNewPost({
                  ...newPost,
                  scheduling: {
                    ...newPost.scheduling,
                    type: value,
                    date: value === 'scheduled' ? getCurrentDateTime().date : '',
                    time: value === 'scheduled' ? getCurrentDateTime().time : ''
                  }
                })}
              >
                <Stack direction="column" spacing={4}>
                  <Radio value="now">Post Now</Radio>
                  <Radio value="scheduled">Schedule for Later</Radio>
                </Stack>
              </RadioGroup>

              {newPost.scheduling.type === 'scheduled' && (
                <HStack mt={4} spacing={4}>
                  <FormControl>
                    <FormLabel>Date</FormLabel>
                    <Input
                      type="date"
                      value={newPost.scheduling.date}
                      min={getCurrentDateTime().date}
                      onChange={(e) => setNewPost({
                        ...newPost,
                        scheduling: { ...newPost.scheduling, date: e.target.value }
                      })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Time</FormLabel>
                    <Input
                      type="time"
                      value={newPost.scheduling.time}
                      onChange={(e) => setNewPost({
                        ...newPost,
                        scheduling: { ...newPost.scheduling, time: e.target.value }
                      })}
                    />
                  </FormControl>
                </HStack>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Publish to Platforms</FormLabel>
              <VStack align="stretch" bg={bgColor} p={4} borderRadius="md">
                <HStack justify="space-between">
                  <HStack>
                    <FaGoogle />
                    <Text>Google Business Profile</Text>
                  </HStack>
                  <Switch
                    isChecked={newPost.platforms.google}
                    onChange={(e) => setNewPost({
                      ...newPost,
                      platforms: { ...newPost.platforms, google: e.target.checked }
                    })}
                    isDisabled
                  />
                </HStack>
                
                <HStack justify="space-between">
                  <HStack>
                    <FaFacebook />
                    <Text>Facebook Page</Text>
                  </HStack>
                  <Switch
                    isChecked={newPost.platforms.facebook}
                    onChange={(e) => setNewPost({
                      ...newPost,
                      platforms: { ...newPost.platforms, facebook: e.target.checked }
                    })}
                  />
                </HStack>

                <HStack justify="space-between">
                  <HStack>
                    <FaInstagram />
                    <Text>Instagram</Text>
                  </HStack>
                  <Switch
                    isChecked={newPost.platforms.instagram}
                    onChange={(e) => setNewPost({
                      ...newPost,
                      platforms: { ...newPost.platforms, instagram: e.target.checked }
                    })}
                  />
                </HStack>

                <HStack justify="space-between">
                  <HStack>
                    <FaWordpress />
                    <Text>WordPress</Text>
                  </HStack>
                  <Switch
                    isChecked={newPost.platforms.wordpress}
                    onChange={(e) => setNewPost({
                      ...newPost,
                      platforms: { ...newPost.platforms, wordpress: e.target.checked }
                    })}
                  />
                </HStack>
              </VStack>
              <FormHelperText>Posts will always be published to Google Business Profile</FormHelperText>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            leftIcon={newPost.scheduling.type === 'scheduled' ? <FaCalendar /> : undefined}
          >
            {newPost.scheduling.type === 'scheduled' ? 'Schedule Post' : 'Create Post'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}