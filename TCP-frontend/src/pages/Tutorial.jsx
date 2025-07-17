import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  Container,
  Divider,
  UnorderedList,
  ListItem,
  Button,
  useColorModeValue,
  Collapse,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { FiLock, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { mockTasks } from '../utils/mockData';

const Tutorial = () => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const navigate = useNavigate();
  const toast = useToast();
  const [showNotes, setShowNotes] = useState(false);
  const [note, setNote] = useState('');

  const handleTryNotes = () => {
    setShowNotes(!showNotes);
  };

  const handleSaveNote = () => {
    if (note.trim()) {
      toast({
        title: 'Note saved successfully!',
        description: 'Try adding notes to actual tasks now',
        status: 'success',
        duration: 3000,
      });
      // Navigate to tasks page after showing success
      setTimeout(() => navigate('/employee/tasks'), 1500);
    }
  };

  const goToActivity = () => {
    navigate('/activity');
  };

  return (
    <Box pt={20}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <Heading>How to Use Features</Heading>

          {/* Private Notes Tutorial */}
          <Box p={6} bg={bgColor} borderRadius="lg" shadow="md">
            <VStack align="start" spacing={4}>
              <Heading size="md">Using Private Notes</Heading>
              <UnorderedList spacing={2}>
                <ListItem>
                  Look for the <FiLock /> lock icon on any task card
                </ListItem>
                <ListItem>
                  Click "Private Notes" button to open notes section
                </ListItem>
                <ListItem>
                  Add your personal notes - only you can see them
                </ListItem>
                <ListItem>
                  Click "Save Note" to store your notes
                </ListItem>
              </UnorderedList>
              
              <Button 
                leftIcon={<FiLock />} 
                size="sm"
                onClick={handleTryNotes}
                colorScheme="blue"
              >
                Try Private Notes
              </Button>

              <Collapse in={showNotes}>
                <Box w="100%" p={4} bg="gray.50" borderRadius="md">
                  <VStack spacing={3}>
                    <Text fontSize="sm">Example Task: {mockTasks[0].title}</Text>
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Type your private note here..."
                      size="sm"
                    />
                    <Button 
                      size="sm" 
                      colorScheme="green"
                      onClick={handleSaveNote}
                      isDisabled={!note.trim()}
                    >
                      Save Note
                    </Button>
                  </VStack>
                </Box>
              </Collapse>
            </VStack>
          </Box>

          <Divider />

          {/* Activity Timeline Tutorial */}
          <Box p={6} bg={bgColor} borderRadius="lg" shadow="md">
            <VStack align="start" spacing={4}>
              <Heading size="md">Using Activity Timeline</Heading>
              <UnorderedList spacing={2}>
                <ListItem>
                  Click the <FiActivity /> icon in the top navigation bar
                </ListItem>
                <ListItem>
                  View your daily activities and progress
                </ListItem>
                <ListItem>
                  See completed tasks, uploaded files, and comments
                </ListItem>
                <ListItem>
                  Track your productivity with activity summaries
                </ListItem>
              </UnorderedList>
              <Button 
                leftIcon={<FiActivity />} 
                size="sm"
                onClick={goToActivity}
                colorScheme="purple"
              >
                View Activity Timeline
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Tutorial;
