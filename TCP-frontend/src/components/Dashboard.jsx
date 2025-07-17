import React from 'react'
import {
  Box,
  Grid,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { mockTasks, mockActivities } from '../utils/mockData'

const Dashboard = () => {
  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const stats = {
    totalTasks: mockTasks.length,
    completedTasks: mockTasks.filter(task => task.status === 'done').length,
    inProgressTasks: mockTasks.filter(task => task.status === 'in-progress').length,
    todoTasks: mockTasks.filter(task => task.status === 'todo').length,
  }

  const recentActivities = mockActivities.slice(0, 5)

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Dashboard</Heading>

        {/* Stats Overview */}
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          <Stat
            p={4}
            bg={bgColor}
            borderRadius="md"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel>Total Tasks</StatLabel>
            <StatNumber>{stats.totalTasks}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {((stats.completedTasks / stats.totalTasks) * 100).toFixed(1)}% completion rate
            </StatHelpText>
          </Stat>

          <Stat
            p={4}
            bg={bgColor}
            borderRadius="md"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel>Completed</StatLabel>
            <StatNumber>{stats.completedTasks}</StatNumber>
            <StatHelpText>
              {((stats.completedTasks / stats.totalTasks) * 100).toFixed(1)}% of total
            </StatHelpText>
          </Stat>

          <Stat
            p={4}
            bg={bgColor}
            borderRadius="md"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel>In Progress</StatLabel>
            <StatNumber>{stats.inProgressTasks}</StatNumber>
            <StatHelpText>
              {((stats.inProgressTasks / stats.totalTasks) * 100).toFixed(1)}% of total
            </StatHelpText>
          </Stat>

          <Stat
            p={4}
            bg={bgColor}
            borderRadius="md"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel>To Do</StatLabel>
            <StatNumber>{stats.todoTasks}</StatNumber>
            <StatHelpText>
              {((stats.todoTasks / stats.totalTasks) * 100).toFixed(1)}% of total
            </StatHelpText>
          </Stat>
        </Grid>

        {/* Recent Activities */}
        <Box
          p={4}
          bg={bgColor}
          borderRadius="md"
          border="1px"
          borderColor={borderColor}
        >
          <Heading size="md" mb={4}>
            Recent Activities
          </Heading>
          <VStack spacing={4} align="stretch">
            {recentActivities.map((activity) => (
              <Box
                key={activity.id}
                p={3}
                bg={useColorModeValue('gray.50', 'gray.600')}
                borderRadius="md"
              >
                <HStack>
                  <Text fontWeight="bold">{activity.user}</Text>
                  <Text>{activity.action}</Text>
                  <Text fontWeight="bold">{activity.target}</Text>
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  {new Date(activity.timestamp).toLocaleString()}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default Dashboard 