import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Select,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
} from '@chakra-ui/react';
import Button from './ui/Button';
import { BiPlay, BiPause, BiStop } from 'react-icons/bi';
import { mockTasks, mockTimeEntries } from '../utils/mockData';

const TimeTracker = () => {
  const [selectedTask, setSelectedTask] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [time, setTime] = useState(0);
  const [timeEntries, setTimeEntries] = useState(mockTimeEntries);

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsTracking(true);
  const handlePause = () => setIsTracking(false);
  const handleStop = () => {
    setIsTracking(false);
    if (selectedTask && time > 0) {
      const newEntry = {
        id: Date.now(),
        taskId: parseInt(selectedTask),
        duration: time / 3600, // Convert to hours
        date: new Date().toISOString().split('T')[0],
      };
      setTimeEntries([...timeEntries, newEntry]);
    }
    setTime(0);
  };

  return (
    <Box p={6} bg={useColorModeValue('white', 'gray.800')} borderRadius="xl" boxShadow="xl">
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Time Tracker</Text>
        
        <Select
          placeholder="Select task"
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
        >
          {mockTasks.map(task => (
            <option key={task.id} value={task.id}>{task.title}</option>
          ))}
        </Select>

        <Text fontSize="4xl" fontFamily="mono" textAlign="center">
          {formatTime(time)}
        </Text>

        <HStack spacing={4} justify="center">
          <Button
            leftIcon={<BiPlay />}
            colorScheme="green"
            onClick={handleStart}
            isDisabled={!selectedTask || isTracking}
          >
            Start
          </Button>
          <Button
            leftIcon={<BiPause />}
            colorScheme="yellow"
            onClick={handlePause}
            isDisabled={!isTracking}
          >
            Pause
          </Button>
          <Button
            leftIcon={<BiStop />}
            colorScheme="red"
            onClick={handleStop}
            isDisabled={!time}
          >
            Stop
          </Button>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Task</Th>
              <Th>Duration (hrs)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {timeEntries.map(entry => (
              <Tr key={entry.id}>
                <Td>{entry.date}</Td>
                <Td>{mockTasks.find(t => t.id === entry.taskId)?.title}</Td>
                <Td>{entry.duration.toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
};

export default TimeTracker;
