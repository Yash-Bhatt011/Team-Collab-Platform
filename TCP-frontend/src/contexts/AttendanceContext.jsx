import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@chakra-ui/react";
import * as attendanceApi from "../services/api/attendanceApi";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const [attendanceStatus, setAttendanceStatus] = useState(() => {
    const savedStatus = localStorage.getItem("attendanceStatus");
    return savedStatus ? savedStatus : "out";
  });
  const [checkInTime, setCheckInTime] = useState(() => {
    const savedTime = localStorage.getItem("checkInTime");
    return savedTime ? new Date(savedTime) : null;
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initializationRef = useRef(false);
  const fetchRequestsRef = useRef(false);

  const fetchLeaveRequests = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (fetchRequestsRef.current) {
      return;
    }
    
    fetchRequestsRef.current = true;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing');
      }
      const response = await fetch('http://localhost:5000/api/leave', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch leave requests');
      }
      const data = await response.json();
      // Only log once during initialization
      if (!isInitialized) {
        console.log('Fetched leave requests:', data);
      }
      setLeaveRequests(data.data || []);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setLeaveRequests([]);
    } finally {
      fetchRequestsRef.current = false;
    }
  }, [isInitialized]);
  
  const checkIn = async (location) => {
    try {
      const response = await attendanceApi.checkIn(location);
      if (response.success) {
        setAttendanceStatus("in");
        localStorage.setItem("attendanceStatus", "in");
        setCheckInTime(new Date(response.data.checkIn.time));
        localStorage.setItem("checkInTime", response.data.checkIn.time);
        toast({
          title: "Checked In Successfully",
          status: "success",
        });
        await fetchAttendanceRecords();
        return true;
      } else {
        throw new Error(response.message || "Check-in failed");
      }
    } catch (error) {
      toast({
        title: "Check-in Failed",
        description: error.message,
        status: "error",
      });
      return false;
    }
  };

  const checkOut = async (location) => {
    try {
      const response = await attendanceApi.checkOut(location);
      if (response.success) {
        setAttendanceStatus("out");
        localStorage.removeItem("attendanceStatus");
        setCheckInTime(null);
        localStorage.removeItem("checkInTime");
        toast({
          title: "Checked Out Successfully",
          status: "success",
        });
        await fetchAttendanceRecords();
        return true;
      } else {
        throw new Error(response.message || "Check-out failed");
      }
    } catch (error) {
      toast({
        title: "Check-out Failed",
        description: error.message,
        status: "error",
      });
      return false;
    }
  };

  const submitLeaveRequest = async (request) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing');
      }
      
      // Convert date strings to Date objects for the backend
      const processedRequest = {
        ...request,
        startDate: new Date(request.startDate + 'T00:00:00'),
        endDate: new Date(request.endDate + 'T23:59:59'),
      };
      
      console.log('Submitting leave request:', processedRequest);
      
      const response = await fetch('http://localhost:5000/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(processedRequest),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to submit leave request');
      }
      
      const data = await response.json();
      console.log('Success response:', data);
      
      // Refresh leave requests from backend
      await fetchLeaveRequests();
      
      toast({
        title: "Leave Request Submitted",
        status: "success",
      });
      return true;
    } catch (error) {
      console.error('Error in submitLeaveRequest:', error);
      toast({
        title: "Submission Failed",
        description: error.message,
        status: "error",
      });
      return false;
    }
  };

  const fetchAttendanceRecords = useCallback(async () => {
    try {
      const response = await attendanceApi.getAttendance();
      if (response.success) {
        setAttendanceRecords(response.data || []);
      } else {
        throw new Error(response.message || "Failed to fetch attendance records");
      }
    } catch (error) {
      console.error("Failed to fetch attendance records:", error);
      setAttendanceRecords([]);
    }
  }, []);

  const getAllAttendanceRecords = async () => {
    await fetchAttendanceRecords();
    return attendanceRecords;
  };

  const getAllLeaveRequests = async () => {
    await fetchLeaveRequests();
    return leaveRequests;
  };

  const updateLeaveRequest = async (requestId, action) => {
    try {
      if (!requestId) {
        throw new Error('Request ID is required');
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing');
      }
      
      const response = await fetch(`http://localhost:5000/api/leave/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ 
          status: action,
          // Add additional fields that might be required
          updatedAt: new Date().toISOString()
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        // Handle specific error cases
        if (responseData.message && responseData.message.includes('already been processed')) {
          // This is not a real error - the request was already processed
          // Just refresh the data and return success
          await fetchLeaveRequests();
          return true;
        }
        
        throw new Error(responseData.message || 'Failed to update leave request');
      }
      
      // Refresh leave requests from backend
      await fetchLeaveRequests();
      
      return true;
    } catch (error) {
      console.error('Error in updateLeaveRequest:', error);
      
      // If it's the "already processed" error, handle it gracefully
      if (error.message.includes('already been processed')) {
        // Refresh data and return success since the request was already processed
        await fetchLeaveRequests();
        return true;
      }
      
      throw new Error("Failed to update leave request: " + error.message);
    }
  };

  const startBreak = async (type = 'personal') => {
    try {
      const response = await attendanceApi.startBreak(type);
      if (response.success) {
        await fetchAttendanceRecords();
        toast({
          title: "Break started",
          status: "success",
        });
        return true;
      } else {
        throw new Error(response.message || "Failed to start break");
      }
    } catch (error) {
      toast({
        title: "Failed to start break",
        description: error.message,
        status: "error",
      });
      return false;
    }
  };

  const endBreak = async () => {
    try {
      const response = await attendanceApi.endBreak();
      if (response.success) {
        await fetchAttendanceRecords();
        toast({
          title: "Break ended",
          status: "success",
        });
        return true;
      } else {
        throw new Error(response.message || "Failed to end break");
      }
    } catch (error) {
      toast({
        title: "Failed to end break",
        description: error.message,
        status: "error",
      });
      return false;
    }
  };

  // Get today's attendance record
  const getTodayAttendance = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return attendanceRecords.find(record => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    });
  };

  // Get today's breaks from attendance record
  const getTodayBreaks = () => {
    const todayRecord = getTodayAttendance();
    if (!todayRecord || !todayRecord.breaks) {
      return [];
    }
    
    return todayRecord.breaks.map(breakItem => ({
      start: new Date(breakItem.startTime).toLocaleTimeString(),
      end: breakItem.endTime ? new Date(breakItem.endTime).toLocaleTimeString() : '',
      duration: breakItem.duration || 0,
      type: breakItem.type,
      isOngoing: !breakItem.endTime
    }));
  };

  // Check if currently on break
  const isOnBreak = () => {
    const todayBreaks = getTodayBreaks();
    return todayBreaks.some(breakItem => breakItem.isOngoing);
  };

  // Only fetch data once when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && !isInitialized && !initializationRef.current) {
      initializationRef.current = true;
      setIsLoading(true);
      
      // Fetch data without showing loading spinner initially
      const initializeData = async () => {
        try {
          const [attendanceResponse, leaveResponse] = await Promise.all([
            attendanceApi.getAttendance(),
            fetch('http://localhost:5000/api/leave', {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              credentials: 'include',
            }).then(res => res.json())
          ]);
          
          if (attendanceResponse.success) {
            setAttendanceRecords(attendanceResponse.data || []);
          }
          
          if (leaveResponse.success) {
            setLeaveRequests(leaveResponse.data || []);
          }
          
          setIsInitialized(true);
        } catch (error) {
          console.error('Error initializing data:', error);
          setIsInitialized(true);
        } finally {
          setIsLoading(false);
        }
      };
      
      initializeData();
    }
  }, [isAuthenticated, user, isInitialized]);

  return (
    <AttendanceContext.Provider
      value={{
        attendanceStatus,
        checkInTime,
        leaveRequests,
        attendanceRecords,
        checkIn,
        checkOut,
        submitLeaveRequest,
        getAllAttendanceRecords,
        getAllLeaveRequests,
        updateLeaveRequest,
        startBreak,
        endBreak,
        getTodayBreaks,
        isOnBreak,
        getTodayAttendance,
        isInitialized,
        isLoading,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
