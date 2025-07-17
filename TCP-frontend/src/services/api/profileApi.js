const BASE_URL = 'http://localhost:5000/api/users';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// Get user profile
export async function getProfile() {
  const response = await fetch(`${BASE_URL}/profile`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch profile');
  }

  return response.json();
}

// Update user profile
export async function updateProfile(profileData) {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  return response.json();
} 