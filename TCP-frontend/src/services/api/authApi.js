const BASE_URL = 'http://localhost:5000/api/auth';

export const authApi = {
  async login(credentials) {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      return data;
    } catch (error) {
      console.error('Login API Error:', error);
      throw error;
    }
  },

  async verifyToken(token) {
    try {
      const response = await fetch(`${BASE_URL}/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      return response.json();
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  }
};
