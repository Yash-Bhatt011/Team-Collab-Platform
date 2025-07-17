import React, { useMemo } from 'react'
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
  Progress,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'

const TaskAnalytics = ({ tasks }) => {
  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(task => task.status === 'done').length
    const inProgress = tasks.filter(task => task.status === 'in-progress').length
    const todo = tasks.filter(task => task.status === 'todo').length

    const highPriority = tasks.filter(task => task.priority === 'high').length
    const mediumPriority = tasks.filter(task => task.priority === 'medium').length
    const lowPriority = tasks.filter(task => task.priority === 'low').length

    const completionRate = total > 0 ? (completed / total) * 100 : 0
    const overdueTasks = tasks.filter(
      task =>
        task.status !== 'done' &&
        new Date(task.dueDate) < new Date()
    ).length

    const avgCompletionTime = tasks
      .filter(task => task.status === 'done')
      .reduce((acc, task) => {
        const startDate = new Date(task.createdAt || task.dueDate)
        const endDate = new Date(task.completedAt || task.dueDate)
        return acc + (endDate - startDate) / (1000 * 60 * 60 * 24) // Convert to days
      }, 0) / completed || 0

    return {
      total,
      completed,
      inProgress,
      todo,
      highPriority,
      mediumPriority,
      lowPriority,
      completionRate,
      overdueTasks,
      avgCompletionTime,
    }
  }, [tasks])

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Task Analytics</Heading>

        {/* Overview Stats */}
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          <Stat
            p={4}
            bg={bgColor}
            borderRadius="md"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel>Total Tasks</StatLabel>
            <StatNumber>{stats.total}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.completionRate.toFixed(1)}% completion rate
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
            <StatNumber>{stats.completed}</StatNumber>
            <StatHelpText>
              {((stats.completed / stats.total) * 100).toFixed(1)}% of total
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
            <StatNumber>{stats.inProgress}</StatNumber>
            <StatHelpText>
              {((stats.inProgress / stats.total) * 100).toFixed(1)}% of total
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
            <StatNumber>{stats.todo}</StatNumber>
            <StatHelpText>
              {((stats.todo / stats.total) * 100).toFixed(1)}% of total
            </StatHelpText>
          </Stat>
        </Grid>

        {/* Priority Distribution */}
        <Box
          p={4}
          bg={bgColor}
          borderRadius="md"
          border="1px"
          borderColor={borderColor}
        >
          <Heading size="md" mb={4}>
            Priority Distribution
          </Heading>
          <VStack spacing={4} align="stretch">
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text>High Priority</Text>
                <Text>{stats.highPriority}</Text>
              </HStack>
              <Progress
                value={(stats.highPriority / stats.total) * 100}
                colorScheme="red"
                size="sm"
              />
            </Box>
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text>Medium Priority</Text>
                <Text>{stats.mediumPriority}</Text>
              </HStack>
              <Progress
                value={(stats.mediumPriority / stats.total) * 100}
                colorScheme="orange"
                size="sm"
              />
            </Box>
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text>Low Priority</Text>
                <Text>{stats.lowPriority}</Text>
              </HStack>
              <Progress
                value={(stats.lowPriority / stats.total) * 100}
                colorScheme="green"
                size="sm"
              />
            </Box>
          </VStack>
        </Box>

        {/* Additional Metrics */}
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <Box
            p={4}
            bg={bgColor}
            borderRadius="md"
            border="1px"
            borderColor={borderColor}
          >
            <Stat>
              <StatLabel>Overdue Tasks</StatLabel>
              <StatNumber>{stats.overdueTasks}</StatNumber>
              <StatHelpText>
                {((stats.overdueTasks / stats.total) * 100).toFixed(1)}% of total
              </StatHelpText>
            </Stat>
          </Box>

          <Box
            p={4}
            bg={bgColor}
            borderRadius="md"
            border="1px"
            borderColor={borderColor}
          >
            <Stat>
              <StatLabel>Average Completion Time</StatLabel>
              <StatNumber>{stats.avgCompletionTime.toFixed(1)} days</StatNumber>
              <StatHelpText>Based on completed tasks</StatHelpText>
            </Stat>
          </Box>
        </Grid>
      </VStack>
    </Box>
  )
}

export default TaskAnalytics 