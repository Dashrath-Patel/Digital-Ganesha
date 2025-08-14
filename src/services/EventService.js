import { API_BASE_URL } from '../config/index.js';

class EventService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/events`;
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

  // Get all published events for community page
  async getEvents(params = {}) {
    try {
      // Set status to 'all' by default to see all events, or use provided status
      const defaultParams = { status: 'all', ...params };
      const queryParams = new URLSearchParams(defaultParams).toString();
      const url = queryParams ? `${this.baseURL}?${queryParams}` : this.baseURL;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Return the events array from the data.data.events field
      return data.data?.events || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Get all events for admin panel
  async getAdminEvents(params = {}) {
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
      return data.data || [];
    } catch (error) {
      console.error('Error fetching admin events:', error);
      throw error;
    }
  }

  // Get single event by ID
  async getEventById(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  // Create new event (admin only)
  async createEvent(eventData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Update event (admin only)
  async updateEvent(id, eventData) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Delete event (admin only)
  async deleteEvent(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Get events by category
  async getEventsByCategory(category) {
    try {
      const response = await fetch(`${this.baseURL}/category/${category}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching events by category:', error);
      throw error;
    }
  }

  // Get upcoming events (published and future dates)
  async getUpcomingEvents() {
    try {
      const response = await fetch(`${this.baseURL}/upcoming`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  }

  // Format date for display
  formatEventDate(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', options);
    } else {
      const startStr = start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      const endStr = end.toLocaleDateString('en-US', options);
      return `${startStr} - ${endStr}`;
    }
  }

  // Get event status based on dates
  getEventStatus(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return 'upcoming';
    } else if (now >= start && now <= end) {
      return 'ongoing';
    } else {
      return 'completed';
    }
  }
}

export default new EventService();
