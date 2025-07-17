import api from './api';

export const searchUsers = async (query) => {
  try {
    const response = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
    return response;
  } catch (error) {
    console.error('Error searching users:', error);
    return {
      success: false,
      message: error.message || 'Failed to search users'
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch user profile'
    };
  }
}; 