import React, { useState, useMemo } from 'react'
import {
  Box,
  Grid,
  Heading,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import TaskCard from './TaskCard'
import TaskFilters from './TaskFilters'
import { mockTasks } from '../utils/mockData.js'

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(mockTasks)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    assignee: 'all',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  })

  const bgColor = useColorModeValue('gray.50', 'gray.800')
  const columnBgColor = useColorModeValue('white', 'gray.700')

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks]

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      )
    }

    if (filters.status !== 'all') {
      result = result.filter(task => task.status === filters.status)
    }

    if (filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority)
    }

    if (filters.assignee !== 'all') {
      result = result.filter(task => task.assignee === filters.assignee)
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate) - new Date(b.dueDate)
          break
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'assignee':
          comparison = a.assignee.localeCompare(b.assignee)
          break
        default:
          comparison = 0
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [tasks, filters])

  const columns = {
    todo: filteredAndSortedTasks.filter(task => task.status === 'todo'),
    'in-progress': filteredAndSortedTasks.filter(
      task => task.status === 'in-progress'
    ),
    done: filteredAndSortedTasks.filter(task => task.status === 'done'),
  }

  const handleDragEnd = result => {
    if (!result.destination) return

    const { source, destination } = result
    const newStatus = destination.droppableId

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === parseInt(result.draggableId)
          ? { ...task, status: newStatus }
          : task
      )
    )
  }

  const handleTaskUpdate = updatedTask => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    )
  }

  return (
    <Box p={4} bg={bgColor} minH="calc(100vh - 64px)">
      <VStack spacing={4} align="stretch">
        <Heading size="lg">Kanban Board</Heading>
        <TaskFilters filters={filters} onFilterChange={setFilters} />
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            {Object.entries(columns).map(([status, tasks]) => (
              <Box
                key={status}
                bg={columnBgColor}
                p={4}
                borderRadius="md"
                shadow="sm"
              >
                <Heading size="md" mb={4} textTransform="capitalize">
                  {status.replace('-', ' ')}
                </Heading>
                <Droppable droppableId={status}>
                  {provided => (
                    <VStack
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      spacing={4}
                      align="stretch"
                    >
                      {tasks.map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={index}
                          onUpdate={handleTaskUpdate}
                        />
                      ))}
                      {provided.placeholder}
                    </VStack>
                  )}
                </Droppable>
              </Box>
            ))}
          </Grid>
        </DragDropContext>
      </VStack>
    </Box>
  )
}

export default KanbanBoard 