import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors and format responses
api.interceptors.response.use(
  (response) => {
    // If the response already has success and data fields, return it as is
    if (response.data.hasOwnProperty('success') && response.data.hasOwnProperty('data')) {
      return response.data;
    }
    // Otherwise, wrap it in our standard format
    return {
      success: true,
      data: response.data
    };
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors (token expired or invalid)
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // Return error in our standard format
      return Promise.reject({
        success: false,
        message: error.response.data.message || 'An error occurred',
        status: error.response.status
      });
    }
    return Promise.reject({
      success: false,
      message: error.message || 'Network error occurred'
    });
  }
);

export default api; 