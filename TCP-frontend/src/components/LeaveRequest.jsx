import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const LeaveRequest = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/leave/request', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          status: 'pending'
        })
      });
      toast({
        title: "Leave Request Submitted",
        status: "success"
      });
      setFormData({ type: '', startDate: '', endDate: '', reason: '' });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.message,
        status: "error"
      });
    }
  };

  return (
    <Box p={6} borderRadius="lg" bg="whiteAlpha.100" backdropFilter="blur(8px)">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Leave Type</FormLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="">Select Type</option>
              <option value="sick">Sick Leave</option>
              <option value="vacation">Vacation</option>
              <option value="personal">Personal Leave</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Reason</FormLabel>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" w="100%">
            Submit Request
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default LeaveRequest;
