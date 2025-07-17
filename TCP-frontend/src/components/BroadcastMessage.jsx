import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useToast,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FiSend, FiTrash2, FiPlus, FiRadio } from 'react-icons/fi';
import { createBroadcast, getBroadcasts, deleteBroadcast } from '../services/api/notificationApi';
import { useAuth } from '../contexts/AuthContext';
import Popup from './ui/Popup';

const BroadcastMessage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    type: 'broadcast_general',
    priority: 'medium',
    broadcastTarget: 'all',
    department: '',
    actionRequired: false,
    actionUrl: '',
    expiresAt: '',
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <Box p={6} textAlign="center">
        <Text>Access denied. Only administrators can send broadcast messages.</Text>
      </Box>
    );
  }

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      const response = await getBroadcasts();
      setBroadcasts(response.data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!broadcastForm.title || !broadcastForm.message || !broadcastForm.type || !broadcastForm.broadcastTarget) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
      });
      return;
    }

    if (broadcastForm.broadcastTarget === 'department' && !broadcastForm.department) {
      toast({
        title: 'Error',
        description: 'Please select a department when targeting specific department',
        status: 'error',
      });
      return;
    }

    try {
      setSending(true);
      await createBroadcast(broadcastForm);
      
      toast({
        title: 'Success',
        description: 'Broadcast message sent successfully',
        status: 'success',
      });
      
      // Reset form and close modal
      setBroadcastForm({
        title: '',
        message: '',
        type: 'broadcast_general',
        priority: 'medium',
        broadcastTarget: 'all',
        department: '',
        actionRequired: false,
        actionUrl: '',
        expiresAt: '',
      });
      onClose();
      
      // Refresh broadcasts list
      fetchBroadcasts();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteBroadcast = async (broadcastId) => {
    if (!confirm('Are you sure you want to delete this broadcast?')) {
      return;
    }

    try {
      await deleteBroadcast(broadcastId);
      toast({
        title: 'Success',
        description: 'Broadcast deleted successfully',
        status: 'success',
      });
      fetchBroadcasts();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'broadcast_announcement': return 'Announcement';
      case 'broadcast_reminder': return 'Reminder';
      case 'broadcast_urgent': return 'Urgent';
      case 'broadcast_general': return 'General';
      default: return type;
    }
  };

  const getTargetLabel = (target, department) => {
    switch (target) {
      case 'all': return 'All Users';
      case 'employees': return 'Employees Only';
      case 'admins': return 'Admins Only';
      case 'department': return `Department: ${department}`;
      default: return target;
    }
  };

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <HStack>
            <FiRadio size={24} />
            <Text fontSize="2xl" fontWeight="bold">Broadcast Messages</Text>
          </HStack>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={onOpen}
          >
            Send Broadcast
          </Button>
        </HStack>

        {/* Broadcasts List */}
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Type</Th>
                <Th>Target</Th>
                <Th>Priority</Th>
                <Th>Sent By</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {broadcasts.map((broadcast) => (
                <Tr key={broadcast._id}>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{broadcast.title}</Text>
                      <Text fontSize="sm" color="gray.500" noOfLines={2}>
                        {broadcast.message}
                      </Text>
                    </VStack>
                  </Td>
                  <Td>
                    <Badge colorScheme="blue">
                      {getTypeLabel(broadcast.type)}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {getTargetLabel(broadcast.broadcastTarget, broadcast.department)}
                    </Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={getPriorityColor(broadcast.priority)}>
                      {broadcast.priority}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {broadcast.sender?.name || 'System'}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {new Date(broadcast.createdAt).toLocaleDateString()}
                    </Text>
                  </Td>
                  <Td>
                    <IconButton
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDeleteBroadcast(broadcast._id)}
                      aria-label="Delete broadcast"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          
          {broadcasts.length === 0 && !loading && (
            <Text textAlign="center" color="gray.500" py={8}>
              No broadcast messages sent yet.
            </Text>
          )}
        </Box>
      </VStack>

      {/* Send Broadcast Modal */}
      <Popup
        isOpen={isOpen}
        onClose={onClose}
        title="Send Broadcast Message"
      >
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              value={broadcastForm.title}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
              placeholder="Enter broadcast title"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea
              value={broadcastForm.message}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
              placeholder="Enter broadcast message"
              rows={4}
            />
          </FormControl>

          <HStack spacing={4} width="full">
            <FormControl isRequired>
              <FormLabel>Type</FormLabel>
              <Select
                value={broadcastForm.type}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
              >
                <option value="broadcast_general">General</option>
                <option value="broadcast_announcement">Announcement</option>
                <option value="broadcast_reminder">Reminder</option>
                <option value="broadcast_urgent">Urgent</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Priority</FormLabel>
              <Select
                value={broadcastForm.priority}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </FormControl>
          </HStack>

          <HStack spacing={4} width="full">
            <FormControl isRequired>
              <FormLabel>Target Audience</FormLabel>
              <Select
                value={broadcastForm.broadcastTarget}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, broadcastTarget: e.target.value })}
              >
                <option value="all">All Users</option>
                <option value="employees">Employees Only</option>
                <option value="admins">Admins Only</option>
                <option value="department">Specific Department</option>
              </Select>
            </FormControl>

            {broadcastForm.broadcastTarget === 'department' && (
              <FormControl isRequired>
                <FormLabel>Department</FormLabel>
                <Select
                  value={broadcastForm.department}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, department: e.target.value })}
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </Select>
              </FormControl>
            )}
          </HStack>

          <FormControl>
            <FormLabel>Action Required</FormLabel>
            <Switch
              isChecked={broadcastForm.actionRequired}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, actionRequired: e.target.checked })}
            />
          </FormControl>

          {broadcastForm.actionRequired && (
            <FormControl>
              <FormLabel>Action URL (Optional)</FormLabel>
              <Input
                value={broadcastForm.actionUrl}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, actionUrl: e.target.value })}
                placeholder="https://example.com/action"
              />
            </FormControl>
          )}

          <FormControl>
            <FormLabel>Expires At (Optional)</FormLabel>
            <Input
              type="datetime-local"
              value={broadcastForm.expiresAt}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, expiresAt: e.target.value })}
            />
          </FormControl>

          <HStack spacing={4} width="full">
            <Button
              onClick={handleSubmit}
              leftIcon={<FiSend />}
              colorScheme="blue"
              isLoading={sending}
              loadingText="Sending..."
              flex={1}
            >
              Send Broadcast
            </Button>
            <Button onClick={onClose} variant="outline" flex={1}>
              Cancel
            </Button>
          </HStack>
        </VStack>
      </Popup>
    </Box>
  );
};

export default BroadcastMessage; 