import React, { useState } from 'react';
import {
  Box,
  Input,
  VStack,
  HStack,
  Text,
  Avatar,
  Button,
  useToast,
  Divider,
  Badge,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, CheckIcon } from '@chakra-ui/icons';
import { searchUsers } from '../services/api/userApi';
import { createChat } from '../services/api/chatApi';

const UserSearch = ({ onChatCreated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await searchUsers(query);
      if (response.success) {
        setSearchResults(response.data);
      } else {
        toast({
          title: 'Search failed',
          description: response.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to search users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = async (user) => {
    try {
      setIsLoading(true);
      const response = await createChat({
        type: 'direct',
        participants: [user._id],
        name: `Chat with ${user.name}`
      });

      if (response.success) {
        toast({
          title: 'Success',
          description: `Started chat with ${user.name}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        if (onChatCreated) {
          onChatCreated(response.data);
        }
        setSearchQuery('');
        setSearchResults([]);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to start chat',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
          leftIcon={<SearchIcon />}
          variant="outline"
          size="sm"
          width="full"
        >
          Find Employees
        </Button>
      </PopoverTrigger>
      <PopoverContent width="300px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Search Employees</PopoverHeader>
        <PopoverBody>
          <VStack spacing={3} align="stretch">
            <Input
              placeholder="Type name or email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              size="sm"
            />
            {searchResults.length > 0 ? (
              <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
                {searchResults.map((user) => (
                  <HStack
                    key={user._id}
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: 'gray.50' }}
                    justify="space-between"
                  >
                    <HStack>
                      <Avatar size="sm" name={user.name} src={user.avatar} />
                      <Box>
                        <Text fontSize="sm" fontWeight="medium">
                          {user.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {user.email}
                        </Text>
                      </Box>
                    </HStack>
                    <IconButton
                      icon={<AddIcon />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => startChat(user)}
                      isLoading={isLoading}
                      aria-label="Start chat"
                    />
                  </HStack>
                ))}
              </VStack>
            ) : searchQuery.length > 0 && !isLoading ? (
              <Text fontSize="sm" color="gray.500" textAlign="center">
                No employees found
              </Text>
            ) : null}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default UserSearch; 