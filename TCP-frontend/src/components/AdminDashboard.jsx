import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  HStack,
  Text,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Circle,
  useColorModeValue,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  SimpleGrid,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from '@chakra-ui/react'
import Button from './ui/Button';
import Popup from './ui/Popup';
import { useAuth } from '../contexts/AuthContext'
import { FiCalendar, FiCheckCircle, FiClock, FiList, FiMoreVertical, FiMessageSquare, FiPaperclip, FiFlag, FiBarChart2, FiTrendingUp, FiPlus, FiUsers, FiActivity, FiUserPlus } from 'react-icons/fi';
import { fetchTasks, fetchUsers, fetchActivities, fetchPerformanceMetrics, fetchDashboardStats, fetchRecentActivities, fetchUpcomingDeadlines } from '../services/api/adminApi';
import { useNavigate } from 'react-router-dom';
import ResourceLibrary from './ResourceLibrary';
import PerformanceMetrics from './PerformanceMetrics';
import Calendar from './Calendar';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DownloadIcon, EmailIcon } from '@chakra-ui/icons';

const AdminDashboard = () => {
  const { user } = useAuth()
  const toast = useToast()
  const { isOpen: isCreateTaskOpen, onOpen: onCreateTaskOpen, onClose: onCreateTaskClose } = useDisclosure()
  const { isOpen: isAddUserOpen, onOpen: onAddUserOpen, onClose: onAddUserClose } = useDisclosure()
  const { isOpen: isViewTasksOpen, onOpen: onViewTasksOpen, onClose: onViewTasksClose } = useDisclosure()
  const { isOpen: isViewUsersOpen, onOpen: onViewUsersOpen, onClose: onViewUsersClose } = useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isProjectModalOpen,
    onOpen: onProjectModalOpen,
    onClose: onProjectModalClose
  } = useDisclosure();
  const {
    isOpen: isUserModalOpen,
    onOpen: onUserModalOpen,
    onClose: onUserModalClose
  } = useDisclosure();
  const {
    isOpen: isReportModalOpen,
    onOpen: onReportModalOpen,
    onClose: onReportModalClose
  } = useDisclosure();

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
  })

  // Fix uncontrolled input warning by ensuring controlled inputs have default values
  // For example, ensure newProject state fields are initialized as empty strings (already done)
  // Also check other inputs if needed

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'employee',
  })

  const [selectedItem, setSelectedItem] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, usersData, activitiesData, performanceData, dashboardData, recentActs, upcoming] = await Promise.all([
          fetchTasks(),
          fetchUsers(),
          fetchActivities(),
          fetchPerformanceMetrics(),
          fetchDashboardStats(),
          fetchRecentActivities(),
          fetchUpcomingDeadlines()
        ]);
        console.log('Fetched users:', usersData);
        setTasks(tasksData);
        setUsers(usersData);
        setActivities(activitiesData);
        setPerformanceMetrics(performanceData);
        setDashboardStats(dashboardData);
        setRecentActivities(recentActs);
        setUpcomingDeadlines(upcoming);
      } catch (error) {
        toast({
          title: 'Error fetching data',
          description: error.message || 'Failed to load data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchData();
  }, [toast]);

  // Calculate task statistics
  const safeDashboardStats = dashboardStats && dashboardStats.projectMetrics ? dashboardStats : {
    overview: { totalUsers: 0, activeUsers: 0, completedTasks: 0, pendingTasks: 0 },
    projectMetrics: { onTrack: 0, delayed: 0, completed: 0 },
    attendance: { present: 0, remote: 0 },
    resourceUtilization: {},
  };

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'done').length,
    inProgressTasks: tasks.filter(task => task.status === 'in-progress').length,
    toDoTasks: tasks.filter(task => task.status === 'todo').length,
  }

  const quickActions = [
    {
      title: 'Create Project',
      subtitle: 'Start a new project',
      icon: FiPlus,
      color: 'blue',
      handler: onProjectModalOpen,
      gradient: 'linear(to-r, blue.400, purple.500)'
    },
    {
      title: 'Add User',
      subtitle: 'Invite team member',
      icon: FiUserPlus,
      color: 'green',
      handler: onUserModalOpen,
      gradient: 'linear(to-r, green.400, teal.500)'
    },
    {
      title: 'View Reports',
      subtitle: 'Analytics & insights',
      icon: FiBarChart2,
      color: 'purple',
      handler: onReportModalOpen,
      gradient: 'linear(to-r, purple.400, pink.500)'
    }
  ];

  const handleAction = (action, item) => {
    setSelectedItem(item);
    onOpen();
    
    toast({
      title: 'Action Triggered',
      description: `${action} action for ${item.title}`,
      status: 'info',
      duration: 2000,
    });
  };

  useEffect(() => {
    console.log('Users state:', users);
    console.log('Is View Users Modal Open:', isViewUsersOpen);
  }, [users, isViewUsersOpen]);

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.assignee) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Error',
          description: 'Authentication required',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          assignedTo: newTask.assignee,
          priority: newTask.priority
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }
      const data = await response.json();
      setTasks([data.data, ...tasks]);
      toast({
        title: 'Success',
        description: 'Task created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onCreateTaskClose();
      setNewTask({ title: '', description: '', assignee: '', priority: 'medium' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.description || !newProject.startDate || !newProject.endDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newProject)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }
      const data = await response.json();
      toast({
        title: 'Success',
        description: `Project ${data.data.name} created successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onProjectModalClose();
      setNewProject({ name: '', description: '', startDate: '', endDate: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newUser)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }
      const data = await response.json();
      setUsers([data.data, ...users]);
      toast({
        title: 'Success',
        description: `User ${data.data.name} added successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onUserModalClose();
      setNewUser({ name: '', email: '', role: 'employee' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.900, blue.900)'
  );

  // Add this mock data for charts
  const projectData = [
    { name: 'Jan', completed: 4, active: 6 },
    { name: 'Feb', completed: 3, active: 8 },
    { name: 'Mar', completed: 5, active: 7 },
    { name: 'Apr', completed: 6, active: 5 },
  ];

  return (
    <Box
      minH="100vh"
      pt="80px"
      bgGradient={bgGradient}
    >
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Quick Stats Section */}
          <Box
            p={6}
            bg={useColorModeValue('white', 'whiteAlpha.100')}
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
          >
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <StatCard
                title="Team Members"
                value={safeDashboardStats.overview.totalUsers}
                change={8}
                icon={FiUsers}
                detail={`${safeDashboardStats.overview.activeUsers} active now`}
              />
              <StatCard
                title="Projects"
                value={safeDashboardStats.projectMetrics.onTrack}
                change={12}
                icon={FiActivity}
                detail={`${safeDashboardStats.projectMetrics.completed} completed`}
              />
              <StatCard
                title="Attendance"
                value={safeDashboardStats.attendance.present}
                change={-2}
                icon={FiClock}
                detail={`${safeDashboardStats.attendance.remote} working remote`}
              />
              <StatCard
                title="Tasks"
                value={safeDashboardStats.overview.completedTasks}
                change={15}
                icon={FiCheckCircle}
                detail={`${safeDashboardStats.overview.pendingTasks} pending`}
              />
            </SimpleGrid>
          </Box>

          {/* Project Overview and Team Performance */}
          <Box
            p={6}
            bg={useColorModeValue('white', 'whiteAlpha.100')}
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
          >
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Box
                p={6}
                bg="whiteAlpha.100"
                backdropFilter="blur(10px)"
                borderRadius="2xl"
                border="1px solid"
                borderColor="whiteAlpha.200"
              >
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Heading size="md">Project Overview</Heading>
                    <Select size="sm" w="150px">
                      <option value="all">All Projects</option>
                      <option value="active">Active Only</option>
                    </Select>
                  </HStack>
                  <SimpleGrid columns={2} spacing={4}>
                  <ProjectMetricCard
                    label="On Track"
                    value={safeDashboardStats.projectMetrics.onTrack}
                    total={safeDashboardStats.projectMetrics.onTrack + safeDashboardStats.projectMetrics.delayed}
                    color="green"
                  />
                  <ProjectMetricCard
                    label="Delayed"
                    value={safeDashboardStats.projectMetrics.delayed}
                    total={safeDashboardStats.projectMetrics.onTrack + safeDashboardStats.projectMetrics.delayed}
                    color="red"
                  />
                  </SimpleGrid>
                  <Box h="200px">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={projectData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#48BB78" />
                        <Bar dataKey="active" fill="#4299E1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </VStack>
              </Box>

              <Box
                p={6}
                bg="whiteAlpha.100"
                backdropFilter="blur(10px)"
                borderRadius="2xl"
                border="1px solid"
                borderColor="whiteAlpha.200"
              >
                <VStack align="stretch" spacing={4}>
                  <Heading size="md">Team Performance</Heading>
                  {Object.entries(safeDashboardStats.resourceUtilization).map(([dept, value]) => (
                    <Box key={dept}>
                      <HStack justify="space-between" mb={2}>
                        <Text>{dept}</Text>
                        <Text>{value}%</Text>
                      </HStack>
                      <Progress
                        value={value}
                        colorScheme={value > 80 ? 'green' : value > 60 ? 'blue' : 'orange'}
                        size="sm"
                        borderRadius="full"
                      />
                    </Box>
                  ))}
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Recent Activities and Upcoming Deadlines */}
          <Box
            p={6}
            bg={useColorModeValue('white', 'whiteAlpha.100')}
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
          >
            <RecentActivitiesList activities={recentActivities} />
          </Box>

          {/* Quick Actions */}
          <Box
            p={6}
            bg={useColorModeValue('white', 'whiteAlpha.100')}
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
          >
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  whileTap={{ y: 0 }}
                >
          <Button
            height="120px"
            width="100%"
            onClick={action.handler}
            className="custom-button"
          >
            <VStack spacing={3}>
              <Icon as={action.icon} boxSize="24px" />
              <VStack spacing={1}>
                <Text fontWeight="bold">{action.title}</Text>
                <Text fontSize="sm" opacity={0.8}>
                  {action.subtitle}
                </Text>
              </VStack>
            </VStack>
          </Button>
                </motion.div>
              ))}
            </SimpleGrid>
          </Box>

          {/* Calendar and Notifications */}
          <Box
            p={6}
            bg={useColorModeValue('white', 'whiteAlpha.100')}
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
          >
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Box>
                <Heading size="md" mb={4}>Team Calendar</Heading>
                <Calendar />
              </Box>

              <Box>
                {/* <Heading size="md" mb={4}>Notifications</Heading>  */}
                {/* Notification items can be mapped here */}
                {/* Assuming NotificationCenter or a similar component will be used here */}
              </Box>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>

      {/* Create Task Modal */}
      <Popup isOpen={isCreateTaskOpen} onClose={onCreateTaskClose} title="Create New Task">
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Assignee</FormLabel>
            <Select
              value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
            >
              <option value="">Select Assignee</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Priority</FormLabel>
            <Select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </FormControl>
          <Button onClick={handleCreateTask} width="full" className="custom-button">
            Create Task
          </Button>
        </VStack>
      </Popup>

      {/* Create Project Modal */}
      <Popup isOpen={isProjectModalOpen} onClose={onProjectModalClose} title="Create New Project">
        <VStack spacing={6}>
          <FormControl isRequired>
            <FormLabel>Project Name</FormLabel>
            <Input
              placeholder="Enter project name"
              variant="filled"
              bg="whiteAlpha.100"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Project description"
              variant="filled"
              bg="whiteAlpha.100"
              rows={4}
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </FormControl>
          <SimpleGrid columns={2} spacing={4} w="100%">
            <FormControl isRequired>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                variant="filled"
                bg="whiteAlpha.100"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                variant="filled"
                bg="whiteAlpha.100"
                value={newProject.endDate}
                onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
              />
            </FormControl>
          </SimpleGrid>
          <FormControl>
            <FormLabel>Team Members</FormLabel>
            <Select
              placeholder="Select team members"
              variant="filled"
              bg="whiteAlpha.100"
              multiple
            >
              {/* Add team members options */}
            </Select>
          </FormControl>
          <Button
            width="100%"
            size="lg"
            className="custom-button"
          >
            Create Project
          </Button>
        </VStack>
      </Popup>

      {/* Add User Modal */}
      <Popup isOpen={isUserModalOpen} onClose={onUserModalClose} title="Add Team Member">
        <VStack spacing={6}>
          <SimpleGrid columns={2} spacing={4} w="100%">
            <FormControl isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                placeholder="Enter first name"
                variant="filled"
                bg="whiteAlpha.100"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                placeholder="Enter last name"
                variant="filled"
                bg="whiteAlpha.100"
              />
            </FormControl>
          </SimpleGrid>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter email address"
              variant="filled"
              bg="whiteAlpha.100"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Role</FormLabel>
            <Select
              placeholder="Select role"
              variant="filled"
              bg="whiteAlpha.100"
            >
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
            </Select>
          </FormControl>
          <Button
            width="100%"
            size="lg"
            className="custom-button"
          >
            Add Team Member
          </Button>
        </VStack>
      </Popup>

      {/* View All Tasks Modal */}
      <Popup isOpen={isViewTasksOpen} onClose={onViewTasksClose} title="All Tasks">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Assignee</Th>
              <Th>Status</Th>
              <Th>Priority</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((task) => (
              <Tr key={task._id}>
                <Td>{task.title}</Td>
                <Td>{task.assignedTo?.name || 'Unassigned'}</Td>
                <Td>{task.status}</Td>
                <Td>{task.priority}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Popup>

      {/* View All Users Modal */}
      <Popup isOpen={isViewUsersOpen} onClose={onViewUsersClose} title="All Users">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user._id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.role}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Popup>

      {/* Action Modal */}
      <Popup isOpen={isOpen} onClose={onClose} title="Action Details">
        {selectedItem && (
          <Text>Processing action for {selectedItem.title}</Text>
        )}
      </Popup>

      {/* View Reports Modal */}
      <Popup isOpen={isReportModalOpen} onClose={onReportModalClose} title="Analytics & Reports">
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList mb={4}>
            <Tab>Overview</Tab>
            <Tab>Projects</Tab>
            <Tab>Tasks</Tab>
            <Tab>Users</Tab>
            <Tab>Performance</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box p={6} borderRadius="xl" bg="whiteAlpha.100" backdropFilter="blur(10px)">
                  <Heading size="sm" mb={4}>Quick Summary</Heading>
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between">
                      <Text>Total Active Projects</Text>
                      <Text fontWeight="bold">24</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Tasks Completed This Month</Text>
                      <Text fontWeight="bold">156</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Active Team Members</Text>
                      <Text fontWeight="bold">45</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Average Task Completion</Text>
                      <Text fontWeight="bold">3.2 days</Text>
                    </HStack>
                  </VStack>
                </Box>

                <Box p={6} borderRadius="xl" bg="whiteAlpha.100" backdropFilter="blur(10px)">
                  <Heading size="sm" mb={4}>Performance Metrics</Heading>
                  <Progress value={78} size="lg" colorScheme="green" mb={2} />
                  <Text fontSize="sm" color="gray.500">Team Productivity Score: 78%</Text>
                  <Progress value={92} size="lg" colorScheme="blue" mb={2} mt={4} />
                  <Text fontSize="sm" color="gray.500">Project Success Rate: 92%</Text>
                </Box>
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Box p={6} borderRadius="xl" bg="whiteAlpha.100" backdropFilter="blur(10px)">
                  <HStack justify="space-between" mb={4}>
                    <Heading size="sm">Project Status Distribution</Heading>
                    <Select size="sm" w="200px">
                      <option value="all">All Projects</option>
                      <option value="active">Active Only</option>
                      <option value="completed">Completed Only</option>
                    </Select>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <Stat>
                      <StatLabel>Active</StatLabel>
                      <StatNumber>12</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        23.36%
                      </StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Completed</StatLabel>
                      <StatNumber>8</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        15.4%
                      </StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>On Hold</StatLabel>
                      <StatNumber>3</StatNumber>
                      <StatHelpText>
                        <StatArrow type="decrease" />
                        9.05%
                      </StatHelpText>
                    </Stat>
                  </SimpleGrid>
                </Box>

                <Box p={6} borderRadius="xl" bg="whiteAlpha.100" backdropFilter="blur(10px)">
                  <Heading size="sm" mb={4}>Project Timeline</Heading>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Project Name</Th>
                        <Th>Status</Th>
                        <Th>Progress</Th>
                        <Th>Due Date</Th>
                        <Th>Team</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {/* Add your project data here */}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Box p={6} borderRadius="xl" bg="whiteAlpha.100" backdropFilter="blur(10px)" h="300px">
                  <Heading size="sm" mb={4}>Project Trends</Heading>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" fill="#48BB78" />
                      <Bar dataKey="active" fill="#4299E1" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </TabPanel>

            {/* Add similar detailed sections for Tasks and Users tabs */}
          </TabPanels>
        </Tabs>

        <HStack justify="flex-end" mt={6} spacing={4}>
          <Button
            onClick={() => {
              toast({
                title: "Report Sent",
                description: "The report has been sent to your email.",
                status: "success",
                duration: 3000,
              });
            }}
            className="custom-button"
          >
            Email Report
          </Button>
          <Button
            onClick={() => {
              toast({
                title: "Download Started",
                description: "Your report is being downloaded.",
                status: "success",
                duration: 3000,
              });
            }}
            className="custom-button"
          >
            Download Report
          </Button>
        </HStack>
      </Popup>
    </Box>
  )
}

const StatCard = ({ title, value, change, icon, detail }) => (
  <Box
    p={6}
    bg="whiteAlpha.100"
    backdropFilter="blur(10px)"
    borderRadius="2xl"
    border="1px solid"
    borderColor="whiteAlpha.200"
    transition="all 0.3s"
    _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
  >
    <VStack align="start" spacing={4}>
      <Circle
        size="40px"
        bg={useColorModeValue("blue.100", "whiteAlpha.100")}
        color={useColorModeValue("blue.600", "blue.300")}
      >
        <Icon as={icon} boxSize="20px" />
      </Circle>
      
      <Stat>
        <StatLabel fontSize="lg">{title}</StatLabel>
        <StatNumber fontSize="3xl" fontWeight="bold">
          {value}
        </StatNumber>
        <StatHelpText>
          <StatArrow type={change > 0 ? "increase" : "decrease"} />
          {Math.abs(change)}% from last month
        </StatHelpText>
      </Stat>

      {detail && (
        <Text fontSize="sm" color="gray.500">
          {detail}
        </Text>
      )}
    </VStack>
  </Box>
);

// Helper components
const ProjectMetricCard = ({ label, value, total, color }) => (
  <Box p={4} borderRadius="lg" bg="whiteAlpha.100">
    <Text fontSize="sm" color="gray.500">{label}</Text>
    <Text fontSize="2xl" fontWeight="bold">{value}</Text>
    <Progress
      value={(value / total) * 100}
      colorScheme={color}
      size="sm"
      borderRadius="full"
    />
  </Box>
);

const RecentActivitiesList = ({ activities }) => (
  <Box
    p={6}
    bg={useColorModeValue('white', 'whiteAlpha.100')}
    backdropFilter="blur(10px)"
    borderRadius="2xl"
    border="1px solid"
    borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
  >
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Recent Activities</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>User</Th>
            <Th>Action</Th>
            <Th>Task</Th>
            <Th>Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {activities.map((activity) => (
            <Tr key={activity._id}>
              <Td>{activity.user?.name || 'Unknown'}</Td>
              <Td>
                <Badge
                  colorScheme={activity.action === 'completed' ? 'green' : 'blue'}
                >
                  {activity.action}
                </Badge>
              </Td>
              <Td>{activity.task?.title || 'N/A'}</Td>
              <Td>{new Date(activity.createdAt).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  </Box>
);

const UpcomingDeadlines = ({ deadlines }) => (
  <Box
    p={6}
    bg={useColorModeValue('white', 'whiteAlpha.100')}
    backdropFilter="blur(10px)"
    borderRadius="2xl"
    border="1px solid"
    borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
  >
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Upcoming Deadlines</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Task</Th>
            <Th>Assignee</Th>
            <Th>Due Date</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {deadlines.map((deadline) => (
            <Tr key={deadline._id}>
              <Td>{deadline.task}</Td>
              <Td>{deadline.assignee}</Td>
              <Td>{deadline.dueDate}</Td>
              <Td>
                <Badge colorScheme={deadline.status === 'overdue' ? 'red' : 'green'}>
                  {deadline.status}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  </Box>
);

export default AdminDashboard;
