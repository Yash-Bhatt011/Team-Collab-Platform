const API_URL = 'http://localhost:5000/api/auth';

export const authApi = {
  async login(credentials) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed');
    }

    return data;
  },

  async verifyToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }

    return response.json();
  }
};
