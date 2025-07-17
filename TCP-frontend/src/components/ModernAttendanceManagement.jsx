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
  // Spinner,  // Removed Spinner import to eliminate spinner usage
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Input,
} from '@chakra-ui/react';
import { useAttendance } from '../contexts/AttendanceContext';
import Popup from './ui/Popup';

const ModernAttendanceManagement = () => {
  const {
    attendanceStatus,
    checkInTime,
    leaveRequests,
    checkIn,
    checkOut,
    // Remove loading from destructuring to avoid spinner usage
    // loading,
    submitLeaveRequest,
    startBreak,
    endBreak,
    attendanceRecords,
  } = useAttendance();
  const toast = useToast();

  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [todayBreaks, setTodayBreaks] = useState([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

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

  // Sync breaks from attendanceRecords
  useEffect(() => {
    if (attendanceRecords.length > 0) {
      const todayRecord = attendanceRecords.find(record => {
        const recordDate = new Date(record.date);
        const now = new Date();
        return recordDate.toDateString() === now.toDateString();
      });
      if (todayRecord && todayRecord.breaks) {
        setTodayBreaks(todayRecord.breaks.map(b => ({
          start: new Date(b.startTime).toLocaleTimeString(),
          end: b.endTime ? new Date(b.endTime).toLocaleTimeString() : '',
          duration: b.duration || 0,
        })));
        const ongoingBreak = todayRecord.breaks.find(b => !b.endTime);
        setIsOnBreak(!!ongoingBreak);
        setBreakStartTime(ongoingBreak ? new Date(ongoingBreak.startTime) : null);
      } else {
        setTodayBreaks([]);
        setIsOnBreak(false);
        setBreakStartTime(null);
      }
    }
  }, [attendanceRecords]);


  const handleCheckIn = async () => {
    try {
      const result = await checkIn('office');
      if (!result) throw new Error('Check-in failed');
      toast({ title: 'Checked in successfully', status: 'success' });
    } catch (error) {
      toast({ title: 'Check-in failed', description: error.message, status: 'error' });
    }
  };

  const handleCheckOut = async () => {
    try {
      const result = await checkOut('office');
      if (!result) throw new Error('Check-out failed');
      toast({ title: 'Checked out successfully', status: 'success' });
    } catch (error) {
      toast({ title: 'Check-out failed', description: error.message, status: 'error' });
    }
  };

  const handleBreakStart = async () => {
    const success = await startBreak('personal');
    if (success) {
      toast({ title: 'Break started', status: 'info' });
    }
  };

  const handleBreakEnd = async () => {
    const success = await endBreak();
    if (success) {
      toast({ title: 'Break ended', status: 'info' });
    }
  };

  const openLeaveModal = () => {
    setIsLeaveModalOpen(true);
  };

  const closeLeaveModal = () => {
    setIsLeaveModalOpen(false);
    setLeaveForm({
      type: '',
      startDate: '',
      endDate: '',
      reason: '',
    });
  };

  const handleLeaveSubmit = async () => {
    if (!leaveForm.type || !leaveForm.startDate || !leaveForm.endDate) {
      toast({ title: 'Please fill all required fields', status: 'warning' });
      return;
    }
    const request = {
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      reason: leaveForm.reason,
      status: 'pending',
      appliedOn: new Date().toISOString(),
    };
    const success = await submitLeaveRequest(request);
    if (success) {
      toast({ title: 'Leave request submitted', status: 'success' });
      closeLeaveModal();
    } else {
      toast({ title: 'Failed to submit leave request', status: 'error' });
    }
  };

  return (
    <Box p={6} borderRadius="lg" bg={useColorModeValue('white', 'gray.700')} boxShadow="md" maxW="900px" mx="auto">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">Attendance Management</Text>
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

        <Box>
          <HStack justify="space-between" mb={4}>
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
              {todayBreaks.map((brk, idx) => (
                <Tr key={idx}>
                  <Td>{brk.start}</Td>
                  <Td>{brk.end}</Td>
                  <Td>{brk.duration}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box>
          <HStack justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="bold">Leave Requests</Text>
            <Button colorScheme="blue" onClick={openLeaveModal}>Request Leave</Button>
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
        </Box>

        <Popup isOpen={isLeaveModalOpen} onClose={closeLeaveModal} title="Request Leave">
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Leave Type</FormLabel>
              <Select
                value={leaveForm.type}
                onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
              >
                <option value="vacation">Vacation</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal</option>
                <option value="emergency">Emergency</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                value={leaveForm.endDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
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
          </VStack>
          <Button colorScheme="blue" onClick={handleLeaveSubmit}>
            Submit
          </Button>
        </Popup>
      </VStack>
    </Box>
  );
};

export default ModernAttendanceManagement;
