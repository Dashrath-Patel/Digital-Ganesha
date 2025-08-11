/**
 * Mandal service for managing Ganesh mandal data
 * Handles CRUD operations for mandals, locations, and related data
 */

import { ApiService } from './ApiService.js'

class MandalServiceClass {
  constructor() {
    this.endpoints = {
      mandals: '/mandals',
      search: '/mandals/search',
      nearby: '/mandals/nearby',
      featured: '/mandals/featured',
      categories: '/mandals/categories',
      reviews: '/mandals/reviews',
      photos: '/mandals/photos',
      events: '/mandals/events'
    }
  }

  // Get all mandals with pagination
  async getAllMandals(page = 1, limit = 20, filters = {}) {
    try {
      const params = {
        page,
        limit,
        ...filters
      }
      
      return await ApiService.get(this.endpoints.mandals, params)
    } catch (error) {
      console.error('Get all mandals error:', error)
      throw error
    }
  }

  // Get mandal by ID
  async getMandalById(id) {
    try {
      return await ApiService.get(`${this.endpoints.mandals}/${id}`)
    } catch (error) {
      console.error('Get mandal by ID error:', error)
      throw error
    }
  }

  // Search mandals
  async searchMandals(query, filters = {}) {
    try {
      const params = {
        q: query,
        ...filters
      }
      
      return await ApiService.get(this.endpoints.search, params)
    } catch (error) {
      console.error('Search mandals error:', error)
      throw error
    }
  }

  // Get nearby mandals based on location
  async getNearbyMandals(latitude, longitude, radius = 10) {
    try {
      const params = {
        lat: latitude,
        lng: longitude,
        radius
      }
      
      return await ApiService.get(this.endpoints.nearby, params)
    } catch (error) {
      console.error('Get nearby mandals error:', error)
      throw error
    }
  }

  // Get featured mandals
  async getFeaturedMandals(limit = 10) {
    try {
      return await ApiService.get(this.endpoints.featured, { limit })
    } catch (error) {
      console.error('Get featured mandals error:', error)
      throw error
    }
  }

  // Get mandal categories
  async getCategories() {
    try {
      return await ApiService.get(this.endpoints.categories)
    } catch (error) {
      console.error('Get categories error:', error)
      throw error
    }
  }

  // Create new mandal (admin/organizer only)
  async createMandal(mandalData) {
    try {
      return await ApiService.post(this.endpoints.mandals, mandalData)
    } catch (error) {
      console.error('Create mandal error:', error)
      throw error
    }
  }

  // Update mandal (admin/organizer only)
  async updateMandal(id, mandalData) {
    try {
      return await ApiService.put(`${this.endpoints.mandals}/${id}`, mandalData)
    } catch (error) {
      console.error('Update mandal error:', error)
      throw error
    }
  }

  // Delete mandal (admin only)
  async deleteMandal(id) {
    try {
      return await ApiService.delete(`${this.endpoints.mandals}/${id}`)
    } catch (error) {
      console.error('Delete mandal error:', error)
      throw error
    }
  }

  // Get mandal reviews
  async getReviews(mandalId, page = 1, limit = 10) {
    try {
      const params = { page, limit }
      return await ApiService.get(`${this.endpoints.mandals}/${mandalId}/reviews`, params)
    } catch (error) {
      console.error('Get reviews error:', error)
      throw error
    }
  }

  // Add review for mandal
  async addReview(mandalId, reviewData) {
    try {
      return await ApiService.post(`${this.endpoints.mandals}/${mandalId}/reviews`, reviewData)
    } catch (error) {
      console.error('Add review error:', error)
      throw error
    }
  }

  // Get mandal photos
  async getPhotos(mandalId, page = 1, limit = 20) {
    try {
      const params = { page, limit }
      return await ApiService.get(`${this.endpoints.mandals}/${mandalId}/photos`, params)
    } catch (error) {
      console.error('Get photos error:', error)
      throw error
    }
  }

  // Upload photo for mandal
  async uploadPhoto(mandalId, photoFile, caption = '') {
    try {
      const formData = new FormData()
      formData.append('photo', photoFile)
      formData.append('caption', caption)
      
      return await ApiService.upload(`${this.endpoints.mandals}/${mandalId}/photos`, photoFile)
    } catch (error) {
      console.error('Upload photo error:', error)
      throw error
    }
  }

  // Get mandal events
  async getEvents(mandalId, startDate, endDate) {
    try {
      const params = {}
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      
      return await ApiService.get(`${this.endpoints.mandals}/${mandalId}/events`, params)
    } catch (error) {
      console.error('Get events error:', error)
      throw error
    }
  }

  // Add event for mandal
  async addEvent(mandalId, eventData) {
    try {
      return await ApiService.post(`${this.endpoints.mandals}/${mandalId}/events`, eventData)
    } catch (error) {
      console.error('Add event error:', error)
      throw error
    }
  }

  // Get mandal statistics
  async getStatistics(mandalId) {
    try {
      return await ApiService.get(`${this.endpoints.mandals}/${mandalId}/stats`)
    } catch (error) {
      console.error('Get statistics error:', error)
      throw error
    }
  }

  // Report mandal (for inappropriate content)
  async reportMandal(mandalId, reason, description) {
    try {
      return await ApiService.post(`${this.endpoints.mandals}/${mandalId}/report`, {
        reason,
        description
      })
    } catch (error) {
      console.error('Report mandal error:', error)
      throw error
    }
  }

  // Favorite/bookmark mandal
  async toggleFavorite(mandalId) {
    try {
      return await ApiService.post(`${this.endpoints.mandals}/${mandalId}/favorite`)
    } catch (error) {
      console.error('Toggle favorite error:', error)
      throw error
    }
  }

  // Get user's favorite mandals
  async getFavorites(page = 1, limit = 20) {
    try {
      const params = { page, limit }
      return await ApiService.get('/user/favorites', params)
    } catch (error) {
      console.error('Get favorites error:', error)
      throw error
    }
  }

  // Get mandal live status (crowd level, active events, etc.)
  async getLiveStatus(mandalId) {
    try {
      return await ApiService.get(`${this.endpoints.mandals}/${mandalId}/live-status`)
    } catch (error) {
      console.error('Get live status error:', error)
      throw error
    }
  }

  // Update crowd level (for authorized users)
  async updateCrowdLevel(mandalId, level) {
    try {
      return await ApiService.patch(`${this.endpoints.mandals}/${mandalId}/crowd-level`, {
        level
      })
    } catch (error) {
      console.error('Update crowd level error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const MandalService = new MandalServiceClass()
export default MandalService
