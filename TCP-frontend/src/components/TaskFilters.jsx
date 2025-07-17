import React from 'react'
import {
  Box,
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

const TaskFilters = ({ filters, onFilterChange }) => {
  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value })
  }

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      border="1px"
      borderColor={borderColor}
      mb={4}
    >
      <HStack spacing={4}>
        {/* Search Input */}
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </InputGroup>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          placeholder="Filter by status"
          minW="150px"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </Select>

        {/* Priority Filter */}
        <Select
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          placeholder="Filter by priority"
          minW="150px"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>

        {/* Assignee Filter */}
        <Select
          value={filters.assignee}
          onChange={(e) => handleChange('assignee', e.target.value)}
          placeholder="Filter by assignee"
          minW="150px"
        >
          <option value="all">All Assignees</option>
          <option value="John Doe">John Doe</option>
          <option value="Jane Smith">Jane Smith</option>
          <option value="Mike Johnson">Mike Johnson</option>
        </Select>

        {/* Sort By */}
        <Select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          placeholder="Sort by"
          minW="150px"
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
          <option value="assignee">Assignee</option>
        </Select>

        {/* Sort Order */}
        <Select
          value={filters.sortOrder}
          onChange={(e) => handleChange('sortOrder', e.target.value)}
          minW="120px"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Select>
      </HStack>
    </Box>
  )
}

export default TaskFilters 