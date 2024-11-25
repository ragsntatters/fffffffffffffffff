import {
  VStack,
  HStack,
  Text,
  Icon,
  Card,
  CardBody,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Divider,
  Select,
  Box
} from '@chakra-ui/react'
import { useState } from 'react'
import { 
  FaBell, 
  FaStar, 
  FaChartLine, 
  FaComment, 
  FaEllipsisV,
  FaCheck,
  FaTimes
} from 'react-icons/fa'

const NotificationCenter = () => {
  const [filter, setFilter] = useState('all')
  const [notifications] = useState([
    {
      id: 1,
      type: 'review',
      title: 'New Review',
      message: 'Downtown Store received a new 5-star review',
      time: '2 hours ago',
      read: false,
      location: 'Downtown Store'
    },
    {
      id: 2,
      type: 'rank',
      title: 'Rank Change',
      message: 'Your ranking for "coffee shop" improved by 2 positions',
      time: '5 hours ago',
      read: true,
      location: 'Westside Branch'
    },
    {
      id: 3,
      type: 'response',
      title: 'Review Response',
      message: 'Your response to John D.\'s review was posted',
      time: '1 day ago',
      read: true,
      location: 'North Point'
    }
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case 'review':
        return FaStar
      case 'rank':
        return FaChartLine
      case 'response':
        return FaComment
      default:
        return FaBell
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'review':
        return 'yellow'
      case 'rank':
        return 'green'
      case 'response':
        return 'blue'
      default:
        return 'gray'
    }
  }

  const filteredNotifications = filter === 'all' 
    ? notifications
    : notifications.filter(n => n.type === filter)

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          maxW="200px"
        >
          <option value="all">All Notifications</option>
          <option value="review">Reviews</option>
          <option value="rank">Rank Changes</option>
          <option value="response">Responses</option>
        </Select>
        <Button variant="ghost" size="sm">
          Mark All as Read
        </Button>
      </HStack>

      {filteredNotifications.map((notification) => (
        <Card key={notification.id} bg={notification.read ? 'white' : 'blue.50'}>
          <CardBody>
            <HStack spacing={4}>
              <Icon 
                as={getIcon(notification.type)} 
                color={`${getColor(notification.type)}.500`}
                boxSize={5}
              />
              <VStack align="start" flex={1} spacing={1}>
                <HStack justify="space-between" width="100%">
                  <Text fontWeight="bold">{notification.title}</Text>
                  <Badge>{notification.time}</Badge>
                </HStack>
                <Text color="gray.600">{notification.message}</Text>
                <Badge variant="outline" colorScheme="blue">
                  {notification.location}
                </Badge>
              </VStack>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FaEllipsisV />}
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  {!notification.read && (
                    <MenuItem icon={<FaCheck />}>
                      Mark as Read
                    </MenuItem>
                  )}
                  <MenuItem icon={<FaTimes />} color="red.500">
                    Dismiss
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </CardBody>
        </Card>
      ))}

      {filteredNotifications.length === 0 && (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">No notifications found</Text>
        </Box>
      )}
    </VStack>
  )
}

export default NotificationCenter