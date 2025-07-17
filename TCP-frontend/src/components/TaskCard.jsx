import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  useColorModeValue,
  Collapse,
  Button,
  useDisclosure,
  Textarea,
  Tooltip,
} from '@chakra-ui/react'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  AttachmentIcon,
  ChatIcon,
} from '@chakra-ui/icons'
import { FiLock } from 'react-icons/fi'
import TaskComments from './TaskComments'
import FileAttachment from './FileAttachment'
import PrivateNotes from './PrivateNotes'
import { mockPrivateNotes } from '../utils/mockData'
import { useAuth } from '../contexts/AuthContext'

const TaskCard = ({ task, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isOpen: isCommentsOpen, onToggle: onCommentsToggle } = useDisclosure()
  const { isOpen: isFilesOpen, onToggle: onFilesToggle } = useDisclosure()
  const [showPrivateNotes, setShowPrivateNotes] = useState(false)
  const [privateNote, setPrivateNote] = useState(
    mockPrivateNotes.find(note => note.taskId === task.id)?.content || ''
  )
  const { user } = useAuth()

  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleFileUpload = (file) => {
    // In a real app, you would upload the file to a server
    // and then update the task with the file URL
    const newAttachments = [...(task.attachments || []), {
      id: Date.now(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }]
    onUpdate({ ...task, attachments: newAttachments })
  }

  const handleDeleteFile = (fileId) => {
    const newAttachments = task.attachments.filter(f => f.id !== fileId)
    onUpdate({ ...task, attachments: newAttachments })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red'
      case 'medium':
        return 'orange'
      case 'low':
        return 'green'
      default:
        return 'gray'
    }
  }

  const handleSaveNote = () => {
    const updatedNote = {
      id: Date.now(),
      taskId: task.id,
      userId: user.id,
      content: privateNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPrivate: true
    }
    // In a real app, you would save this to your backend
    console.log('Saving note:', updatedNote)
  }

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      border="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <VStack align="stretch" spacing={3}>
        {/* Task Header */}
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">{task.title}</Text>
            <HStack>
              <Badge colorScheme={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              {task.dueDate && (
                <Badge colorScheme="blue">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Badge>
              )}
            </HStack>
          </VStack>
          <IconButton
            icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </HStack>

        {/* Task Description */}
        <Collapse in={isExpanded}>
          <Text fontSize="sm" color="gray.600">
            {task.description}
          </Text>
        </Collapse>

        {/* Task Actions */}
        <HStack spacing={2}>
          <Button
            leftIcon={<ChatIcon />}
            size="sm"
            variant="ghost"
            onClick={onCommentsToggle}
          >
            Comments
          </Button>
          <Button
            leftIcon={<AttachmentIcon />}
            size="sm"
            variant="ghost"
            onClick={onFilesToggle}
          >
            Files
          </Button>
          <Button
            leftIcon={<FiLock />}
            size="sm"
            variant="ghost"
            onClick={() => setShowPrivateNotes(!showPrivateNotes)}
          >
            Private Notes
          </Button>
        </HStack>

        {/* Comments Section */}
        <Collapse in={isCommentsOpen}>
          <Box mt={2}>
            <TaskComments
              comments={task.comments || []}
              onAddComment={(comment) => {
                const newComments = [...(task.comments || []), comment]
                onUpdate({ ...task, comments: newComments })
              }}
            />
          </Box>
        </Collapse>

        {/* Files Section */}
        <Collapse in={isFilesOpen}>
          <Box mt={2}>
            <FileAttachment
              attachments={task.attachments || []}
              onFileUpload={handleFileUpload}
            />
          </Box>
        </Collapse>

        {/* Private Notes Section */}
        <Collapse in={showPrivateNotes}>
          <Box mt={3} p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
            <VStack align="stretch" spacing={3}>
              <HStack>
                <Icon as={FiLock} color="gray.500" />
                <Text fontSize="sm" color="gray.500">Private Note (Only visible to you)</Text>
              </HStack>
              
              <Textarea
                value={privateNote}
                onChange={(e) => setPrivateNote(e.target.value)}
                placeholder="Add your private notes here..."
                size="sm"
                resize="vertical"
                minH="100px"
              />
              
              <Button
                size="sm"
                colorScheme="blue"
                onClick={handleSaveNote}
                isDisabled={!privateNote.trim()}
              >
                Save Note
              </Button>
            </VStack>
          </Box>
        </Collapse>
      </VStack>
    </Box>
  )
}

export default TaskCard