const API_BASE_URL = 'http://localhost:5000/api/notifications';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// Get user notifications
export async function getNotifications(params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}?${queryParams}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch notifications');
  }

  return response.json();
}

// Mark notification as read
export async function markNotificationAsRead(notificationId) {
  const response = await fetch(`${API_BASE_URL}/${notificationId}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to mark notification as read');
  }

  return response.json();
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  const response = await fetch(`${API_BASE_URL}/mark-all-read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to mark all notifications as read');
  }

  return response.json();
}

// Delete notification
export async function deleteNotification(notificationId) {
  const response = await fetch(`${API_BASE_URL}/${notificationId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete notification');
  }

  return response.json();
}

// Create broadcast notification (admin only)
export async function createBroadcast(broadcastData) {
  const response = await fetch(`${API_BASE_URL}/broadcast`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(broadcastData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create broadcast');
  }

  return response.json();
}

// Get broadcast notifications (admin only)
export async function getBroadcasts(params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/broadcast?${queryParams}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch broadcasts');
  }

  return response.json();
}

// Delete broadcast notification (admin only)
export async function deleteBroadcast(broadcastId) {
  const response = await fetch(`${API_BASE_URL}/broadcast/${broadcastId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete broadcast');
  }

  return response.json();
}

// Get notification settings
export async function getNotificationSettings() {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch notification settings');
  }

  return response.json();
}

// Update notification settings
export async function updateNotificationSettings(settings) {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update notification settings');
  }

  return response.json();
} 