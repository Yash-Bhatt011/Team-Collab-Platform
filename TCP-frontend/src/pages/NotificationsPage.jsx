import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Text,
  Badge,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { BellIcon, InfoIcon } from '@chakra-ui/icons';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationsPage = () => {
  const { notifications, announcements, markAsRead } = useNotifications();

  return (
    <Box pt="80px" minH="100vh">
      <Container maxW="container.lg" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Notifications</Heading>
          
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList>
              <Tab>All Notifications</Tab>
              <Tab>Announcements</Tab>
              <Tab>Tasks</Tab>
              <Tab>Mentions</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <NotificationList 
                  items={notifications} 
                  onMarkAsRead={markAsRead} 
                />
              </TabPanel>
              <TabPanel>
                <NotificationList 
                  items={notifications.filter(n => n.type === 'announcement')}
                  onMarkAsRead={markAsRead}
                />
              </TabPanel>
              <TabPanel>
                <NotificationList 
                  items={notifications.filter(n => n.type === 'task')}
                  onMarkAsRead={markAsRead}
                />
              </TabPanel>
              <TabPanel>
                <NotificationList 
                  items={notifications.filter(n => n.type === 'mention')}
                  onMarkAsRead={markAsRead}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

const NotificationList = ({ items, onMarkAsRead }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'announcement':
        return InfoIcon;
      default:
        return BellIcon;
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {items.map((notification) => (
        <Box
          key={notification.id}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          onClick={() => onMarkAsRead(notification.id)}
          cursor="pointer"
          bg={notification.read ? 'transparent' : 'whiteAlpha.100'}
          _hover={{ bg: 'whiteAlpha.200' }}
        >
          <HStack spacing={4}>
            <Icon as={getIcon(notification.type)} boxSize={5} />
            <VStack align="start" spacing={1} flex={1}>
              <HStack justify="space-between" width="100%">
                <Text fontWeight="bold">{notification.title}</Text>
                {!notification.read && (
                  <Badge colorScheme="red">New</Badge>
                )}
              </HStack>
              <Text color="gray.500">{notification.message}</Text>
              <Text fontSize="sm" color="gray.400">
                {new Date(notification.timestamp).toLocaleString()}
              </Text>
            </VStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default NotificationsPage;
