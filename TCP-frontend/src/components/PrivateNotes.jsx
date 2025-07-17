import React, { useState } from 'react';
import {
  Box,
  VStack,
  Textarea,
  Button,
  Text,
  useToast,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const PrivateNotes = ({ taskId, initialNote = '', onSave }) => {
  const [note, setNote] = useState(initialNote);
  const { user } = useAuth();
  const toast = useToast();

  const handleSave = () => {
    onSave(note);
    toast({
      title: 'Note saved',
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <Box>
      <VStack spacing={3} align="stretch">
        <HStack>
          <Icon as={FiLock} color="gray.500" />
          <Text fontSize="sm" color="gray.500">Private Note (Only visible to you)</Text>
        </HStack>
        
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add your private notes here..."
          size="sm"
          resize="vertical"
          minH="100px"
        />
        
        <Button
          size="sm"
          colorScheme="blue"
          onClick={handleSave}
          isDisabled={note === initialNote}
        >
          Save Note
        </Button>
      </VStack>
    </Box>
  );
};

export default PrivateNotes;
