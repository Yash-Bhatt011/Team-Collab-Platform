import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Select,
  Button,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  Text,
  Divider,
} from '@chakra-ui/react';

const AdminSettings = () => {
  const toast = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Team Collab Inc.',
    timezone: 'UTC',
    emailNotifications: true,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  });

  const [attendanceSettings, setAttendanceSettings] = useState({
    workHoursPerDay: '8',
    allowFlexibleHours: true,
    overtimeAllowed: true,
    minCheckInTime: '09:00',
    maxCheckOutTime: '18:00',
    defaultHourlyRate: '20',
  });

  const [leaveSettings, setLeaveSettings] = useState({
    annualLeaveAllowed: '20',
    sickLeaveAllowed: '10',
    unpaidLeaveAllowed: true,
    requireDocumentation: true,
    minAdvanceNotice: '7',
  });

  const handleSaveSettings = (type) => {
    // In a real app, this would save to backend
    toast({
      title: 'Settings Saved',
      description: `${type} settings have been updated successfully`,
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Box p={6}>
      <Heading mb={6}>Admin Settings</Heading>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>General</Tab>
          <Tab>Attendance</Tab>
          <Tab>Leave Policy</Tab>
          <Tab>Security</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>Company Name</FormLabel>
                <Input
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    companyName: e.target.value
                  })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Timezone</FormLabel>
                <Select
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    timezone: e.target.value
                  })}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                </Select>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Enable Email Notifications</FormLabel>
                <Switch
                  isChecked={generalSettings.emailNotifications}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    emailNotifications: e.target.checked
                  })}
                />
              </FormControl>

              <Button colorScheme="blue" onClick={() => handleSaveSettings('General')}>
                Save General Settings
              </Button>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>Working Hours Per Day</FormLabel>
                <Input
                  type="number"
                  value={attendanceSettings.workHoursPerDay}
                  onChange={(e) => setAttendanceSettings({
                    ...attendanceSettings,
                    workHoursPerDay: e.target.value
                  })}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Allow Flexible Hours</FormLabel>
                <Switch
                  isChecked={attendanceSettings.allowFlexibleHours}
                  onChange={(e) => setAttendanceSettings({
                    ...attendanceSettings,
                    allowFlexibleHours: e.target.checked
                  })}
                />
              </FormControl>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>Default Check-in Time</FormLabel>
                  <Input
                    type="time"
                    value={attendanceSettings.minCheckInTime}
                    onChange={(e) => setAttendanceSettings({
                      ...attendanceSettings,
                      minCheckInTime: e.target.value
                    })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Default Check-out Time</FormLabel>
                  <Input
                    type="time"
                    value={attendanceSettings.maxCheckOutTime}
                    onChange={(e) => setAttendanceSettings({
                      ...attendanceSettings,
                      maxCheckOutTime: e.target.value
                    })}
                  />
                </FormControl>
              </Grid>

              <Button colorScheme="blue" onClick={() => handleSaveSettings('Attendance')}>
                Save Attendance Settings
              </Button>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>Annual Leave Days</FormLabel>
                  <Input
                    type="number"
                    value={leaveSettings.annualLeaveAllowed}
                    onChange={(e) => setLeaveSettings({
                      ...leaveSettings,
                      annualLeaveAllowed: e.target.value
                    })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Sick Leave Days</FormLabel>
                  <Input
                    type="number"
                    value={leaveSettings.sickLeaveAllowed}
                    onChange={(e) => setLeaveSettings({
                      ...leaveSettings,
                      sickLeaveAllowed: e.target.value
                    })}
                  />
                </FormControl>
              </Grid>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Allow Unpaid Leave</FormLabel>
                <Switch
                  isChecked={leaveSettings.unpaidLeaveAllowed}
                  onChange={(e) => setLeaveSettings({
                    ...leaveSettings,
                    unpaidLeaveAllowed: e.target.checked
                  })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Minimum Advance Notice (Days)</FormLabel>
                <Input
                  type="number"
                  value={leaveSettings.minAdvanceNotice}
                  onChange={(e) => setLeaveSettings({
                    ...leaveSettings,
                    minAdvanceNotice: e.target.value
                  })}
                />
              </FormControl>

              <Button colorScheme="blue" onClick={() => handleSaveSettings('Leave Policy')}>
                Save Leave Settings
              </Button>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Text>Security settings and permissions will be configured here.</Text>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminSettings;
