import api from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// Get all chats for the current user
export const getUserChats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch chats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching chats:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch chats'
    };
  }
};

// Get messages for a specific chat
export const getChatMessages = async (chatId) => {
  const response = await fetch(`${API_BASE_URL}/chat/${chatId}/messages`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
};

// Create a new chat (group or direct)
export const createChat = async (chatData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(chatData),
    });
    if (!response.ok) throw new Error('Failed to create chat');
    return await response.json();
  } catch (error) {
    console.error('Error creating chat:', error);
    return {
      success: false,
      message: error.message || 'Failed to create chat'
    };
  }
};

// Send a message in a chat
export const sendMessage = async (chatId, content) => {
  const response = await fetch(`${API_BASE_URL}/chat/${chatId}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ content })
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

// Update a message
export const updateMessage = async (messageId, content) => {
  try {
    const response = await api.put(`/chat/messages/${messageId}`, { content });
    return response;
  } catch (error) {
    console.error('Error updating message:', error);
    return {
      success: false,
      message: error.message || 'Failed to update message'
    };
  }
};

// Delete a message
export const deleteMessage = async (messageId) => {
  try {
    const response = await api.delete(`/chat/messages/${messageId}`);
    return response;
  } catch (error) {
    console.error('Error deleting message:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete message'
    };
  }
};

// Add a reaction to a message
export const addReaction = async (messageId, emoji) => {
  try {
    const response = await api.post(`/chat/messages/${messageId}/reactions`, { emoji });
    return response;
  } catch (error) {
    console.error('Error adding reaction:', error);
    return {
      success: false,
      message: error.message || 'Failed to add reaction'
    };
  }
};

// Search users for chat
export const searchChatUsers = async (query) => {
  const response = await fetch(`${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to search users');
  return response.json();
}; 