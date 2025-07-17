import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  IconButton,
  useColorModeValue,
  Badge,
  HStack,
  Icon,
  Spinner,
  Button,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { FiBell, FiCheck, FiRadio, FiAlertCircle, FiInfo, FiClock } from 'react-icons/fi';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api/notificationApi';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setMarkingRead(true);
      await markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        )
      );
      
      toast({
        title: 'Success',
        description: 'Notification marked as read',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    } finally {
      setMarkingRead(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingRead(true);
      await markAllNotificationsAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
      );
      
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    } finally {
      setMarkingRead(false);
    }
  };

  const getNotificationIcon = (type, category) => {
    if (category === 'broadcast') {
      return FiRadio;
    }
    
    switch (type) {
      case 'task_assigned':
      case 'task_updated':
      case 'task_completed':
        return FiBell;
      case 'leave_request':
      case 'leave_approved':
      case 'leave_rejected':
        return FiClock;
      case 'system_announcement':
        return FiInfo;
      default:
        return FiAlertCircle;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'urgent') return 'red';
    if (priority === 'high') return 'orange';
    if (priority === 'medium') return 'yellow';
    if (priority === 'low') return 'green';
    
    // Default colors based on type
    switch (type) {
      case 'broadcast_urgent':
        return 'red';
      case 'broadcast_announcement':
        return 'blue';
      case 'broadcast_reminder':
        return 'orange';
      case 'task_completed':
        return 'green';
      case 'leave_rejected':
        return 'red';
      case 'leave_approved':
        return 'green';
      default:
        return 'blue';
    }
  };

  const getNotificationBadge = (notification) => {
    if (notification.broadcast) {
      return <Badge colorScheme="purple">Broadcast</Badge>;
    }
    
    if (!notification.isRead) {
      return <Badge colorScheme="red">New</Badge>;
    }
    
    return null;
  };

  const getNotificationTarget = (notification) => {
    if (notification.broadcast) {
      switch (notification.broadcastTarget) {
        case 'all':
          return 'All Users';
        case 'employees':
          return 'Employees Only';
        case 'admins':
          return 'Admins Only';
        case 'department':
          return `Department: ${notification.department}`;
        default:
          return notification.broadcastTarget;
      }
    }
    return null;
  };

  const renderNotification = (notification) => {
    const IconComponent = getNotificationIcon(notification.type, notification.category);
    const color = getNotificationColor(notification.type, notification.priority);
    
    return (
      <Box
        key={notification._id}
        p={4}
        bg={notification.isRead ? 'transparent' : 'whiteAlpha.100'}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        transition="all 0.2s"
        _hover={{ bg: 'whiteAlpha.200' }}
      >
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={2} flex={1}>
            <HStack spacing={2}>
              <Icon as={IconComponent} color={`${color}.500`} />
              <Text fontWeight="bold" fontSize="sm">
                {notification.title}
              </Text>
              {getNotificationBadge(notification)}
            </HStack>
            
            <Text color="gray.500" fontSize="sm">
              {notification.message}
            </Text>
            
            {getNotificationTarget(notification) && (
              <Text fontSize="xs" color="gray.400">
                Target: {getNotificationTarget(notification)}
              </Text>
            )}
            
            <HStack spacing={4} fontSize="xs" color="gray.400">
              <Text>
                {notification.sender?.name || 'System'}
              </Text>
              <Text>
                {new Date(notification.createdAt).toLocaleString()}
              </Text>
              {notification.priority && (
                <Badge size="sm" colorScheme={color}>
                  {notification.priority}
                </Badge>
              )}
            </HStack>
          </VStack>
          
          {!notification.isRead && (
            <IconButton
              icon={<FiCheck />}
              onClick={() => handleMarkAsRead(notification._id)}
              variant="ghost"
              size="sm"
              isLoading={markingRead}
              aria-label="Mark as read"
            />
          )}
        </HStack>
      </Box>
    );
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);
  const broadcastNotifications = notifications.filter(n => n.broadcast);
  const directNotifications = notifications.filter(n => !n.broadcast);

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading notifications...</Text>
      </Box>
    );
  }

  return (
    <Box p={6} bg={bgColor} borderRadius="xl" boxShadow="xl">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <HStack>
            <FiBell size={24} />
            <Text fontSize="2xl" fontWeight="bold">Notifications</Text>
            {unreadNotifications.length > 0 && (
              <Badge colorScheme="red" fontSize="sm">
                {unreadNotifications.length} new
              </Badge>
            )}
          </HStack>
          
          {unreadNotifications.length > 0 && (
            <Button
              size="sm"
              onClick={handleMarkAllAsRead}
              isLoading={markingRead}
              loadingText="Marking..."
            >
              Mark All Read
            </Button>
          )}
        </HStack>

        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>
            <Tab>All ({notifications.length})</Tab>
            <Tab>Unread ({unreadNotifications.length})</Tab>
            <Tab>Broadcasts ({broadcastNotifications.length})</Tab>
            <Tab>Direct ({directNotifications.length})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <VStack spacing={4} align="stretch">
                {notifications.length > 0 ? (
                  notifications.map(renderNotification)
                ) : (
                  <Text textAlign="center" color="gray.500" py={8}>
                    No notifications found.
                  </Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel p={0}>
              <VStack spacing={4} align="stretch">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map(renderNotification)
                ) : (
                  <Text textAlign="center" color="gray.500" py={8}>
                    No unread notifications.
                  </Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel p={0}>
              <VStack spacing={4} align="stretch">
                {broadcastNotifications.length > 0 ? (
                  broadcastNotifications.map(renderNotification)
                ) : (
                  <Text textAlign="center" color="gray.500" py={8}>
                    No broadcast notifications.
                  </Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel p={0}>
              <VStack spacing={4} align="stretch">
                {directNotifications.length > 0 ? (
                  directNotifications.map(renderNotification)
                ) : (
                  <Text textAlign="center" color="gray.500" py={8}>
                    No direct notifications.
                  </Text>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default NotificationCenter;
