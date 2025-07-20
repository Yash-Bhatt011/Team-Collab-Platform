const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = {
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
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
      const response = await fetch(`${API_BASE_URL}/verify`, {
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
