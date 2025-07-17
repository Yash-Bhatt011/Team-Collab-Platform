import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  HStack,
  VStack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Divider,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import Popup from './ui/Popup';
import { useAttendance } from '../contexts/AttendanceContext';
import { AttendanceSalaryService } from '../services/AttendanceSalaryService';

const AdminAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLeaveActionModalOpen, setIsLeaveActionModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const toast = useToast();
  
  // Use the attendance context directly - let it throw if not available
  const { 
    getAllAttendanceRecords, 
    getAllLeaveRequests, 
    updateLeaveRequest
  } = useAttendance();

  const bgColor = useColorModeValue('white', 'gray.800');
  const tableBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const records = await getAllAttendanceRecords();
        setAttendanceData(records);
        const leaves = await getAllLeaveRequests();
        console.log('Leave requests data structure:', leaves);
        setLeaveRequests(leaves);
      } catch (error) {
        toast({
          title: 'Error loading data',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchData();
  }, []); // Remove function dependencies to prevent infinite re-renders

  const handleLeaveAction = async (requestId, action) => {
    if (isProcessingAction) {
      return; // Prevent duplicate actions
    }
    
    if (!updateLeaveRequest) {
      toast({
        title: 'Error',
        description: 'Attendance context not available',
        status: 'error',
      });
      return;
    }
    
    if (!requestId) {
      toast({
        title: 'Error',
        description: 'Invalid request ID',
        status: 'error',
      });
      return;
    }
    
    if (!selectedRequest) {
      toast({
        title: 'Error',
        description: 'No request selected',
        status: 'error',
      });
      return;
    }
    
    setIsProcessingAction(true);
    
    try {
      await updateLeaveRequest(requestId, action);
      
      // Update local state optimistically
      setLeaveRequests((requests) =>
        requests.map((req) =>
          (req.id === requestId || req._id === requestId) ? { ...req, status: action } : req
        )
      );
      
      toast({
        title: `Request ${action}`,
        status: 'success',
      });
      setIsLeaveActionModalOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      // Handle the "already processed" error gracefully
      if (error.message.includes('already been processed')) {
        toast({
          title: 'Request Updated',
          description: 'The request has already been processed. Refreshing data...',
          status: 'info',
        });
        
        // Refresh the data to get the current state
        try {
          const leaves = await getAllLeaveRequests();
          setLeaveRequests(leaves);
        } catch (refreshError) {
          console.error('Failed to refresh leave requests:', refreshError);
        }
      } else {
        toast({
          title: 'Action Failed',
          description: error.message,
          status: 'error',
        });
      }
      
      // Close the modal regardless of the error
      setIsLeaveActionModalOpen(false);
      setSelectedRequest(null);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const openLeaveActionModal = (request) => {
    // Validate the request object
    if (!request) {
      console.error('Request object is null or undefined');
      toast({
        title: 'Error',
        description: 'Invalid request data',
        status: 'error',
      });
      return;
    }
    
    // Check if the request has the essential fields for the modal
    // Since employee can be null, we only check for the fields we actually need
    const hasRequiredFields = (
      request.type &&
      request.startDate &&
      request.endDate &&
      request._id // Ensure we have an ID for the action
    );
    
    if (!hasRequiredFields) {
      console.error('Request missing required fields:', request);
      toast({
        title: 'Error',
        description: 'Request data is incomplete',
        status: 'error',
      });
      return;
    }
    
    setSelectedRequest(request);
    setIsLeaveActionModalOpen(true);
  };

  const closeLeaveActionModal = () => {
    setIsLeaveActionModalOpen(false);
    setSelectedRequest(null);
  };

  const calculateSalary = (employeeId) => {
    try {
      const employee = attendanceData.find((a) => a?.employeeId === employeeId);
      const salaryDetails = AttendanceSalaryService.calculateSalary(employee);
      return salaryDetails;
    } catch (error) {
      console.error('Error calculating salary:', error);
      return { total: '0.00', details: {} };
    }
  };

  return (
    <Box p={6} bg={bgColor} borderRadius="md" boxShadow="md">
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Attendance</Tab>
          <Tab>Leave Requests</Tab>
          <Tab>Salary Calculator</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Box overflowX="auto" bg={tableBg} borderRadius="md" p={4}>
              <Table variant="striped" colorScheme="blue" size="sm">
                <Thead>
                  <Tr>
                    <Th>Employee</Th>
                    <Th>Status</Th>
                    <Th>Check In</Th>
                    <Th>Check Out</Th>
                    <Th>Total Hours</Th>
                    <Th>Break Time</Th>
                    <Th>Net Hours</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {attendanceData.map((record, index) => (
                    <Tr key={record.id || record._id || `attendance-${index}`} _hover={{ bg: 'blue.100', cursor: 'pointer' }}>
                      <Td>{record.employeeName}</Td>
                      <Td>
                        <Badge colorScheme={record.status === 'in' ? 'green' : 'red'}>
                          {record.status}
                        </Badge>
                      </Td>
                      <Td>
                        {typeof record.checkIn === 'object' && record.checkIn !== null
                          ? new Date(record.checkIn.time).toLocaleTimeString()
                          : record.checkIn}
                      </Td>
                      <Td>
                        {typeof record.checkOut === 'object' && record.checkOut !== null
                          ? new Date(record.checkOut.time).toLocaleTimeString()
                          : record.checkOut}
                      </Td>
                      <Td>{record.totalHours}</Td>
                      <Td>{record.totalBreakTime || 0} mins</Td>
                      <Td>{(record.totalHours - (record.totalBreakTime || 0) / 60).toFixed(2)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          <TabPanel p={0}>
            <Box overflowX="auto" bg={tableBg} borderRadius="md" p={4}>
              <Table variant="striped" colorScheme="blue" size="sm">
                <Thead>
                  <Tr>
                    <Th>Employee</Th>
                    <Th>Type</Th>
                    <Th>Duration</Th>
                    <Th>Action/Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {leaveRequests.map((request, index) => (
                    <Tr key={request.id || request._id || `leave-${index}`} _hover={{ bg: 'blue.100', cursor: 'pointer' }}>
                      <Td>{request.employeeName || request.employee?.name || request.employee || 'Unknown Employee'}</Td>
                      <Td>{request.type}</Td>
                      <Td>{`${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate).toLocaleDateString()}`}</Td>
                      <Td>
                        {request.status === 'pending' ? (
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => openLeaveActionModal(request)}
                          >
                            Take Action
                          </Button>
                        ) : (
                          <Badge
                            colorScheme={
                              request.status === 'approved'
                                ? 'green'
                                : request.status === 'rejected'
                                ? 'red'
                                : 'gray'
                            }
                          >
                            {request.status}
                          </Badge>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          <TabPanel p={0}>
            <VStack spacing={6} p={4}>
              <Table variant="striped" colorScheme="blue" size="sm">
                <Thead>
                  <Tr>
                    <Th>Employee</Th>
                    <Th>Regular Hours</Th>
                    <Th>Overtime Hours</Th>
                    <Th>Gross Pay</Th>
                    <Th>Deductions</Th>
                    <Th>Net Pay</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {attendanceData.map((employee, index) => {
                    const salary = calculateSalary(employee.employeeId);
                    return (
                      <Tr key={employee.id || employee._id || `salary-${index}`} cursor="pointer" _hover={{ bg: 'blue.100' }}>
                        <Td>{employee.employeeName}</Td>
                        <Td>{salary.details.regularHours}</Td>
                        <Td>{salary.details.overtimeHours}</Td>
                        <Td>${salary.details.grossPay}</Td>
                        <Td>
                          $
                          {(Number(salary.details.taxes) + Number(salary.details.leaveDeductions)).toFixed(
                            2
                          )}
                        </Td>
                        <Td>${salary.details.netPay}</Td>
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => setSelectedEmployee(employee)}
                          >
                            View Details
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>

              <Popup
                isOpen={!!selectedEmployee}
                onClose={() => setSelectedEmployee(null)}
                title={`Salary Details - ${selectedEmployee?.employeeName}`}
              >
                {selectedEmployee && (
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text fontWeight="bold">Hourly Rate:</Text>
                      <Text>${selectedEmployee.hourlyRate}/hour</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Hours Worked:</Text>
                      <Text>
                        Regular: {calculateSalary(selectedEmployee.employeeId).details.regularHours}{' '}
                        hours
                      </Text>
                      <Text>
                        Overtime: {calculateSalary(selectedEmployee.employeeId).details.overtimeHours}{' '}
                        hours
                      </Text>
                    </Box>
                    <Divider />
                    <Box>
                      <Text fontWeight="bold">Earnings:</Text>
                      <Text>
                        Regular Pay: ${calculateSalary(selectedEmployee.employeeId).details.regularPay}
                      </Text>
                      <Text>
                        Overtime Pay: ${calculateSalary(selectedEmployee.employeeId).details.overtimePay}
                      </Text>
                      <Text>Gross Pay: ${calculateSalary(selectedEmployee.employeeId).details.grossPay}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Deductions:</Text>
                      <Text>Taxes (20%): ${calculateSalary(selectedEmployee.employeeId).details.taxes}</Text>
                      <Text>Leave Deductions: ${calculateSalary(selectedEmployee.employeeId).details.leaveDeductions}</Text>
                    </Box>
                    <Divider />
                    <Box>
                      <Text fontWeight="bold" fontSize="lg">
                        Net Pay: ${calculateSalary(selectedEmployee.employeeId).details.netPay}
                      </Text>
                    </Box>
                  </VStack>
                )}
              </Popup>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Leave Action Modal - moved outside tabs */}
      <Popup
        isOpen={isLeaveActionModalOpen}
        onClose={closeLeaveActionModal}
        title="Take Action on Leave Request"
      >
        {selectedRequest ? (
          <VStack spacing={4}>
            <Text>
              Request from: <Text as="span" fontWeight="bold">
                {selectedRequest.employeeName || selectedRequest.employee?.name || selectedRequest.employee || 'Employee ID: ' + (selectedRequest.employeeId || 'Unknown')}
              </Text>
            </Text>
            <Text>
              Type: <Text as="span" fontWeight="bold">{selectedRequest.type}</Text>
            </Text>
            <Text>
              Duration:{' '}
              <Text as="span" fontWeight="bold">{`${new Date(selectedRequest.startDate).toLocaleDateString()} - ${new Date(selectedRequest.endDate).toLocaleDateString()}`}</Text>
            </Text>
            <Text>
              Reason: <Text as="span" fontWeight="bold">{selectedRequest.reason || 'No reason provided'}</Text>
            </Text>
            <Text>
              Status: <Text as="span" fontWeight="bold">{selectedRequest.status || 'pending'}</Text>
            </Text>

            <HStack spacing={4} pt={4}>
              <Button
                colorScheme="green"
                isLoading={isProcessingAction}
                loadingText="Approving..."
                isDisabled={isProcessingAction}
                onClick={(e) => {
                  e.stopPropagation();
                  const requestId = selectedRequest.id || selectedRequest._id;
                  console.log('Approving request with ID:', requestId);
                  handleLeaveAction(requestId, 'approved');
                }}
              >
                Approve
              </Button>
              <Button
                colorScheme="red"
                isLoading={isProcessingAction}
                loadingText="Rejecting..."
                isDisabled={isProcessingAction}
                onClick={(e) => {
                  e.stopPropagation();
                  const requestId = selectedRequest.id || selectedRequest._id;
                  console.log('Rejecting request with ID:', requestId);
                  handleLeaveAction(requestId, 'rejected');
                }}
              >
                Reject
              </Button>
            </HStack>
          </VStack>
        ) : (
          <Text>No request selected</Text>
        )}
      </Popup>
    </Box>
  );
};

export default AdminAttendance;
