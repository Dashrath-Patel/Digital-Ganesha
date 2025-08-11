/**
 * Event service for managing festival events and activities
 * Handles event scheduling, notifications, and participation
 */

import { ApiService } from './ApiService.js'

class EventServiceClass {
  constructor() {
    this.endpoints = {
      events: '/events',
      categories: '/events/categories',
      upcoming: '/events/upcoming',
      live: '/events/live',
      participate: '/events/participate',
      calendar: '/events/calendar'
    }
  }

  // Get all events with filters
  async getAllEvents(page = 1, limit = 20, filters = {}) {
    try {
      const params = {
        page,
        limit,
        ...filters
      }
      
      return await ApiService.get(this.endpoints.events, params)
    } catch (error) {
      console.error('Get all events error:', error)
      throw error
    }
  }

  // Get event by ID
  async getEventById(id) {
    try {
      return await ApiService.get(`${this.endpoints.events}/${id}`)
    } catch (error) {
      console.error('Get event by ID error:', error)
      throw error
    }
  }

  // Get upcoming events
  async getUpcomingEvents(limit = 10, location = null) {
    try {
      const params = { limit }
      if (location) {
        params.lat = location.latitude
        params.lng = location.longitude
      }
      
      return await ApiService.get(this.endpoints.upcoming, params)
    } catch (error) {
      console.error('Get upcoming events error:', error)
      throw error
    }
  }

  // Get live events
  async getLiveEvents() {
    try {
      return await ApiService.get(this.endpoints.live)
    } catch (error) {
      console.error('Get live events error:', error)
      throw error
    }
  }

  // Get events by date range
  async getEventsByDateRange(startDate, endDate, filters = {}) {
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
        ...filters
      }
      
      return await ApiService.get(this.endpoints.events, params)
    } catch (error) {
      console.error('Get events by date range error:', error)
      throw error
    }
  }

  // Get events for calendar view
  async getCalendarEvents(year, month) {
    try {
      const params = { year, month }
      return await ApiService.get(this.endpoints.calendar, params)
    } catch (error) {
      console.error('Get calendar events error:', error)
      throw error
    }
  }

  // Get event categories
  async getEventCategories() {
    try {
      return await ApiService.get(this.endpoints.categories)
    } catch (error) {
      console.error('Get event categories error:', error)
      throw error
    }
  }

  // Create new event (organizer/admin only)
  async createEvent(eventData) {
    try {
      return await ApiService.post(this.endpoints.events, eventData)
    } catch (error) {
      console.error('Create event error:', error)
      throw error
    }
  }

  // Update event (organizer/admin only)
  async updateEvent(id, eventData) {
    try {
      return await ApiService.put(`${this.endpoints.events}/${id}`, eventData)
    } catch (error) {
      console.error('Update event error:', error)
      throw error
    }
  }

  // Delete event (organizer/admin only)
  async deleteEvent(id) {
    try {
      return await ApiService.delete(`${this.endpoints.events}/${id}`)
    } catch (error) {
      console.error('Delete event error:', error)
      throw error
    }
  }

  // Join/participate in event
  async joinEvent(eventId, participationData = {}) {
    try {
      return await ApiService.post(`${this.endpoints.events}/${eventId}/join`, participationData)
    } catch (error) {
      console.error('Join event error:', error)
      throw error
    }
  }

  // Leave event
  async leaveEvent(eventId) {
    try {
      return await ApiService.delete(`${this.endpoints.events}/${eventId}/join`)
    } catch (error) {
      console.error('Leave event error:', error)
      throw error
    }
  }

  // Get event participants
  async getParticipants(eventId, page = 1, limit = 50) {
    try {
      const params = { page, limit }
      return await ApiService.get(`${this.endpoints.events}/${eventId}/participants`, params)
    } catch (error) {
      console.error('Get participants error:', error)
      throw error
    }
  }

  // Get user's registered events
  async getUserEvents(status = 'all', page = 1, limit = 20) {
    try {
      const params = { status, page, limit }
      return await ApiService.get('/user/events', params)
    } catch (error) {
      console.error('Get user events error:', error)
      throw error
    }
  }

  // Search events
  async searchEvents(query, filters = {}) {
    try {
      const params = {
        q: query,
        ...filters
      }
      
      return await ApiService.get(`${this.endpoints.events}/search`, params)
    } catch (error) {
      console.error('Search events error:', error)
      throw error
    }
  }

  // Get event statistics
  async getEventStats(eventId) {
    try {
      return await ApiService.get(`${this.endpoints.events}/${eventId}/stats`)
    } catch (error) {
      console.error('Get event stats error:', error)
      throw error
    }
  }

  // Share event
  async shareEvent(eventId, platform, message = '') {
    try {
      return await ApiService.post(`${this.endpoints.events}/${eventId}/share`, {
        platform,
        message
      })
    } catch (error) {
      console.error('Share event error:', error)
      throw error
    }
  }

  // Report event
  async reportEvent(eventId, reason, description) {
    try {
      return await ApiService.post(`${this.endpoints.events}/${eventId}/report`, {
        reason,
        description
      })
    } catch (error) {
      console.error('Report event error:', error)
      throw error
    }
  }

  // Get event reminders
  async getReminders(eventId) {
    try {
      return await ApiService.get(`${this.endpoints.events}/${eventId}/reminders`)
    } catch (error) {
      console.error('Get reminders error:', error)
      throw error
    }
  }

  // Set event reminder
  async setReminder(eventId, reminderTime) {
    try {
      return await ApiService.post(`${this.endpoints.events}/${eventId}/reminders`, {
        reminder_time: reminderTime
      })
    } catch (error) {
      console.error('Set reminder error:', error)
      throw error
    }
  }

  // Cancel event reminder
  async cancelReminder(eventId, reminderId) {
    try {
      return await ApiService.delete(`${this.endpoints.events}/${eventId}/reminders/${reminderId}`)
    } catch (error) {
      console.error('Cancel reminder error:', error)
      throw error
    }
  }

  // Get event live stream info
  async getLiveStreamInfo(eventId) {
    try {
      return await ApiService.get(`${this.endpoints.events}/${eventId}/live-stream`)
    } catch (error) {
      console.error('Get live stream info error:', error)
      throw error
    }
  }

  // Start live stream (organizer only)
  async startLiveStream(eventId, streamData) {
    try {
      return await ApiService.post(`${this.endpoints.events}/${eventId}/live-stream`, streamData)
    } catch (error) {
      console.error('Start live stream error:', error)
      throw error
    }
  }

  // End live stream (organizer only)
  async endLiveStream(eventId) {
    try {
      return await ApiService.delete(`${this.endpoints.events}/${eventId}/live-stream`)
    } catch (error) {
      console.error('End live stream error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const EventService = new EventServiceClass()
export default EventService
