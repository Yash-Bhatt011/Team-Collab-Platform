import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  AvatarBadge,
  useColorModeValue,
  Divider,
  IconButton,
  useToast,
  Badge,
  Flex,
  Container,
  Heading,
  Spacer,
} from '@chakra-ui/react'
import { AttachmentIcon, CloseIcon } from '@chakra-ui/icons'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import io from 'socket.io-client'
import { getChatMessages, sendMessage, getUserChats, createChat } from '../services/api/chatApi'

const SOCKET_URL = 'http://localhost:5000'

const TeamChat = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [typingUsers, setTypingUsers] = useState(new Set())
  const [chatId, setChatId] = useState(null)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  useEffect(() => {
    initializeChat()
  }, [])

  const initializeChat = async () => {
    try {
      console.log('Initializing chat...');
      // First try to find existing team chat
      const chatsResponse = await getUserChats();
      console.log('Got chats response:', chatsResponse);
      
      if (!chatsResponse.success || !chatsResponse.data) {
        throw new Error('Failed to fetch chats');
      }

      const teamChat = chatsResponse.data.find(chat => chat.type === 'team');
      console.log('Found team chat:', teamChat);
      
      if (teamChat) {
        console.log('Using existing team chat with ID:', teamChat._id);
        setChatId(teamChat._id);
        // Fetch messages immediately after getting chat ID
        await fetchMessages(teamChat._id);
        // Initialize socket after fetching messages
        initializeSocket();
      } else {
        console.log('No team chat found, creating new one...');
        // Create new team chat if none exists
        const newChatResponse = await createChat({
          name: 'Team Chat',
          type: 'team',
          participants: [], // Backend will add current user automatically
        });
        console.log('Created new team chat:', newChatResponse);
        
        if (!newChatResponse.success || !newChatResponse.data) {
          throw new Error('Failed to create team chat');
        }
        
        setChatId(newChatResponse.data._id);
        // Fetch messages immediately after creating chat
        await fetchMessages(newChatResponse.data._id);
        // Initialize socket after fetching messages
        initializeSocket();
      }
      
    } catch (error) {
      console.error('Chat initialization error:', error);
      toast({
        title: 'Error',
        description: `Failed to initialize chat: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const initializeSocket = () => {
    console.log('Initializing socket with chatId:', chatId);
    if (!chatId) {
      console.error('Cannot initialize socket: chatId is null');
      return;
    }

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL);
    console.log('Socket connection created');

    // Join team chat room
    socketRef.current.emit('join_chat', chatId);
    console.log('Joined chat room:', chatId);

    // Listen for new messages
    socketRef.current.on('receive_message', (messageData) => {
      console.log('Received new message:', messageData);
      // Only add the message if it's not already in the list
      setMessages(prev => {
        const messageExists = prev.some(m => m._id === messageData._id);
        if (!messageExists) {
          const newMessages = [...prev, messageData].sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
          );
          return newMessages;
        }
        return prev;
      });
    });

    // Listen for typing status
    socketRef.current.on('user_typing', ({ userId, username }) => {
      console.log('User typing:', username);
      setTypingUsers(prev => new Set([...prev, username]));
      // Clear typing status after 2 seconds
      setTimeout(() => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(username);
          return newSet;
        });
      }, 2000);
    });

    // Clean up socket connection on unmount
    return () => {
      console.log('Cleaning up socket connection');
      if (socketRef.current) {
        socketRef.current.emit('leave_chat', chatId);
        socketRef.current.disconnect();
      }
    };
  };

  // Add a new useEffect to monitor chatId changes and reconnect socket if needed
  useEffect(() => {
    console.log('chatId changed:', chatId);
    if (chatId) {
      const cleanup = initializeSocket();
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, [chatId]);

  const fetchMessages = async (targetChatId = null) => {
    const chatIdToUse = targetChatId || chatId;
    if (!chatIdToUse) {
      console.error('Cannot fetch messages: chatId is null');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching messages for chat:', chatIdToUse);
      const response = await getChatMessages(chatIdToUse);
      console.log('Messages response:', response);
      
      if (response.success) {
        // Sort messages by creation date
        const sortedMessages = response.data.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
      } else {
        throw new Error(response.message || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch messages: ${error.message}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add periodic message refresh
  useEffect(() => {
    if (!chatId) return;

    // Refresh messages every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchMessages();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 10MB',
          status: 'error',
          duration: 3000,
        })
        return
      }
      setSelectedFile(file)
    }
  }

  const handleTyping = () => {
    if (!chatId) return
    
    socketRef.current.emit('typing', {
      chatId: chatId,
      userId: user.id,
      username: user.name
    })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return
    if (!chatId) {
      toast({
        title: 'Error',
        description: 'Chat not initialized',
        status: 'error',
        duration: 3000,
      })
      return
    }

    try {
      const messageData = {
        content: newMessage,
        type: selectedFile ? 'file' : 'text',
        attachments: selectedFile ? [{
          filename: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        }] : []
      }

      const response = await sendMessage(chatId, messageData)
      
      if (response.success) {
        // Emit the message through socket
        socketRef.current.emit('send_message', {
          chatId: chatId,
          ...response.data
        })

        setNewMessage('')
        setSelectedFile(null)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Box
      h="100vh"
      pt="64px"
      bg={useColorModeValue(
        'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(120deg, #2C3E50 0%, #000000 100%)'
      )}
    >
      <Container maxW="container.xl" h="calc(100vh - 64px)">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            h="full"
            display="flex"
            flexDirection="column"
            bg={useColorModeValue('whiteAlpha.800', 'blackAlpha.400')}
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="2xl"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
          >
            {/* Chat Header */}
            <HStack
              p={4}
              borderBottom="1px solid"
              borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
              bg={useColorModeValue('whiteAlpha.700', 'blackAlpha.300')}
            >
              <Heading size="md">Team Chat</Heading>
              <Spacer />
              {typingUsers.size > 0 && (
                <Text fontSize="sm" color="gray.500">
                  {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                </Text>
              )}
            </HStack>

            {/* Messages Area */}
            <VStack
              flex={1}
              overflowY="auto"
              p={4}
              spacing={4}
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: useColorModeValue('gray.300', 'gray.700'),
                  borderRadius: '24px',
                },
              }}
            >
              {messages.map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%' }}
                >
                  <Box
                    p={3}
                    bg={useColorModeValue('gray.50', 'gray.600')}
                    borderRadius="md"
                    maxW="80%"
                    alignSelf={message.sender._id === user.id ? 'flex-end' : 'flex-start'}
                  >
                    <HStack spacing={3}>
                      <Avatar
                        size="sm"
                        name={message.sender.name}
                        src={`https://i.pravatar.cc/150?u=${message.sender.email}`}
                      />
                      <VStack align="start" spacing={1}>
                        <HStack>
                          <Text fontWeight="bold">{message.sender.name}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {new Date(message.createdAt).toLocaleString()}
                          </Text>
                        </HStack>
                        <Text>{message.content}</Text>
                        {message.attachments?.map((attachment, index) => (
                          <HStack
                            key={index}
                            p={2}
                            bg={useColorModeValue('gray.100', 'gray.500')}
                            borderRadius="md"
                          >
                            <AttachmentIcon />
                            <Text fontSize="sm">{attachment.filename}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </HStack>
                  </Box>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </VStack>

            {/* Message Input */}
            <Box
              p={4}
              borderTop="1px solid"
              borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
              bg={useColorModeValue('whiteAlpha.700', 'blackAlpha.300')}
            >
              <VStack spacing={3}>
                {selectedFile && (
                  <HStack
                    p={2}
                    bg={useColorModeValue('gray.100', 'gray.500')}
                    borderRadius="md"
                    w="100%"
                  >
                    <AttachmentIcon />
                    <Text fontSize="sm" flex="1">
                      {selectedFile.name}
                    </Text>
                    <IconButton
                      icon={<CloseIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedFile(null)}
                    />
                  </HStack>
                )}
                <HStack w="100%">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    onKeyDown={handleTyping}
                    placeholder="Type a message..."
                  />
                  <input
                    type="file"
                    id="file-upload"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
                  <IconButton
                    icon={<AttachmentIcon />}
                    onClick={() => document.getElementById('file-upload').click()}
                  />
                  <Button
                    colorScheme="blue"
                    onClick={handleSendMessage}
                    isDisabled={!newMessage.trim() && !selectedFile}
                  >
                    Send
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}

export default TeamChat