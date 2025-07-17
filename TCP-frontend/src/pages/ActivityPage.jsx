import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  HStack,
  Icon,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { FiCheckCircle, FiUpload, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { mockUserActivity } from '../utils/mockData';

const ActivityPage = () => {
  const { user } = useAuth();
  const userActivity = mockUserActivity.find(a => a.userId === user.id);

  return (
    <Box pt={20}>
      <Container maxW="container.lg">
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Activity Timeline</Heading>

          {/* Today's Summary */}
          <HStack spacing={4} wrap="wrap">
            <Badge colorScheme="green">
              {userActivity?.summary.tasksCompleted || 0} Tasks Completed
            </Badge>
            <Badge colorScheme="blue">
              {userActivity?.summary.filesUploaded || 0} Files Uploaded
            </Badge>
            <Badge colorScheme="purple">
              {userActivity?.summary.commentsAdded || 0} Comments Added
            </Badge>
          </HStack>

          <Divider />

          {/* Activity List */}
          <VStack spacing={4} align="stretch">
            {userActivity?.activities.map((activity, index) => (
              <HStack key={index} spacing={4} p={4} borderWidth="1px" borderRadius="md">
                <Icon 
                  as={
                    activity.type === 'task_completion' ? FiCheckCircle :
                    activity.type === 'file_upload' ? FiUpload :
                    FiMessageCircle
                  }
                  color={
                    activity.type === 'task_completion' ? 'green.500' :
                    activity.type === 'file_upload' ? 'blue.500' :
                    'purple.500'
                  }
                  boxSize="20px"
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium">{activity.details}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(activity.time).toLocaleTimeString()}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default ActivityPage;
