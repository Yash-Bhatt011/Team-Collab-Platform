import React from 'react';
import { Box, Container, VStack, Heading } from '@chakra-ui/react';
import ModernAttendanceManagement from '../components/ModernAttendanceManagement';

const AttendancePage = () => {
  return (
    <Box minH="100vh" pt="80px">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading size="lg">Attendance Management</Heading>
          <ModernAttendanceManagement />
        </VStack>
      </Container>
    </Box>
  );
};

export default AttendancePage;
