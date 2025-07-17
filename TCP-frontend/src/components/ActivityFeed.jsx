import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  useColorModeValue,
  Divider,
  Badge,
  Icon,
} from '@chakra-ui/react'
import {
  TimeIcon,
  ChatIcon,
  CheckIcon,
  AttachmentIcon,
} from '@chakra-ui/icons'
import { mockActivities } from '../utils/mockData.js'

const ActivityFeed = () => {
  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const getActivityIcon = (action) => {
    switch (action) {
      case 'created':
        return <TimeIcon color="blue.500" />
      case 'commented on':
        return <ChatIcon color="green.500" />
      case 'completed':
        return <CheckIcon color="purple.500" />
      case 'attached':
        return <AttachmentIcon color="orange.500" />
      default:
        return <TimeIcon color="gray.500" />
    }
  }

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Activity Feed</Text>
        <VStack spacing={4} align="stretch">
          {mockActivities.map(activity => (
            <Box
              key={activity.id}
              p={4}
              bg={bgColor}
              borderRadius="md"
              border="1px"
              borderColor={borderColor}
            >
              <HStack spacing={3} mb={2}>
                <Avatar name={activity.user} size="sm" />
                <Text fontWeight="bold">{activity.user}</Text>
                <Text>{activity.action}</Text>
                <Text fontWeight="bold">{activity.target}</Text>
              </HStack>
              <HStack spacing={2} color="gray.500">
                {getActivityIcon(activity.action)}
                <Text fontSize="sm">{new Date(activity.timestamp).toLocaleString()}</Text>
              </HStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  )
}

export default ActivityFeed 