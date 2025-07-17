import React, { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  useToast,
  Heading,
  Select,
} from '@chakra-ui/react';
import { useAttendance } from '../../contexts/AttendanceContext';

const AttendanceSettings = () => {
  const toast = useToast();
  const [settings, setSettings] = useState({
    workHours: '8',
    allowFlexibleHours: true,
    overtimeEnabled: true,
    minCheckInTime: '09:00',
    maxCheckOutTime: '18:00',
    defaultHourlyRate: '20',
  });

  const handleSave = () => {
    // Save settings - replace with actual API call
    toast({
      title: "Settings Saved",
      status: "success",
      duration: 3000,
    });
  };

  return (
    <Box p={6} borderRadius="lg" bg="whiteAlpha.100" backdropFilter="blur(8px)">
      <VStack spacing={6} align="stretch">
        <Heading size="md">Attendance Settings</Heading>
        
        <FormControl>
          <FormLabel>Working Hours Per Day</FormLabel>
          <Input
            type="number"
            value={settings.workHours}
            onChange={(e) => setSettings({...settings, workHours: e.target.value})}
          />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Allow Flexible Hours</FormLabel>
          <Switch
            isChecked={settings.allowFlexibleHours}
            onChange={(e) => setSettings({...settings, allowFlexibleHours: e.target.checked})}
          />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Enable Overtime</FormLabel>
          <Switch
            isChecked={settings.overtimeEnabled}
            onChange={(e) => setSettings({...settings, overtimeEnabled: e.target.checked})}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Default Check-in Time</FormLabel>
          <Input
            type="time"
            value={settings.minCheckInTime}
            onChange={(e) => setSettings({...settings, minCheckInTime: e.target.value})}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Default Check-out Time</FormLabel>
          <Input
            type="time"
            value={settings.maxCheckOutTime}
            onChange={(e) => setSettings({...settings, maxCheckOutTime: e.target.value})}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Default Hourly Rate ($)</FormLabel>
          <Input
            type="number"
            value={settings.defaultHourlyRate}
            onChange={(e) => setSettings({...settings, defaultHourlyRate: e.target.value})}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleSave}>
          Save Settings
        </Button>
      </VStack>
    </Box>
  );
};

export default AttendanceSettings;
