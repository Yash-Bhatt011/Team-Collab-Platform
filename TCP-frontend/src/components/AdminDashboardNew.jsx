import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  IconButton,
  Button,
  useColorModeValue,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
} from '@chakra-ui/react';
import {
  FiHome,
  FiBarChart2,
  FiUsers,
  FiClipboard,
  FiTrendingUp,
  FiPlus,
  FiRadio,
} from 'react-icons/fi';
import { fetchTasks, fetchUsers, fetchActivities, fetchPerformanceMetrics, fetchDashboardStats, fetchRecentActivities, fetchUpcomingDeadlines, createTask, createUser } from '../services/api/adminApi';
import { useAuth } from '../contexts/AuthContext';
import Popup from './ui/Popup';
import BroadcastMessage from './BroadcastMessage';

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  const bg = useColorModeValue('gray.100', 'gray.900');
  const activeBg = useColorModeValue('blue.500', 'blue.700');
  const activeColor = useColorModeValue('white', 'white');

  const tabs = [
    { label: 'Overview', icon: FiHome },
    { label: 'Projects', icon: FiBarChart2 },
    { label: 'Tasks', icon: FiClipboard },
    { label: 'Users', icon: FiUsers },
    { label: 'Broadcasts', icon: FiRadio },
    { label: 'Performance', icon: FiTrendingUp },
  ];

  return (
    <VStack
      as="nav"
      spacing={4}
      align="stretch"
      bg={bg}
      w="220px"
      minH="100vh"
      p={4}
      boxShadow="md"
    >
      <Heading size="md" mb={6} textAlign="center">Admin Dashboard</Heading>
      {tabs.map((tab, idx) => {
        const isActive = selectedTab === idx;
        return (
          <Button
            key={tab.label}
            leftIcon={<tab.icon />}
            justifyContent="flex-start"
            bg={isActive ? activeBg : 'transparent'}
            color={isActive ? activeColor : 'inherit'}
            _hover={{ bg: isActive ? activeBg : useColorModeValue('gray.200', 'gray.700') }}
            onClick={() => setSelectedTab(idx)}
            borderRadius="md"
          >
            {tab.label}
          </Button>
        );
      })}
    </VStack>
  );
};

const StatCard = ({ title, value, change }) => {
  const bg = useColorModeValue('white', 'gray.700');
  return (
    <Box p={4} bg={bg} borderRadius="md" boxShadow="sm">
      <Stat>
        <StatLabel>{title}</StatLabel>
        <StatNumber>{value}</StatNumber>
        <StatHelpText>
          <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
          {Math.abs(change)}%
        </StatHelpText>
      </Stat>
    </Box>
  );
};

// Custom form styles for the popup
const formStyles = {
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'inherit',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  primaryButtonHover: {
    backgroundColor: '#2563eb',
  },
  successButton: {
    backgroundColor: '#10b981',
    color: 'white',
  },
  successButtonHover: {
    backgroundColor: '#059669',
  },
  required: {
    color: '#ef4444',
  },
};

const AdminDashboardNew = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [selectedTab, setSelectedTab] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [isAddingUser, setIsAddingUser] = useState(false);

  // Single modal state: null, 'createTask', 'addUser'
  const [modalType, setModalType] = useState(null);

  const openCreateTaskModal = () => {
    setModalType('createTask');
  };

  const openAddUserModal = () => {
    setModalType('addUser');
  };

  const closeModal = () => {
    setModalType(null);
    // Reset form data when closing modal
    setNewTask({ title: '', description: '', assignee: '', priority: 'medium' });
    setNewUser({ name: '', email: '', password: '', role: '' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          tasksData,
          usersData,
          activitiesData,
          performanceData,
          dashboardData,
          recentActs,
          upcoming,
        ] = await Promise.all([
          fetchTasks(),
          fetchUsers(),
          fetchActivities(),
          fetchPerformanceMetrics(),
          fetchDashboardStats(),
          fetchRecentActivities(),
          fetchUpcomingDeadlines(),
        ]);
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

  const safeDashboardStats = dashboardStats && dashboardStats.projectMetrics ? dashboardStats : {
    overview: { totalUsers: 0, activeUsers: 0, completedTasks: 0, pendingTasks: 0 },
    projectMetrics: { onTrack: 0, delayed: 0, completed: 0 },
    attendance: { present: 0, remote: 0 },
    resourceUtilization: {},
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.assignee) {
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
      const taskPayload = {
        title: newTask.title,
        description: newTask.description,
        assignedTo: newTask.assignee,
        priority: newTask.priority,
      };
      const createdTask = await createTask(taskPayload);
      setTasks([createdTask, ...tasks]);
      toast({
        title: 'Success',
        description: 'Task created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      closeModal();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsAddingUser(true);
    try {
      const createdUser = await createUser(newUser);
      setUsers([createdUser, ...users]);
      toast({
        title: 'Success',
        description: 'User added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      closeModal();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleInputFocus = (e) => {
    Object.assign(e.target.style, formStyles.inputFocus);
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#d1d5db';
    e.target.style.boxShadow = 'none';
  };

  const renderCreateTaskForm = () => (
    <div>
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>
          Title <span style={formStyles.required}>*</span>
        </label>
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          style={formStyles.input}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
      
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>
          Description <span style={formStyles.required}>*</span>
        </label>
        <textarea
          placeholder="Task description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          style={formStyles.textarea}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
      
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>
          Assignee <span style={formStyles.required}>*</span>
        </label>
        <select
          value={newTask.assignee}
          onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
          style={formStyles.select}
        >
          <option value="">Select assignee</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </div>
      
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Priority</label>
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          style={formStyles.select}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <button
        onClick={handleCreateTask}
        style={{
          ...formStyles.button,
          ...formStyles.primaryButton,
        }}
        onMouseEnter={(e) => Object.assign(e.target.style, formStyles.primaryButtonHover)}
        onMouseLeave={(e) => Object.assign(e.target.style, formStyles.primaryButton)}
      >
        Create Task
      </button>
    </div>
  );

  const renderAddUserForm = () => (
    <div>
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>
          Name <span style={formStyles.required}>*</span>
        </label>
        <input
          type="text"
          placeholder="User name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          style={formStyles.input}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
      
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>
          Email <span style={formStyles.required}>*</span>
        </label>
        <input
          type="email"
          placeholder="User email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          style={formStyles.input}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
      
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>
          Password <span style={formStyles.required}>*</span>
        </label>
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          style={formStyles.input}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
      
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>
          Role <span style={formStyles.required}>*</span>
        </label>
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          style={formStyles.select}
        >
          <option value="">Select role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      
      <button
        onClick={handleAddUser}
        disabled={isAddingUser}
        style={{
          ...formStyles.button,
          ...formStyles.successButton,
          opacity: isAddingUser ? 0.7 : 1,
          cursor: isAddingUser ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => !isAddingUser && Object.assign(e.target.style, formStyles.successButtonHover)}
        onMouseLeave={(e) => !isAddingUser && Object.assign(e.target.style, formStyles.successButton)}
      >
        {isAddingUser ? 'Adding User...' : 'Add User'}
      </button>
    </div>
  );

  return (
    <Flex>
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <Box flex="1" p={6} minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
        <HStack justify="space-between" mb={6}>
          <Heading size="lg">Welcome, {user?.name || 'Admin'}</Heading>
          <HStack spacing={4}>
            <Button colorScheme="blue" leftIcon={<FiPlus />} onClick={openCreateTaskModal}>
              New Task
            </Button>
            <Button colorScheme="green" leftIcon={<FiUsers />} onClick={openAddUserModal}>
              Add User
            </Button>
          </HStack>
        </HStack>

        {/* Custom Popup for Create Task and Add User */}
        <Popup
          isOpen={modalType === 'createTask'}
          onClose={closeModal}
          title="Create New Task"
        >
          {renderCreateTaskForm()}
        </Popup>

        <Popup
          isOpen={modalType === 'addUser'}
          onClose={closeModal}
          title="Add New User"
        >
          {renderAddUserForm()}
        </Popup>

        <Tabs index={selectedTab} onChange={setSelectedTab} variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Projects</Tab>
            <Tab>Tasks</Tab>
            <Tab>Users</Tab>
            <Tab>Broadcasts</Tab>
            <Tab>Performance</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
                <StatCard title="Team Members" value={safeDashboardStats.overview.totalUsers} change={8} />
                <StatCard title="Projects" value={safeDashboardStats.projectMetrics.onTrack} change={12} />
                <StatCard title="Attendance" value={safeDashboardStats.attendance.present} change={-2} />
                <StatCard title="Tasks" value={safeDashboardStats.overview.completedTasks} change={15} />
              </SimpleGrid>

              <Box mb={6}>
                <Heading size="md" mb={4}>Recent Activities</Heading>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>User</Th>
                      <Th>Action</Th>
                      <Th>Task</Th>
                      <Th>Time</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {recentActivities.map((activity) => (
                      <Tr key={activity._id}>
                        <Td>{activity.user?.name || 'Unknown'}</Td>
                        <Td>
                          <Badge colorScheme={activity.action === 'completed' ? 'green' : 'blue'}>
                            {activity.action}
                          </Badge>
                        </Td>
                        <Td>{activity.task?.title || 'N/A'}</Td>
                        <Td>{new Date(activity.createdAt).toLocaleString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Box>
                <Heading size="md" mb={4}>Upcoming Deadlines</Heading>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Task</Th>
                      <Th>Assignee</Th>
                      <Th>Due Date</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {upcomingDeadlines.map((deadline) => (
                      <Tr key={deadline.id}>
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
              </Box>
            </TabPanel>

            <TabPanel>
              {/* Projects Tab Content */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box p={4} bg={useColorModeValue('white', 'gray.700')} borderRadius="md" boxShadow="sm">
                  <Heading size="md" mb={4}>Project Status Distribution</Heading>
                  {/* Add pie chart or bar chart here */}
                  <Text>Project status chart to be implemented.</Text>
                </Box>
                <Box p={4} bg={useColorModeValue('white', 'gray.700')} borderRadius="md" boxShadow="sm">
                  <Heading size="md" mb={4}>Project Timeline</Heading>
                  <Table variant="simple" size="sm">
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
                      {/* Map project data here */}
                      <Tr>
                        <Td>Project A</Td>
                        <Td>Active</Td>
                        <Td>
                          <Progress value={70} size="sm" colorScheme="blue" />
                        </Td>
                        <Td>2024-12-31</Td>
                        <Td>Team Alpha</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              {/* Tasks Tab Content */}
              <Box p={4} bg={useColorModeValue('white', 'gray.700')} borderRadius="md" boxShadow="sm">
                <Heading size="md" mb={4}>Tasks</Heading>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Title</Th>
                      <Th>Assignee</Th>
                      <Th>Status</Th>
                      <Th>Priority</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tasks.map(task => (
                      <Tr key={task.id}>
                        <Td>{task.title}</Td>
                        <Td>{task.assignee}</Td>
                        <Td>{task.status}</Td>
                        <Td>{task.priority}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            <TabPanel>
              {/* Users Tab Content */}
              <Box p={4} bg={useColorModeValue('white', 'gray.700')} borderRadius="md" boxShadow="sm">
                <Heading size="md" mb={4}>Users</Heading>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Role</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map(user => (
                      <Tr key={user.id}>
                        <Td>{user.name}</Td>
                        <Td>{user.email}</Td>
                        <Td>{user.role}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            <TabPanel>
              {/* Broadcasts Tab Content */}
              <BroadcastMessage />
            </TabPanel>

            <TabPanel>
              {/* Performance Tab Content */}
              <Box p={4} bg={useColorModeValue('white', 'gray.700')} borderRadius="md" boxShadow="sm">
                <Heading size="md" mb={4}>Performance Metrics</Heading>
                {/* Add charts and metrics here */}
                <Text>Performance charts to be implemented.</Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default AdminDashboardNew;