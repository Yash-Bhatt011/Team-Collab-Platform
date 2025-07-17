import React, { useState } from 'react';
import {
  Box,
  VStack,
  Grid,
  Heading,
  Text,
  Button,
  Icon,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { FiFile, FiDownload, FiShare2 } from 'react-icons/fi';
import { mockResources } from '../utils/mockData';

const ResourceLibrary = () => {
  const [resources] = useState(mockResources);

  return (
    <Box p={6} bg={useColorModeValue('white', 'gray.800')} borderRadius="xl" boxShadow="xl">
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Resource Library</Heading>
        
        <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
          {resources.map(resource => (
            <Box
              key={resource.id}
              p={5}
              bg="whiteAlpha.100"
              borderRadius="lg"
              borderWidth="1px"
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.2s"
            >
              <VStack align="start" spacing={3}>
                <Icon as={FiFile} boxSize={6} />
                <Heading size="md">{resource.title}</Heading>
                <Text color="gray.500">{resource.category}</Text>
                <Badge>{resource.type.toUpperCase()}</Badge>
                <Text fontSize="sm">Size: {resource.size}</Text>
                <Button leftIcon={<FiDownload />} size="sm" width="full">
                  Download
                </Button>
                <Button leftIcon={<FiShare2 />} size="sm" width="full" variant="ghost">
                  Share
                </Button>
              </VStack>
            </Box>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
};

export default ResourceLibrary;
