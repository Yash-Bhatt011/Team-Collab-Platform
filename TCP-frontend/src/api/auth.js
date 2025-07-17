const BASE_URL = 'http://localhost:5000/api/auth';

export const authService = {
  async login(credentials) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Authentication failed');
    }

    return response.json();
  },

  async verifyToken(token) {
    const response = await fetch(`${BASE_URL}/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    return response.json();
  }
};
