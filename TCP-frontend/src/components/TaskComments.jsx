import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Input,
  IconButton,
  useToast,
} from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '../contexts/AuthContext'

const TaskComments = ({ taskId, comments = [], onAddComment }) => {
  const [newComment, setNewComment] = useState('')
  const { user } = useAuth()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await onAddComment(taskId, newComment)
      setNewComment('')
    } catch (error) {
      toast({
        title: 'Error adding comment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {comments.map((comment, index) => (
          <Box key={index} p={3} bg="gray.50" borderRadius="md">
            <HStack mb={2}>
              <Avatar size="sm" name={comment.author} />
              <Text fontWeight="bold">{comment.author}</Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(comment.timestamp).toLocaleString()}
              </Text>
            </HStack>
            <Box pl={10}>
              <ReactMarkdown>{comment.content}</ReactMarkdown>
            </Box>
          </Box>
        ))}

        <form onSubmit={handleSubmit}>
          <HStack>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <IconButton
              type="submit"
              aria-label="Add comment"
              icon={<ChatIcon />}
              colorScheme="blue"
            />
          </HStack>
        </form>
      </VStack>
    </Box>
  )
}

export default TaskComments