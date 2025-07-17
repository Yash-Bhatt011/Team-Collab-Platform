const API_URL = 'http://localhost:5000/api/auth';

class AuthService {
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      return data;
    } catch (error) {
      console.error('Auth API Error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
