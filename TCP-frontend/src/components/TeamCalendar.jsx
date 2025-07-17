import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Grid,
  Text,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { mockCalendarEvents } from '../utils/mockData';

const TeamCalendar = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const getEventsForDay = (day) => {
    return mockCalendarEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === day;
    });
  };

  return (
    <Box p={6} bg={bgColor} borderRadius="xl" boxShadow="xl">
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Team Calendar</Heading>
        <Grid templateColumns="repeat(7, 1fr)" gap={2}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Box key={day} p={2} textAlign="center">
              <Text fontWeight="bold">{day}</Text>
            </Box>
          ))}
          {days.map(day => (
            <Box
              key={day}
              p={2}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
            >
              <Text>{day}</Text>
              {getEventsForDay(day).map(event => (
                <Badge
                  key={event.id}
                  colorScheme={event.type === 'meeting' ? 'blue' : 'red'}
                  mb={1}
                  display="block"
                >
                  {event.title}
                </Badge>
              ))}
            </Box>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
};

export default TeamCalendar;
