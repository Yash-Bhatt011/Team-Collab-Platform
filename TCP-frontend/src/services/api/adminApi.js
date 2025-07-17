const BASE_URL = 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

async function fetchTasks() {
  const response = await fetch(`${BASE_URL}/tasks`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const data = await response.json();
  return data.data || [];
}

async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/users/all`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await response.json();
  return data.data || [];
}

async function fetchActivities() {
  const response = await fetch(`${BASE_URL}/activities`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch activities');
  }
  const data = await response.json();
  return data.data || [];
}

async function fetchPerformanceMetrics() {
  const response = await fetch(`${BASE_URL}/performance-metrics`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch performance metrics');
  }
  const data = await response.json();
  return data.data || null;
}

async function fetchDashboardStats() {
  const response = await fetch(`${BASE_URL}/dashboard-stats`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  const data = await response.json();
  return data.data || null;
}

async function fetchRecentActivities() {
  const response = await fetch(`${BASE_URL}/recent-activities`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch recent activities');
  }
  const data = await response.json();
  return data.data || [];
}

async function fetchUpcomingDeadlines() {
  const response = await fetch(`${BASE_URL}/upcoming-deadlines`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch upcoming deadlines');
  }
  const data = await response.json();
  return data.data || [];
}

async function createTask(taskData) {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create task');
  }
  const data = await response.json();
  return data.data;
}

async function updateTaskStatus(taskId, status) {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}/status`, {
    method: 'PUT',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update task status');
  }
  const data = await response.json();
  return data.data;
}

async function createUser(userData) {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create user');
  }
  const data = await response.json();
  return data.data;
}

export {
  fetchTasks,
  fetchUsers,
  fetchActivities,
  fetchPerformanceMetrics,
  fetchDashboardStats,
  fetchRecentActivities,
  fetchUpcomingDeadlines,
  createTask,
  updateTaskStatus,
  createUser,
};
