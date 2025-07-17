import React, { useState } from 'react';
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
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { useAttendance } from '../contexts/AttendanceContext';
import Popup from './ui/Popup';

const AttendanceTracker = () => {
  const {
    attendanceStatus,
    checkInTime,
    leaveRequests,
    checkIn,
    checkOut,
    startBreak,
    endBreak,
    submitLeaveRequest,
    getTodayBreaks,
    isOnBreak,
  } = useAttendance();
  const toast = useToast();

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Calculate values directly without useMemo
  const todayHours = checkInTime && attendanceStatus === 'in'
    ? (new Date() - new Date(checkInTime)) / (1000 * 60 * 60)
    : 0;
  const safeTodayHours = isNaN(todayHours) ? 0 : todayHours;
  
  const todayBreaks = getTodayBreaks();
  const currentlyOnBreak = isOnBreak();

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
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/attendance/check-out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ location: 'office' }),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Check-out failed');
    }
  } catch (error) {
    toast({
      title: 'Check-out failed',
      description: error.message,
      status: 'error',
    });
  }
};

const handleBreakStart = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/attendance/break/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ type: 'personal' }),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to start break');
    }
  } catch (error) {
    toast({
      title: 'Failed to start break',
      description: error.message,
      status: 'error',
    });
  }
};

  const handleBreakEnd = async () => {
    try {
      const result = await endBreak();
      if (!result) {
        throw new Error('Failed to end break');
      }
    } catch (error) {
      toast({
        title: 'Failed to end break',
        description: error.message,
        status: 'error',
      });
    }
  };

  const handleLeaveSubmit = async () => {
    if (!leaveForm.type || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
      });
      return;
    }

    // Validate that end date is not before start date
    if (new Date(leaveForm.endDate) < new Date(leaveForm.startDate)) {
      toast({
        title: 'Error',
        description: 'End date cannot be before start date',
        status: 'error',
      });
      return;
    }

    try {
      const result = await submitLeaveRequest(leaveForm);
      if (result) {
        setIsLeaveModalOpen(false);
        setLeaveForm({
          type: 'vacation',
          startDate: '',
          endDate: '',
          reason: '',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to submit leave request',
        description: error.message,
        status: 'error',
      });
    }
  };

  return (
    <Box p={6} borderRadius="lg" bg={useColorModeValue('whiteAlpha.900', 'gray.700')} boxShadow="md">
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Attendance</Tab>
          <Tab>Breaks</Tab>
          <Tab>Leave Requests</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <VStack spacing={6}>
              <HStack justify="space-between" w="100%">
                <Text fontSize="xl" fontWeight="bold">
                  Attendance Tracker
                </Text>
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
                disabled={attendanceStatus !== 'in'}
              >
                {attendanceStatus === 'in' ? 'Check Out' : 'Check In'}
              </Button>

              {attendanceStatus === 'in' && (
                <Button
                  colorScheme={currentlyOnBreak ? 'orange' : 'yellow'}
                  onClick={currentlyOnBreak ? handleBreakEnd : handleBreakStart}
                  size="lg"
                  w="100%"
                >
                  {currentlyOnBreak ? 'End Break' : 'Start Break'}
                </Button>
              )}
            </VStack>
          </TabPanel>

          <TabPanel p={0}>
            <VStack spacing={4}>
              <HStack justify="space-between" w="100%">
                <Text fontSize="xl" fontWeight="bold">
                  Today's Breaks
                </Text>
                <Text>
                  Total Break Time: {todayBreaks.reduce((acc, brk) => acc + (brk.duration || 0), 0)} minutes
                </Text>
              </HStack>

              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Start Time</Th>
                    <Th>End Time</Th>
                    <Th>Duration (mins)</Th>
                    <Th>Type</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {todayBreaks.length > 0 ? (
                    todayBreaks.map((brk, index) => (
                      <Tr key={index}>
                        <Td>{brk.start}</Td>
                        <Td>{brk.end || 'Ongoing'}</Td>
                        <Td>{brk.duration || 0}</Td>
                        <Td>{brk.type}</Td>
                        <Td>
                          <Badge colorScheme={brk.isOngoing ? 'yellow' : 'green'}>
                            {brk.isOngoing ? 'Ongoing' : 'Completed'}
                          </Badge>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={5} textAlign="center">No breaks recorded today</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </VStack>
          </TabPanel>

          <TabPanel p={0}>
            <VStack spacing={4}>
              <HStack justify="space-between" w="100%">
                <Text fontSize="xl" fontWeight="bold">
                  Leave Requests
                </Text>
                <Button colorScheme="blue" size="sm" onClick={() => setIsLeaveModalOpen(true)}>
                  Request Leave
                </Button>
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
                  {leaveRequests.length > 0 ? (
                    leaveRequests.map((request) => (
                      <Tr key={request._id || request.id}>
                        <Td>{request.type}</Td>
                        <Td>{`${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate).toLocaleDateString()}`}</Td>
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
                        <Td>{new Date(request.createdAt || request.appliedOn).toLocaleDateString()}</Td>
                        <Td>{request.reason}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={5} textAlign="center">No leave requests found</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Leave Request Modal */}
      <Popup 
        isOpen={isLeaveModalOpen} 
        onClose={() => setIsLeaveModalOpen(false)}
        title="Request Leave"
      >
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Leave Type</FormLabel>
            <Select
              value={leaveForm.type}
              onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
            >
              <option value="vacation">Vacation Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal Leave</option>
              <option value="emergency">Emergency Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="paternity">Paternity Leave</option>
              <option value="bereavement">Bereavement Leave</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              value={leaveForm.startDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              value={leaveForm.endDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
              min={leaveForm.startDate || new Date().toISOString().split('T')[0]}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Reason</FormLabel>
            <Textarea
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              placeholder="Please provide a reason for your leave request"
            />
          </FormControl>

          <Button colorScheme="blue" onClick={handleLeaveSubmit} width="full">
            Submit Request
          </Button>
        </VStack>
      </Popup>
    </Box>
  );
};

export default AttendanceTracker;
