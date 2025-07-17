import React from 'react';
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  HStack,
  IconButton,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Divider,
  Container,
  VStack,
  Text,
  Circle,
} from '@chakra-ui/react';
import { HamburgerIcon, SunIcon, MoonIcon, BellIcon } from '@chakra-ui/icons';
import { FiLogOut, FiUser, FiSettings, FiHelpCircle, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const NewNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const { unreadCount } = useNotifications();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = user?.role === 'admin' ? [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Manage Users', path: '/admin/users' },
    { name: 'Settings', path: '/admin/settings' },
    { name: 'Attendance Management', path: '/admin/attendance' },
  ] : [
    { name: 'Dashboard', path: '/employee' },
    { name: 'Team Chat', path: '/chat' },
    { name: 'Files', path: '/files' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Leave Request', path: '/leave-request' },
  ];

  return (
    <Box
      as="nav"
      w="100%"
      position="static"
      top={0}
      zIndex={1000}
      bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.900')}
      backdropFilter="saturate(180%) blur(5px)"
      borderBottom="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex py={3} align="center" justify="space-between">
          <Box
            fontWeight="bold"
            fontSize="xl"
            cursor="pointer"
            bgGradient="linear(to-r, blue.400, teal.400)"
            bgClip="text"
            onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/employee')}
          >
            Team Collab
          </Box>

          <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
            {links.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                onClick={() => handleNavigation(link.path)}
                _hover={{ bg: useColorModeValue('blue.50', 'whiteAlpha.100') }}
              >
                {link.name}
              </Button>
            ))}
          </HStack>

          <HStack spacing={3}>
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
            />

            <Menu>
              <MenuButton>
                <Avatar
                  size="sm"
                  name={user?.name}
                  src={`https://i.pravatar.cc/150?u=${user?.email}`}
                  cursor="pointer"
                />
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiUser />} onClick={() => handleNavigation(`/${user?.role}/profile`)}>Profile</MenuItem>
                <MenuItem icon={<FiSettings />}>Settings</MenuItem>
                <Divider />
                <MenuItem icon={<FiLogOut />} color="red.500" onClick={handleLogout}>
                  Logout
                </MenuItem>
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
                        top="-6px"
                        right="-6px"
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        {unreadCount}
                      </Circle>
                    )}
                  </Box>
                }
                variant="ghost"
                aria-label="Notifications"
              />
              <MenuList maxH="400px" overflowY="auto" zIndex={1100}>
                {/* Notification items can be rendered here */}
                <Text p={4} color="gray.500">No notifications</Text>
              </MenuList>
            </Menu>

            <IconButton
              icon={<FiActivity />}
              variant="ghost"
              aria-label="Activity Timeline"
              onClick={() => navigate('/activity')}
            />

            <IconButton
              icon={<FiHelpCircle />}
              variant="ghost"
              aria-label="Tutorial"
              onClick={() => navigate('/tutorial')}
            />

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="ghost"
                display={{ base: 'flex', md: 'none' }}
                aria-label="Open menu"
              />
              <MenuList zIndex={1100}>
                {links.map((link) => (
                  <MenuItem key={link.name} onClick={() => handleNavigation(link.path)}>
                    {link.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default NewNavbar;
