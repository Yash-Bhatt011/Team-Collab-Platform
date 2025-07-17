import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  SimpleGrid,
  Heading,
  Text,
  Button,
  Badge,
  HStack,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  CircularProgress,
  CircularProgressLabel,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Progress,
  Textarea,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tooltip,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Flex,
  Avatar,
  Divider,
  Spacer,
  Input,
} from '@chakra-ui/react';

import { FiCheckCircle, FiTrendingUp, FiClock, FiFlag, FiPlus, FiMoreVertical, FiMessageSquare, FiPaperclip } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import AttendanceTracker from './AttendanceTracker';
import LeaveRequest from './LeaveRequest';
import { useAttendance } from '../contexts/AttendanceContext';
import Calendar from './Calendar';
import Popup from './ui/Popup';
import ChatWindow from './ChatWindow';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { leaveRequests } = useAttendance();

  const [userTasks, setUserTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [activeTask, setActiveTask] = useState(null);
  const [taskProgress, setTaskProgress] = useState('');
  const [taskComments, setTaskComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const {
    isOpen: isTaskModalOpen,
    onOpen: onTaskModalOpen,
    onClose: onTaskModalClose,
  } = useDisclosure();

  const {
    isOpen: isStatusModalOpen,
    onOpen: onStatusModalOpen,
    onClose: onStatusModalClose,
  } = useDisclosure();

  const {
    isOpen: isViewTasksModalOpen,
    onOpen: onViewTasksModalOpen,
    onClose: onViewTasksModalClose,
  } = useDisclosure();

  const {
    isOpen: isTaskDrawerOpen,
    onOpen: onTaskDrawerOpen,
    onClose: onTaskDrawerClose,
  } = useDisclosure();

  const chatDrawer = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token');

        const response = await fetch('http://localhost:5000/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch tasks');
        }

        const data = await response.json();
        const tasks = data.data || [];

        setUserTasks(tasks);
        setStats({
          totalTasks: tasks.length,
          completedTasks: tasks.filter((t) => t.status === 'completed').length,
          inProgressTasks: tasks.filter((t) => t.status === 'in-progress').length,
          todoTasks: tasks.filter((t) => t.status === 'todo').length,
        });
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };
    fetchData();
  }, [user]);

  const handleUpdateStatus = async () => {
    try {
      if (!selectedTask || !selectedTask._id) {
        toast({
          title: 'Error',
          description: 'Please select a task first',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Error',
          description: 'Authentication required',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      const response = await fetch(`http://localhost:5000/api/tasks/${selectedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
      
      const updatedTask = await response.json();
      setUserTasks((prev) => prev.map((t) => (t._id === selectedTask._id ? updatedTask.data : t)));
      toast({
        title: 'Status Updated',
        description: `Task status updated to ${newStatus}`,
        status: 'success',
        duration: 3000,
      });
      onStatusModalClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleTaskUpdate = async (taskId, updateData) => {
    try {
      if (!taskId) {
        toast({
          title: 'Error',
          description: 'Task ID is required',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Error',
          description: 'Authentication required',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task');
      }
      
      const updatedTask = await response.json();
      setUserTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask.data : t)));
      toast({
        title: 'Task Updated',
        description: 'Task progress has been updated successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleAddComment = (taskId) => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      text: newComment,
      user: user.email,
      timestamp: new Date().toISOString(),
    };

    setTaskComments((prev) => [...prev, comment]);
    setNewComment('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'green';
      case 'in-progress':
        return 'blue';
      case 'todo':
        return 'gray';
      case 'review':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const completionRate = Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0;

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} position="relative">
      <Flex direction="column">
        <Box flex="1" px={{ base: 2, md: 8 }} py={8}>
          <Container maxW="container.xl" p={0}>
            <VStack spacing={8} align="stretch">
              {/* Header */}
              <Flex align="center" mb={2} gap={6} flexWrap="wrap">
                <Avatar name={user?.name} size="xl" mr={2} boxShadow="lg" />
                <Box>
                  <Heading size="lg">Welcome back, {user?.name}</Heading>
                  <Text color="gray.500">Here's your progress overview</Text>
                </Box>
                <Spacer />
                <Box display={{ base: 'none', md: 'block' }}>
                  <CircularProgress value={completionRate} size="90px" thickness="8px" color="green.400">
                    <CircularProgressLabel fontWeight="bold">{completionRate}%</CircularProgressLabel>
                  </CircularProgress>
                </Box>
              </Flex>

              {/* Stats Cards */}
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
                <StatCard
                  title="Task Completion"
                  value={`${completionRate}%`}
                  change={5}
                  icon={FiCheckCircle}
                  detail={`${stats.completedTasks} tasks completed`}
                />
                <StatCard
                  title="Productivity"
                  value="85%"
                  change={8}
                  icon={FiTrendingUp}
                  detail="Based on last 7 days"
                />
                <StatCard
                  title="Work Hours"
                  value="7.5"
                  change={0}
                  icon={FiClock}
                  detail="This week"
                />
                <StatCard
                  title="Achievement Points"
                  value="350"
                  change={12}
                  icon={FiFlag}
                  detail="Top 10% of team"
                />
              </SimpleGrid>

              {/* My Tasks Section */}
              <Box bg={useColorModeValue('white', 'gray.800')} p={6} borderRadius="2xl" boxShadow="lg" mt={2}>
                <Heading size="md" mb={4} color={useColorModeValue('gray.700', 'gray.100')}>My Tasks</Heading>
                <Tabs variant="soft-rounded" colorScheme="green">
                  <TabList>
                    <Tab>In Progress</Tab>
                    <Tab>Upcoming</Tab>
                    <Tab>Done</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <TaskGrid
                        tasks={userTasks.filter((t) => t.status === 'in-progress')}
                        onUpdate={handleTaskUpdate}
                        setActiveTask={setActiveTask}
                        setTaskProgress={setTaskProgress}
                        onTaskDrawerOpen={onTaskDrawerOpen}
                      />
                    </TabPanel>
                    <TabPanel>
                      <TaskGrid
                        tasks={userTasks.filter((t) => t.status === 'todo')}
                        onUpdate={handleTaskUpdate}
                        setActiveTask={setActiveTask}
                        setTaskProgress={setTaskProgress}
                        onTaskDrawerOpen={onTaskDrawerOpen}
                      />
                    </TabPanel>
                    <TabPanel>
                      <TaskGrid
                        tasks={userTasks.filter((t) => t.status === 'done')}
                        onUpdate={handleTaskUpdate}
                        setActiveTask={setActiveTask}
                        setTaskProgress={setTaskProgress}
                        onTaskDrawerOpen={onTaskDrawerOpen}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>

              {/* Widgets Section */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box bg={useColorModeValue('white', 'gray.800')} p={6} borderRadius="2xl" boxShadow="lg">
                  <AttendanceTracker />
                </Box>
                <VStack spacing={6} align="stretch">
                  <Box bg={useColorModeValue('white', 'gray.800')} p={6} borderRadius="2xl" boxShadow="lg">
                    <LeaveRequest leaveRequests={leaveRequests} />
                  </Box>
                  <Box bg={useColorModeValue('white', 'gray.800')} p={6} borderRadius="2xl" boxShadow="lg">
                    <Calendar />
                  </Box>
                </VStack>
              </SimpleGrid>

              {/* Modals and Drawers for task updates and comments */}
              <TaskStatusModal
                isOpen={isStatusModalOpen}
                onClose={onStatusModalClose}
                selectedTask={selectedTask}
                newStatus={newStatus}
                setNewStatus={setNewStatus}
                onUpdateStatus={handleUpdateStatus}
                tasks={userTasks}
                setSelectedTask={setSelectedTask}
              />
              <TaskUpdateDrawer
                isOpen={isTaskDrawerOpen}
                onClose={onTaskDrawerClose}
                activeTask={activeTask}
                setActiveTask={setActiveTask}
                taskProgress={taskProgress}
                setTaskProgress={setTaskProgress}
                taskComments={taskComments}
                setTaskComments={setTaskComments}
                newComment={newComment}
                setNewComment={setNewComment}
                onAddComment={handleAddComment}
                onUpdateTask={handleTaskUpdate}
              />
            </VStack>
          </Container>
        </Box>

        {/* Floating Chat Button */}
        <Tooltip label="Open Team Chat" placement="left">
          <IconButton
            icon={<FiMessageSquare size={24} />}
            colorScheme="blue"
            size="lg"
            position="fixed"
            bottom={8}
            right={8}
            zIndex={20}
            borderRadius="full"
            boxShadow="lg"
            onClick={chatDrawer.onOpen}
            aria-label="Open Team Chat"
          />
        </Tooltip>

        {/* Mobile: Chat Drawer */}
        <Drawer
          isOpen={chatDrawer.isOpen}
          placement="right"
          onClose={chatDrawer.onClose}
          size="full"
          display={{ base: 'block', md: 'none' }}
        >
          <DrawerOverlay background="none !important" pointerEvents="none" />
          <DrawerContent pointerEvents="auto">
            <DrawerBody p={0}>
              <ChatWindow onDrawerClose={chatDrawer.onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
};

// Helper components

const StatCard = ({ title, value, change, icon: Icon, detail }) => (
  <Box
    p={6}
    bg={useColorModeValue('white', 'gray.800')}
    borderRadius="lg"
    boxShadow="md"
    border="1px solid"
    borderColor={useColorModeValue('gray.200', 'gray.700')}
  >
    <HStack spacing={4}>
      <Icon size="32px" color={useColorModeValue('green.500', 'green.300')} />
      <Box>
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
        <Text fontSize="2xl">{value}</Text>
        {detail && <Text fontSize="sm" color="gray.500">{detail}</Text>}
      </Box>
    </HStack>
  </Box>
);

const TaskGrid = ({ tasks, onUpdate, setActiveTask, setTaskProgress, onTaskDrawerOpen }) => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
    {tasks.map((task) => (
      <TaskCard
        key={task._id}
        task={task}
        onUpdate={onUpdate}
        setActiveTask={setActiveTask}
        setTaskProgress={setTaskProgress}
        onTaskDrawerOpen={onTaskDrawerOpen}
      />
    ))}
  </SimpleGrid>
);

const TaskCard = ({ task, onUpdate, setActiveTask, setTaskProgress, onTaskDrawerOpen }) => {
  const handleTaskClick = () => {
    // Open the TaskUpdateDrawer with the clicked task details
    setActiveTask(task);
    setTaskProgress(task.actualHours && task.estimatedHours ? Math.round((task.actualHours / task.estimatedHours) * 100) : 0);
    onTaskDrawerOpen();
  };

  return (
    <Box
      p={4}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="md"
      boxShadow="sm"
      cursor="pointer"
      onClick={handleTaskClick}
    >
    <HStack justify="space-between" mb={2}>
      <Text fontWeight="bold">{task.title}</Text>
      <Badge colorScheme={getStatusColor(task.status)}>{task.status}</Badge>
    </HStack>
    <Text fontSize="sm" mb={2}>
      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
    </Text>
    <Progress value={Math.min((task.actualHours / (task.estimatedHours || 1)) * 100, 100)} size="sm" colorScheme="green" mb={2} />
    <HStack spacing={2}>
      <Tooltip label="Comments">
        <IconButton size="sm" icon={<FiMessageSquare />} variant="ghost" />
      </Tooltip>
      <Tooltip label="Attachments">
        <IconButton size="sm" icon={<FiPaperclip />} variant="ghost" />
      </Tooltip>
      <Tooltip label="Priority">
        <IconButton
          size="sm"
          icon={<FiFlag />}
          variant="ghost"
          colorScheme={getPriorityColor(task.priority)}
        />
      </Tooltip>
    </HStack>
  </Box>
  );
 };

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'in-progress':
      return 'blue';
    case 'todo':
      return 'gray';
    default:
      return 'gray';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'red';
    case 'medium':
      return 'orange';
    case 'low':
      return 'green';
    default:
      return 'gray';
  }
};

const TaskStatusModal = ({
  isOpen,
  onClose,
  selectedTask,
  newStatus,
  setNewStatus,
  onUpdateStatus,
  tasks,
  setSelectedTask,
}) => (
  <Popup
    isOpen={isOpen}
    onClose={onClose}
    title="Update Task Status"
  >
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>Task</FormLabel>
        <Select
          placeholder="Select task"
          value={selectedTask?._id || ''}
          onChange={(e) => setSelectedTask(tasks.find((t) => t._id === e.target.value))}
        >
          {tasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.title}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>New Status</FormLabel>
        <Select
          placeholder="Select status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </Select>
      </FormControl>
      <Button colorScheme="green" width="full" onClick={onUpdateStatus}>
        Update Status
      </Button>
    </VStack>
  </Popup>
);

const TaskUpdateDrawer = ({
  isOpen,
  onClose,
  activeTask,
  setActiveTask,
  taskProgress,
  setTaskProgress,
  taskComments,
  setTaskComments,
  newComment,
  setNewComment,
  onAddComment,
  onUpdateTask,
}) => {
  const toast = useToast();

  const handleProgressChange = (e) => {
    const value = e.target.value;
    setTaskProgress(value);
    // Update actualHours based on progress percentage and estimatedHours
    const estimated = activeTask.estimatedHours || 0;
    const actual = Math.min((value / 100) * estimated, estimated);
    onUpdateTask(activeTask._id, { actualHours: actual });
  };

  const handleStatusChange = (e) => {
    onUpdateTask(activeTask._id, { status: e.target.value });
    setActiveTask({ ...activeTask, status: e.target.value });
  };

  const handleAddCommentClick = () => {
    onAddComment(activeTask._id);
  };

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title="Update Task"
    >
      {activeTask && (
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="md">{activeTask.title}</Heading>
            <Text color="gray.500">{activeTask.description}</Text>
          </Box>
          <Box>
            <FormLabel>Progress</FormLabel>
            <Progress value={parseInt(taskProgress) || 0} mb={2} />
            <Input
              type="number"
              value={taskProgress}
              onChange={handleProgressChange}
              min={0}
              max={100}
            />
          </Box>
          <FormControl>
            <FormLabel>Status Update</FormLabel>
            <Select value={activeTask.status} onChange={handleStatusChange}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </Select>
          </FormControl>
          <Box>
            <FormLabel>Add Comment</FormLabel>
            <VStack spacing={4}>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment..."
              />
              <Button leftIcon={<FiMessageSquare />} onClick={handleAddCommentClick}>
                Add Comment
              </Button>
            </VStack>
          </Box>
          <VStack align="stretch" spacing={4}>
            {taskComments.map((comment) => (
              <Box
                key={comment.id}
                p={3}
                bg={useColorModeValue('gray.50', 'gray.700')}
                borderRadius="md"
              >
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold">{comment.user}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(comment.timestamp).toLocaleString()}
                  </Text>
                </HStack>
                <Text>{comment.text}</Text>
              </Box>
            ))}
          </VStack>
        </VStack>
      )}
    </Popup>
  );
};

export default EmployeeDashboard;
