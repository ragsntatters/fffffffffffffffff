import { useState } from 'react'
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, Button, HStack, useDisclosure } from '@chakra-ui/react'
import { FaPlus, FaUsers, FaCog, FaNewspaper } from 'react-icons/fa'
import { PostGrid } from '../components/PostGrid'
import { AddPostModal } from '../components/AddPostModal'
import { LocationTeamModal } from '../components/LocationTeamModal'
import { LocationSettingsModal } from '../components/LocationSettingsModal'
import RejectPostModal from '../components/RejectPostModal'
import LocationSelector from '../components/LocationSelector'
import HeroHeader from '../components/HeroHeader'

const Posts = () => {
  const { isOpen: isPostModalOpen, onOpen: onPostModalOpen, onClose: onPostModalClose } = useDisclosure()
  const { isOpen: isTeamModalOpen, onOpen: onTeamModalOpen, onClose: onTeamModalClose } = useDisclosure()
  const { isOpen: isSettingsModalOpen, onOpen: onSettingsModalOpen, onClose: onSettingsModalClose } = useDisclosure()
  const { isOpen: isRejectModalOpen, onOpen: onRejectModalOpen, onClose: onRejectModalClose } = useDisclosure()
  const [selectedLocation, setSelectedLocation] = useState('1')
  const [selectedPost, setSelectedPost] = useState(null)

  const locations = [
    { 
      id: '1', 
      name: 'Downtown Store',
      address: '123 Main St, San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194
    },
    { 
      id: '2', 
      name: 'Westside Branch',
      address: '456 Oak Ave, San Francisco, CA',
      latitude: 37.7833,
      longitude: -122.4167
    },
    { 
      id: '3', 
      name: 'North Point',
      address: '789 Bay St, San Francisco, CA',
      latitude: 37.8060,
      longitude: -122.4230
    }
  ]

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'New Project Launch',
      content: 'Excited to announce our latest web application!',
      image: 'https://via.placeholder.com/300',
      status: 'published',
      platforms: ['google', 'facebook', 'instagram'],
      urls: {
        google: 'https://business.google.com/posts/l/12345',
        facebook: 'https://facebook.com/post/67890',
        instagram: 'https://instagram.com/p/abcdef',
        wordpress: 'https://example.com/blog/post-1'
      },
      author: 'John Doe',
      authorAvatar: 'https://via.placeholder.com/40',
      role: 'Marketing Manager',
      postedAt: '2024-03-15 14:30',
      lastModified: '2024-03-15 15:45',
      locationId: '1'
    },
    {
      id: 2,
      title: 'Special Weekend Offer',
      content: 'Join us this weekend for exclusive deals and special promotions! Limited time offers on selected items.',
      image: 'https://via.placeholder.com/300',
      status: 'pending',
      platforms: ['google', 'facebook'],
      author: 'Jane Smith',
      authorAvatar: 'https://via.placeholder.com/40',
      role: 'Marketing Coordinator',
      postedAt: '2024-03-16 09:15',
      locationId: '1'
    },
    {
      id: 3,
      title: 'Customer Appreciation Day',
      content: 'Thank you for your continued support! Join us for our customer appreciation event.',
      image: 'https://via.placeholder.com/300',
      status: 'rejected',
      platforms: ['google', 'facebook', 'instagram'],
      author: 'Bob Johnson',
      authorAvatar: 'https://via.placeholder.com/40',
      role: 'Store Manager',
      postedAt: '2024-03-16 11:45',
      rejectionNote: 'Please include specific event details, timing, and any special offers or activities planned for the day.',
      locationId: '1'
    },
    {
      id: 4,
      title: 'New Product Line Launch',
      content: 'Get ready for our exciting new product line! Stay tuned for more details.',
      image: 'https://via.placeholder.com/300',
      status: 'pending',
      platforms: ['google', 'facebook', 'instagram'],
      author: 'Sarah Wilson',
      authorAvatar: 'https://via.placeholder.com/40',
      role: 'Product Manager',
      postedAt: '2024-03-16 13:20',
      locationId: '1'
    }
  ])

  const handleAddPost = (newPost) => {
    setPosts([...posts, { 
      ...newPost, 
      id: posts.length + 1, 
      status: 'pending',
      locationId: selectedLocation 
    }])
  }

  const approvePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: 'published' } : post
    ))
  }

  const openRejectModal = (post) => {
    setSelectedPost(post)
    onRejectModalOpen()
  }

  const handleRejectPost = (postId: number, reason: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { 
        ...post, 
        status: 'rejected',
        rejectionNote: reason 
      } : post
    ))
  }

  return (
    <Box>
      <HeroHeader 
        icon={FaNewspaper}
        title="Post Management"
        subtitle="Create and manage your business posts across multiple platforms. Schedule content, track engagement, and maintain a consistent online presence across Google Business Profile, social media, and more."
      />

      <HStack spacing={4} mb={6}>
        <LocationSelector
          locations={locations}
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        />

        <Button leftIcon={<FaUsers />} onClick={onTeamModalOpen}>Team</Button>
        <Button leftIcon={<FaCog />} onClick={onSettingsModalOpen}>Settings</Button>
      </HStack>

      <Button leftIcon={<FaPlus />} colorScheme="blue" mb={6} onClick={onPostModalOpen}>
        Create New Post
      </Button>

      <Tabs>
        <TabList>
          <Tab>All Posts</Tab>
          <Tab>Published</Tab>
          <Tab>Pending Approval</Tab>
          <Tab>Rejected</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <PostGrid 
              posts={posts} 
              approvePost={approvePost} 
              openRejectModal={openRejectModal} 
            />
          </TabPanel>
          <TabPanel>
            <PostGrid 
              posts={posts.filter(post => post.status === 'published')} 
              approvePost={approvePost} 
              openRejectModal={openRejectModal} 
            />
          </TabPanel>
          <TabPanel>
            <PostGrid 
              posts={posts.filter(post => post.status === 'pending')} 
              approvePost={approvePost} 
              openRejectModal={openRejectModal} 
            />
          </TabPanel>
          <TabPanel>
            <PostGrid 
              posts={posts.filter(post => post.status === 'rejected')} 
              approvePost={approvePost} 
              openRejectModal={openRejectModal} 
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <AddPostModal 
        isOpen={isPostModalOpen} 
        onClose={onPostModalClose} 
        addPost={handleAddPost}
        location={locations.find(loc => loc.id === selectedLocation)}
      />

      <LocationTeamModal
        isOpen={isTeamModalOpen}
        onClose={onTeamModalClose}
        locationId={selectedLocation}
        locationName={locations.find(loc => loc.id === selectedLocation)?.name || ''}
      />

      <LocationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={onSettingsModalClose}
        locationId={selectedLocation}
        locationName={locations.find(loc => loc.id === selectedLocation)?.name || ''}
      />

      {selectedPost && (
        <RejectPostModal
          isOpen={isRejectModalOpen}
          onClose={onRejectModalClose}
          post={selectedPost}
          onReject={handleRejectPost}
        />
      )}
    </Box>
  )
}

export default Posts