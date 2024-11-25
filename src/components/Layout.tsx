import { ReactNode } from 'react'
import { Link as RouterLink, useLocation, Outlet } from 'react-router-dom'
import { 
  Box, 
  Flex, 
  VStack, 
  Heading, 
  useColorModeValue,
  Icon,
  Text,
  Divider,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar
} from '@chakra-ui/react'
import { 
  FaHome, 
  FaMapMarkerAlt, 
  FaChartBar, 
  FaStar, 
  FaNewspaper, 
  FaSearch, 
  FaCode, 
  FaUsers, 
  FaCog, 
  FaCreditCard,
  FaChevronDown,
  FaThLarge
} from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'

interface NavItemProps {
  icon: React.ElementType
  children: ReactNode
  to: string
  isActive: boolean
}

const Layout = () => {
  const location = useLocation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const menuBg = useColorModeValue('gray.50', 'gray.900')
  const { user, isAuthenticated, logout } = useAuth()

  const menuItems = [
    { icon: FaHome, label: 'Home', path: '/' },
    { icon: FaMapMarkerAlt, label: 'Locations', path: '/locations' },
    { icon: FaChartBar, label: 'Reports', path: '/reports' },
    { icon: FaStar, label: 'Reviews', path: '/reviews' },
    { icon: FaNewspaper, label: 'Posts', path: '/posts' },
    { icon: FaSearch, label: 'Audit', path: '/audit' },
    { icon: FaCode, label: 'Widget', path: '/widget' },
    { icon: FaThLarge, label: 'Grid Reports', path: '/grid-reports' },
    { icon: FaUsers, label: 'Team', path: '/team' },
    { icon: FaCog, label: 'Settings', path: '/settings' },
    { icon: FaCreditCard, label: 'Billing', path: '/billing' }
  ]

  return (
    <Flex minHeight="100vh">
      <Box
        width="280px"
        bg={bgColor}
        borderRight="1px"
        borderColor={borderColor}
        position="fixed"
        height="100vh"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('gray.300', 'gray.600'),
            borderRadius: '24px',
          },
        }}
      >
        <VStack spacing={8} align="stretch" p={6}>
          <VStack spacing={4} align="stretch">
            <Heading size="lg" color="blue.600">Track and Boost</Heading>
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<FaChevronDown />}
                  size="sm"
                  width="full"
                >
                  <HStack spacing={2}>
                    <Avatar size="xs" name={`${user?.firstName} ${user?.lastName}`} />
                    <Text fontSize="sm">{user?.firstName}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/settings">Profile</MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                as={RouterLink}
                to="/login"
                size="sm"
                colorScheme="blue"
                width="full"
              >
                Login
              </Button>
            )}
          </VStack>
          
          <Divider />
          
          <VStack spacing={2} align="stretch">
            {menuItems.map((item) => (
              <NavItem
                key={item.path}
                icon={item.icon}
                to={item.path}
                isActive={
                  item.path === '/' 
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path)
                }
              >
                {item.label}
              </NavItem>
            ))}
          </VStack>
        </VStack>
      </Box>

      <Box ml="280px" flex={1} bg={menuBg} minH="100vh">
        <Box p={8} maxW="1600px" margin="0 auto">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  )
}

const NavItem = ({ icon, children, to, isActive }: NavItemProps) => {
  const activeBg = useColorModeValue('blue.50', 'blue.900')
  const activeColor = useColorModeValue('blue.600', 'blue.200')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')
  const color = useColorModeValue('gray.700', 'gray.200')

  return (
    <RouterLink to={to}>
      <Flex
        align="center"
        p={3}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : color}
        _hover={{
          bg: isActive ? activeBg : hoverBg,
          color: isActive ? activeColor : color,
          transform: 'translateX(4px)',
        }}
        transition="all 0.2s"
      >
        <Icon
          as={icon}
          boxSize={5}
          _groupHover={{
            transform: 'scale(1.1)',
          }}
          transition="transform 0.2s"
        />
        <Text 
          ml={4} 
          fontWeight={isActive ? "600" : "normal"}
          fontSize="md"
        >
          {children}
        </Text>
      </Flex>
    </RouterLink>
  )
}

export default Layout