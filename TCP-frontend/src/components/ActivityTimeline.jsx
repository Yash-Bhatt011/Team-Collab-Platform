import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Divider,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiCheckCircle, 
  FiUpload, 
  FiMessageCircle, 
  FiClock 
} from 'react-icons/fi';
import { mockUserActivity } from '../utils/mockData';

const getActivityIcon = (type) => {
  switch (type) {
    case 'task_completion':
      return { icon: FiCheckCircle, color: 'green.500' };
    case 'file_upload':
      return { icon: FiUpload, color: 'blue.500' };
    case 'comment':
      return { icon: FiMessageCircle, color: 'purple.500' };
    default:
      return { icon: FiClock, color: 'gray.500' };
  }
};

const ActivityTimeline = ({ userId }) => {
  const userActivity = mockUserActivity.find(ua => ua.userId === userId);
  const bgColor = useColorModeValue('white', 'gray.700');

  if (!userActivity) return null;

  return (
    <Box p={4} bg={bgColor} borderRadius="lg" shadow="sm">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" fontSize="lg">Today's Activity</Text>
        
        {/* Summary */}
        <HStack spacing={4} wrap="wrap">
          <Badge colorScheme="green">
            {userActivity.summary.tasksCompleted} Tasks Completed
          </Badge>
          <Badge colorScheme="blue">
            {userActivity.summary.filesUploaded} Files Uploaded
          </Badge>
          <Badge colorScheme="purple">
            {userActivity.summary.commentsAdded} Comments Added
          </Badge>
        </HStack>

        <Divider />

        {/* Timeline */}
        <VStack spacing={3} align="stretch">
          {userActivity.activities.map((activity, index) => {
            const { icon: ActivityIcon, color } = getActivityIcon(activity.type);
            return (
              <HStack key={index} spacing={3}>
                <Box color={color}>
                  <Icon as={ActivityIcon} boxSize="20px" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm">{activity.details}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(activity.time).toLocaleTimeString()}
                  </Text>
                </VStack>
              </HStack>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
};

export default ActivityTimeline;
