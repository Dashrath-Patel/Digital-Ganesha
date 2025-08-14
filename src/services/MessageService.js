import { API_BASE_URL } from '../config/index.js';

class MessageService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/messages`;
  }

  // Get auth token from localStorage
  getAuthToken() {
    const token = localStorage.getItem('accessToken');
    return token ? `Bearer ${token}` : null;
  }

  // Default headers with auth
  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': token })
    };
  }

  // Get all active messages for community page
  async getMessages(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.baseURL}?${queryParams}` : this.baseURL;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Return the messages array from the data field
      return data.data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Get all messages for admin panel
  async getAdminMessages(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.baseURL}/admin?${queryParams}` : `${this.baseURL}/admin`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Return the messages array from the data field
      return data.data || [];
    } catch (error) {
      console.error('Error fetching admin messages:', error);
      throw error;
    }
  }

  // Get single message by ID
  async getMessageById(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  }

  // Create new message
  async createMessage(messageData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Return the created message from the data field
      return data.data || data;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  // Update message
  async updateMessage(id, messageData) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Return the updated message from the data field
      return data.data || data;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }

  // Delete message
  async deleteMessage(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Toggle message active status
  async toggleMessageStatus(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}/toggle-status`, {
        method: 'PUT',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling message status:', error);
      throw error;
    }
  }

  // Get message statistics
  async getMessageStats() {
    try {
      const response = await fetch(`${this.baseURL}/stats/overview`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw error;
    }
  }

  // Utility function to format message data for display
  formatMessage(message) {
    return {
      ...message,
      formattedDate: new Date(message.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      shortContent: message.content.length > 150 
        ? `${message.content.substring(0, 150)}...` 
        : message.content
    };
  }

  // Validate message data before sending to API
  validateMessageData(messageData) {
    const errors = [];

    if (!messageData.title || messageData.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (messageData.title.length > 200) {
      errors.push('Title cannot exceed 200 characters');
    }

    if (!messageData.content || messageData.content.trim().length === 0) {
      errors.push('Content is required');
    }

    if (!messageData.author || messageData.author.trim().length === 0) {
      errors.push('Author is required');
    }

    const validCategories = ['announcement', 'festival', 'community', 'important', 'general'];
    if (messageData.category && !validCategories.includes(messageData.category)) {
      errors.push('Invalid category');
    }

    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (messageData.priority && !validPriorities.includes(messageData.priority)) {
      errors.push('Invalid priority');
    }

    if (messageData.expiryDate && new Date(messageData.expiryDate) <= new Date()) {
      errors.push('Expiry date must be in the future');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new MessageService();
