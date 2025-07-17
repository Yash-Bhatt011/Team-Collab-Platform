import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  Badge,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { useAttendance } from '../contexts/AttendanceContext';

const NewAttendanceManagement = () => {
  const {
    attendanceStatus,
    checkInTime,
    leaveRequests,
    checkIn,
    checkOut,
    loading,
  } = useAttendance();
  const toast = useToast();

  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [todayBreaks, setTodayBreaks] = useState([]);

  // Calculate today's working hours
  const todayHours = checkInTime && attendanceStatus === 'in'
    ? (new Date() - new Date(checkInTime)) / (1000 * 60 * 60)
    : 0;
  const safeTodayHours = isNaN(todayHours) ? 0 : todayHours;

  useEffect(() => {
    if (attendanceStatus === 'out') {
      setIsOnBreak(false);
      setBreakStartTime(null);
      setTodayBreaks([]);
    }
  }, [attendanceStatus]);

  const handleCheckIn = async () => {
    try {
      const result = await checkIn('office');
      if (!result) {
        throw new Error('Check-in failed');
      }
    } catch (error) {
      toast({
        title: 'Check-in failed',
        description: error.message,
        status: 'error',
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      const result = await checkOut('office');
      if (!result) {
        throw new Error('Check-out failed');
      }
    } catch (error) {
      toast({
        title: 'Check-out failed',
        description: error.message,
        status: 'error',
      });
    }
  };

  const handleBreakStart = () => {
    setIsOnBreak(true);
    setBreakStartTime(new Date());
    toast({
      title: 'Break Started',
      status: 'info',
    });
  };

  const handleBreakEnd = () => {
    if (!breakStartTime) return;
    const endTime = new Date();
    const breakDuration = Math.round((endTime - breakStartTime) / (1000 * 60)); // minutes
    const newBreak = {
      start: breakStartTime.toLocaleTimeString(),
      end: endTime.toLocaleTimeString(),
      duration: breakDuration,
    };
    setTodayBreaks([...todayBreaks, newBreak]);
    setIsOnBreak(false);
    setBreakStartTime(null);
    toast({
      title: 'Break Ended',
      description: `Duration: ${breakDuration} minutes`,
      status: 'info',
    });
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100%">
        <Text>Loading attendance data...</Text>
      </Flex>
    );
  }

  return (
    <Box p={6} borderRadius="lg" bg={useColorModeValue('whiteAlpha.900', 'gray.700')} boxShadow="md">
      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>Attendance</Tab>
          <Tab>Breaks</Tab>
          <Tab>Leave Requests</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <VStack spacing={6}>
              <HStack justify="space-between" w="100%">
                <Text fontSize="xl" fontWeight="bold">Attendance Tracker</Text>
                <Badge colorScheme={attendanceStatus === 'in' ? 'green' : 'red'}>
                  {attendanceStatus === 'in' ? 'Checked In' : 'Checked Out'}
                </Badge>
              </HStack>

              <Stat>
                <StatLabel>Today's Working Hours</StatLabel>
                <StatNumber>{safeTodayHours.toFixed(2)} hrs</StatNumber>
                <StatHelpText>
                  {checkInTime ? `Checked in at ${new Date(checkInTime).toLocaleTimeString()}` : 'Not checked in'}
                </StatHelpText>
              </Stat>

              <Button
                colorScheme={attendanceStatus === 'in' ? 'red' : 'green'}
                onClick={attendanceStatus === 'in' ? handleCheckOut : handleCheckIn}
                size="lg"
                w="100%"
              >
                {attendanceStatus === 'in' ? 'Check Out' : 'Check In'}
              </Button>

              {attendanceStatus === 'in' && (
                <Button
                  colorScheme={isOnBreak ? 'orange' : 'yellow'}
                  onClick={isOnBreak ? handleBreakEnd : handleBreakStart}
                  size="lg"
                  w="100%"
                >
                  {isOnBreak ? 'End Break' : 'Start Break'}
                </Button>
              )}
            </VStack>
          </TabPanel>

          <TabPanel p={0}>
            <VStack spacing={4}>
              <HStack justify="space-between" w="100%">
                <Text fontSize="xl" fontWeight="bold">Today's Breaks</Text>
                <Text>Total Break Time: {todayBreaks.reduce((acc, brk) => acc + brk.duration, 0)} minutes</Text>
              </HStack>

              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Start Time</Th>
                    <Th>End Time</Th>
                    <Th>Duration (mins)</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {todayBreaks.map((brk, index) => (
                    <Tr key={index}>
                      <Td>{brk.start}</Td>
                      <Td>{brk.end}</Td>
                      <Td>{brk.duration}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </TabPanel>

          <TabPanel p={0}>
            <VStack spacing={4}>
              <HStack justify="space-between" w="100%">
                <Text fontSize="xl" fontWeight="bold">Leave Requests</Text>
                <Button colorScheme="blue" size="sm">Request Leave</Button>
              </HStack>

              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Type</Th>
                    <Th>Duration</Th>
                    <Th>Status</Th>
                    <Th>Applied On</Th>
                    <Th>Reason</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {leaveRequests.map((request) => (
                    <Tr key={request.id}>
                      <Td>{request.type}</Td>
                      <Td>{`${request.startDate} - ${request.endDate}`}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            request.status === 'approved'
                              ? 'green'
                              : request.status === 'rejected'
                              ? 'red'
                              : 'yellow'
                          }
                        >
                          {request.status}
                        </Badge>
                      </Td>
                      <Td>{new Date(request.appliedOn).toLocaleDateString()}</Td>
                      <Td>{request.reason}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default NewAttendanceManagement;
