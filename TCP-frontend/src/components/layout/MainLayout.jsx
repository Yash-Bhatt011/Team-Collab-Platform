import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Navbar from './Navigation';
import ChatWindow from '../ChatWindow';

const MainLayout = ({ children }) => {
  return (
    <Box minH="100vh">
      <Navbar />
      <Flex>
        <Box flex="1">
          {children}
        </Box>
        <Box 
          w="400px" 
          borderLeft="1px" 
          borderColor="gray.200" 
          h="calc(100vh - 64px)" // Adjust based on your navbar height
          position="fixed"
          right="0"
          top="64px" // Should match your navbar height
          overflowY="auto"
          bg="white"
          zIndex="1"
        >
          <ChatWindow />
        </Box>
      </Flex>
    </Box>
  );
};

export default MainLayout;
