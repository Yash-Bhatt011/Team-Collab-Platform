import React, { useState, useEffect, useRef } from 'react';
import {
  Box, VStack, HStack, Input, Button, Text, Avatar, Divider, IconButton, Badge, useColorModeValue, useBreakpointValue, Flex
} from '@chakra-ui/react';
import { ArrowBackIcon, CloseIcon, AddIcon, ChatIcon, AttachmentIcon } from '@chakra-ui/icons';
import { BsEmojiSmile } from 'react-icons/bs';
import UserSearch from './UserSearch';
import { searchUsers } from '../services/api/userApi';
import { createChat, getUserChats, getChatMessages, sendMessage } from '../services/api/chatApi';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

const ChatWindow = ({ onDrawerClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedChat]);

  useEffect(() => {
    if (!selectedChat) return;
    setLoadingMessages(true);
    setError(null);
    getChatMessages(selectedChat)
      .then(res => {
        setMessages(res.data || []);
      })
      .catch(err => {
        setError('Failed to load messages');
        setMessages([]);
      })
      .finally(() => setLoadingMessages(false));
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat) return;
    // Clean up previous socket
    if (socketRef.current) {
      socketRef.current.emit('leave_chat', selectedChat);
      socketRef.current.disconnect();
    }
    // Connect to socket.io server
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('join_chat', selectedChat);

    // Listen for new messages
    socketRef.current.on('receive_message', (messageData) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m._id === messageData._id)) return prev;
        return [...prev, messageData];
      });
    });

    // Optionally: Listen for typing, etc.

    // Clean up on unmount or chat change
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_chat', selectedChat);
        socketRef.current.disconnect();
      }
    };
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const response = await getUserChats();
      if (response.success) {
        setChats(response.data);
      }
    } catch (error) {}
  };

  const getChatName = (chat) => {
    if (chat.type === 'team') return 'Team Chat';
    if (chat.type === 'group') return chat.name;
    const otherParticipant = chat.participants.find(p => p.user._id !== user?._id);
    return otherParticipant?.user.name || 'Chat';
  };

  const getChatBadge = (chatType) => {
    switch (chatType) {
      case 'team':
        return <Badge colorScheme="blue">Team</Badge>;
      case 'group':
        return <Badge colorScheme="green">Group</Badge>;
      case 'direct':
        return <Badge colorScheme="purple">Direct</Badge>;
      default:
        return null;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;
    try {
      const res = await sendMessage(selectedChat, message);
      setMessages(prev => [...prev, res.data]);
      setMessage('');
      // Emit the message through socket for real-time update
      if (socketRef.current) {
        socketRef.current.emit('send_message', {
          chatId: selectedChat,
          ...res.data
        });
      }
    } catch (err) {
      setError('Failed to send message');
    }
  };

  // WhatsApp-style layout
  return (
    <Flex h="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Sidebar (Chat List) */}
      <Box
        w={{ base: showSidebar ? '100vw' : '0', md: '320px' }}
        minW={{ md: '320px' }}
        maxW={{ md: '360px' }}
        bg={useColorModeValue('white', 'gray.800')}
        borderRightWidth={{ base: 0, md: '1px' }}
        boxShadow={{ md: 'lg' }}
        zIndex={showSidebar ? 20 : 1}
        position={{ base: 'fixed', md: 'relative' }}
        h="100vh"
        transition="width 0.2s"
        overflow="hidden"
        display={{ base: showSidebar ? 'block' : 'none', md: 'block' }}
      >
        <VStack align="stretch" spacing={0} h="100%">
          <HStack p={4} borderBottomWidth="1px" spacing={3} bg={useColorModeValue('gray.100', 'gray.700')}>
            {isMobile && (
              <IconButton icon={<CloseIcon />} size="sm" onClick={() => setShowSidebar(false)} aria-label="Close" />
            )}
            <Text fontWeight="bold" fontSize="lg">Chats</Text>
            <Button leftIcon={<AddIcon />} size="sm" ml="auto" variant="outline">New Group</Button>
          </HStack>
          <Box px={4} py={2} borderBottomWidth="1px">
            <Input placeholder="Search chats..." size="sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </Box>
          <VStack align="stretch" spacing={0} flex={1} overflowY="auto">
            {chats.map(chat => (
              <HStack
                key={chat._id}
                px={4}
                py={3}
                spacing={3}
                bg={selectedChat === chat._id ? useColorModeValue('blue.50', 'gray.700') : 'transparent'}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                cursor="pointer"
                onClick={() => {
                  setSelectedChat(chat._id);
                  setShowSidebar(false);
                  setMessages([]);
                }}
                borderBottomWidth="1px"
                borderColor={useColorModeValue('gray.100', 'gray.700')}
              >
                <Avatar size="sm" name={getChatName(chat)} src={chat.avatar} />
                <Box flex={1} minW={0}>
                  <Text fontWeight="medium" fontSize="md" isTruncated>{getChatName(chat)}</Text>
                  {chat.lastMessage && (
                    <Text fontSize="xs" color="gray.500" isTruncated>{chat.lastMessage.content}</Text>
                  )}
                </Box>
                {getChatBadge(chat.type)}
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* Main Chat Area */}
      <Flex flex={1} direction="column" h="100vh" position="relative">
        {/* Header */}
        <HStack spacing={3} p={4} borderBottomWidth="1px" bg={useColorModeValue('white', 'gray.800')} align="center">
          {isMobile && (
            <IconButton icon={<ArrowBackIcon />} size="sm" onClick={() => setShowSidebar(true)} aria-label="Back to chats" />
          )}
          {selectedChat ? (
            <>
              <Avatar size="md" name={getChatName(chats.find(c => c._id === selectedChat))} src={chats.find(c => c._id === selectedChat)?.avatar} />
              <Box flex={1} minW={0}>
                <Text fontWeight="bold" fontSize="lg" isTruncated>{getChatName(chats.find(c => c._id === selectedChat))}</Text>
                <Text fontSize="xs" color="gray.500" isTruncated>
                  {chats.find(c => c._id === selectedChat)?.participants?.map(p => p.user.name).join(', ')}
                </Text>
              </Box>
              {onDrawerClose && (
                <IconButton icon={<CloseIcon />} size="sm" onClick={onDrawerClose} aria-label="Close chat" />
              )}
            </>
          ) : (
            <Text fontWeight="bold" fontSize="lg">Select a chat</Text>
          )}
        </HStack>

        {/* Messages Feed */}
        <Box flex={1} overflowY="auto" px={{ base: 2, md: 8 }} py={4} bg={useColorModeValue('gray.50', 'gray.900')}>
          {selectedChat ? (
            loadingMessages ? (
              <Text color="gray.400" textAlign="center" mt={8}>Loading messages...</Text>
            ) : error ? (
              <Text color="red.400" textAlign="center" mt={8}>{error}</Text>
            ) : messages.length === 0 ? (
              <Text color="gray.400" textAlign="center" mt={8}>No messages yet. Say hello!</Text>
            ) : (
              <VStack spacing={3} align="stretch">
                {messages.map(msg => (
                  <Box
                    key={msg._id || msg.id}
                    alignSelf={msg.sender._id === user._id ? 'flex-end' : 'flex-start'}
                    bg={msg.sender._id === user._id ? 'blue.400' : useColorModeValue('white', 'gray.700')}
                    color={msg.sender._id === user._id ? 'white' : 'gray.900'}
                    px={4}
                    py={2}
                    borderRadius="2xl"
                    boxShadow="sm"
                    maxW="70%"
                  >
                    <Text fontSize="sm">{msg.content}</Text>
                    <Text fontSize="xs" color={msg.sender._id === user._id ? 'whiteAlpha.700' : 'gray.500'} textAlign="right" mt={1}>{new Date(msg.timestamp).toLocaleTimeString()}</Text>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </VStack>
            )
          ) : (
            <Flex h="100%" align="center" justify="center">
              <Text color="gray.400">Select a chat to start messaging</Text>
            </Flex>
          )}
        </Box>

        {/* Input Bar */}
        {selectedChat && (
          <Box px={{ base: 2, md: 8 }} py={3} bg={useColorModeValue('white', 'gray.800')} borderTopWidth="1px" position="sticky" bottom={0} zIndex={2}>
            <HStack spacing={2}>
              <IconButton icon={<BsEmojiSmile />} aria-label="Emoji" variant="ghost" />
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                borderRadius="2xl"
                bg={useColorModeValue('gray.100', 'gray.700')}
              />
              <IconButton icon={<AttachmentIcon />} aria-label="Attach" variant="ghost" />
              <Button colorScheme="blue" borderRadius="2xl" px={6} onClick={handleSendMessage}>
                Send
              </Button>
            </HStack>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default ChatWindow; 