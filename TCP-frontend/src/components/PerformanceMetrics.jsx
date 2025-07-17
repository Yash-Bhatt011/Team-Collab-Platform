import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Grid,
  CircularProgress,
  CircularProgressLabel,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { mockPerformanceMetrics } from '../utils/mockData';

const PerformanceMetrics = ({ userId }) => {
  const userMetrics = mockPerformanceMetrics.find(m => m.userId === userId);
  
  const metrics = [
    { 
      label: 'Tasks Completed',
      value: userMetrics?.metrics.tasksCompleted || 0,
      max: 50,
      color: 'green'
    },
    {
      label: 'On-time Completion',
      value: userMetrics?.metrics.onTimeCompletion || 0,
      max: 100,
      color: 'blue'
    },
    {
      label: 'Collaboration Score',
      value: userMetrics?.metrics.collaborationScore || 0,
      max: 10,
      color: 'purple'
    }
  ];

  return (
    <Box p={6} bg={useColorModeValue('white', 'gray.800')} borderRadius="xl" boxShadow="xl">
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Performance Metrics</Heading>
        
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
          {metrics.map((metric, index) => (
            <VStack key={index} spacing={2}>
              <CircularProgress
                value={(metric.value / metric.max) * 100}
                size="120px"
                thickness="8px"
                color={`${metric.color}.400`}
              >
                <CircularProgressLabel>
                  {metric.value}
                  {metric.max === 100 ? '%' : ''}
                </CircularProgressLabel>
              </CircularProgress>
              <Text fontWeight="medium">{metric.label}</Text>
            </VStack>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
};

export default PerformanceMetrics;
