import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useColorModeValue,
  Textarea,
  Input,
  useToast,
} from '@chakra-ui/react';
import { FiSave, FiDownload, FiShare } from 'react-icons/fi';

const DocumentEditor = () => {
  const [document, setDocument] = useState({
    title: '',
    content: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSave = () => {
    if (!document.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a document title',
        status: 'error',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Document saved successfully',
      status: 'success',
    });
    setIsEditing(false);
  };

  const handleDownload = () => {
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title || 'document'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    toast({
      title: 'Share',
      description: 'Share functionality coming soon',
      status: 'info',
    });
  };

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">Document Editor</Text>
          <HStack spacing={2}>
            {!isEditing && (
              <Button
                leftIcon={<FiSave />}
                colorScheme="blue"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
            <Button
              leftIcon={<FiDownload />}
              variant="outline"
              onClick={handleDownload}
              isDisabled={!document.content}
            >
              Download
            </Button>
            <Button
              leftIcon={<FiShare />}
              variant="outline"
              onClick={handleShare}
            >
              Share
            </Button>
          </HStack>
        </HStack>

        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Document title"
            value={document.title}
            onChange={(e) => setDocument({ ...document, title: e.target.value })}
            isReadOnly={!isEditing}
            bg={isEditing ? 'white' : 'gray.50'}
          />

          <Textarea
            placeholder="Start writing your document..."
            value={document.content}
            onChange={(e) => setDocument({ ...document, content: e.target.value })}
            minH="400px"
            isReadOnly={!isEditing}
            bg={isEditing ? 'white' : 'gray.50'}
            resize="vertical"
          />

          {isEditing && (
            <HStack justify="flex-end" spacing={2}>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                leftIcon={<FiSave />}
                colorScheme="blue"
                onClick={handleSave}
              >
                Save
              </Button>
            </HStack>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default DocumentEditor;
