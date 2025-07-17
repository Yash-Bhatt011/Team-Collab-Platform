import React from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  HStack,
  Text,
  IconButton,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Divider,
  Container,
  Circle,
  VStack,
} from '@chakra-ui/react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { SunIcon, MoonIcon, HamburgerIcon, BellIcon } from '@chakra-ui/icons'
import { FiLogOut, FiUser, FiSettings, FiClock, FiCalendar, FiUsers, FiActivity, FiHelpCircle } from 'react-icons/fi'
import { useNotifications } from '../contexts/NotificationContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()
  const { unreadCount } = useNotifications()

  const handleNavigation = (path) => {
    navigate(path);
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const employeeLinks = [
    { name: 'Dashboard', path: '/employee' },
    { name: 'Team Chat', path: '/chat' },
    { name: 'Files', path: '/files' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Leave Request', path: '/leave-request' },
  ]

  const adminLinks = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Manage Users', path: '/admin/users' },
    { name: 'Settings', path: '/admin/settings' },
    { name: 'Attendance Management', path: '/admin/attendance' },
  ]

  return (
    <Box
      as="nav"
      w="100%"
      position="fixed"
      top={0}
      zIndex={1000}
      bg={useColorModeValue('whiteAlpha.800', 'blackAlpha.400')}
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
    >
      <Container maxW="container.xl">
        <Flex py={4} align="center" justify="space-between">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              cursor="pointer"
              onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/employee')}
              bgGradient="linear(to-r, blue.400, teal.400)"
              bgClip="text"
            >
              Team Collab
            </Text>
          </motion.div>

          <HStack spacing={8}>
            <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
              {(user?.role === 'admin' ? adminLinks : employeeLinks).map((item) => (
                <motion.div key={item.name} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation(item.path)}
                    _hover={{
                      bg: useColorModeValue('blue.50', 'whiteAlpha.100'),
                    }}
                  >
                    {item.name}
                  </Button>
                </motion.div>
              ))}
            </HStack>

            <HStack spacing={2}>
              <IconButton
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle color mode"
              />

              <Menu>
                <MenuButton
                  as={motion.div}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar
                    size="sm"
                    name={user?.name}
                    src={`https://i.pravatar.cc/150?u=${user?.email}`}
                    cursor="pointer"
                  />
                </MenuButton>
                <MenuList
                  bg={useColorModeValue('white', 'gray.800')}
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                  zIndex={1001}
                >
                  <MenuItem icon={<FiUser />} onClick={() => handleNavigation(`/${user?.role}/profile`)}>Profile</MenuItem>
                  <MenuItem icon={<FiSettings />}>Settings</MenuItem>
                  <Divider />
                  <MenuItem
                    icon={<FiLogOut />}
                    onClick={handleLogout}
                    color="red.400"
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<HamburgerIcon />}
                  variant="ghost"
                  display={{ base: 'flex', md: 'none' }}
                />
                <MenuList zIndex={1001}>
                  {(user?.role === 'admin' ? adminLinks : employeeLinks).map((item) => (
                    <MenuItem
                      key={item.name}
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={
                    <Box position="relative">
                      <BellIcon />
                      {unreadCount > 0 && (
                        <Circle
                          size="18px"
                          bg="red.500"
                          color="white"
                          position="absolute"
                          top="-8px"
                          right="-8px"
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          {unreadCount}
                        </Circle>
                      )}
                    </Box>
                  }
                  variant="ghost"
                />
                <MenuList
                  zIndex={10000}
                  bg={useColorModeValue('white', 'gray.800')}
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                  boxShadow="2xl"
                  border="1px solid"
                  minW="350px"
                  maxW="400px"
                  maxH="500px"
                  overflowY="auto"
                >
                  <NotificationList />
                </MenuList>
              </Menu>

              <IconButton
                icon={<FiActivity />}
                variant="ghost"
                onClick={() => navigate('/activity')}
                aria-label="Activity Timeline"
              />

              <IconButton
                icon={<FiHelpCircle />}
                variant="ghost"
                onClick={() => navigate('/tutorial')}
                aria-label="Tutorial"
              />
            </HStack>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

const NotificationList = () => {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  
  return (
    <VStack align="stretch" spacing={0}>
      <Box p={4} borderBottom="1px solid" borderColor="gray.200">
        <Text fontWeight="bold" fontSize="lg">Notifications</Text>
      </Box>
      {notifications.length === 0 ? (
        <Box p={4} textAlign="center">
          <Text color="gray.500">No notifications</Text>
        </Box>
      ) : (
        <>
          {notifications.slice(0, 5).map(notification => (
            <MenuItem
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              bg={notification.read ? 'transparent' : useColorModeValue('blue.50', 'whiteAlpha.100')}
              _hover={{
                bg: useColorModeValue('gray.50', 'whiteAlpha.200')
              }}
              p={4}
              borderBottom="1px solid"
              borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')}
            >
              <VStack align="start" spacing={1} w="100%">
                <HStack justify="space-between" w="100%">
                  <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                    {notification.title}
                  </Text>
                  {!notification.read && (
                    <Circle size="8px" bg="blue.500" />
                  )}
                </HStack>
                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                  {notification.message}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  {new Date(notification.timestamp).toLocaleString()}
                </Text>
              </VStack>
            </MenuItem>
          ))}
          <MenuItem 
            as={RouterLink} 
            to={`/${user?.role}/notifications`}
            p={4}
            textAlign="center"
            fontWeight="bold"
            color="blue.500"
            _hover={{
              bg: useColorModeValue('blue.50', 'whiteAlpha.100')
            }}
          >
            View All Notifications
          </MenuItem>
        </>
      )}
    </VStack>
  );
};

export default Navbar