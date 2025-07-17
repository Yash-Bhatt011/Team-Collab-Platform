const BASE_URL = 'http://localhost:5000/api';

export const api = {
  async login(credentials) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
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
  }
};
