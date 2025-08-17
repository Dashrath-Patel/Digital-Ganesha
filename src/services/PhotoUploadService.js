import { API_BASE_URL } from '../config';

class PhotoUploadService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/mediakit`;
  }

  /**
   * Map user-friendly category names to backend enum values
   * @param {string} userCategory - User-friendly category name
   * @returns {string} - Backend enum value
   */
  mapCategoryToBackend(userCategory) {
    const categoryMap = {
      'Festivals': 'festivals',
      'Community Events': 'community-events',
      'Volunteers': 'volunteers',
      'Behind the Scenes': 'behind-the-scenes',
      'Cultural Activities': 'cultural-activities',
      'Worship': 'worship'
    };
    
    return categoryMap[userCategory] || userCategory.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Map backend category values to user-friendly names
   * @param {string} backendCategory - Backend category value
   * @returns {string} - User-friendly category name
   */
  mapCategoryToFrontend(backendCategory) {
    const categoryMap = {
      'festivals': 'Festivals',
      'community-events': 'Community Events',
      'volunteers': 'Volunteers',
      'behind-the-scenes': 'Behind the Scenes',
      'cultural-activities': 'Cultural Activities',
      'worship': 'Worship',
      'festival-photos': 'Festivals',
      'promotional': 'Promotional',
      'social': 'Social',
      'other': 'Other'
    };
    
    return categoryMap[backendCategory] || backendCategory.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  /**
   * Upload a single photo to ImageKit and save to database
   * @param {File} file - The image file to upload
   * @param {Object} metadata - Photo metadata (title, category, etc.)
   * @returns {Promise<Object>} - Upload result
   */
  async uploadPhoto(file, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add metadata with category mapping
      if (metadata.title) formData.append('title', metadata.title);
      if (metadata.category) formData.append('category', this.mapCategoryToBackend(metadata.category));
      if (metadata.description) formData.append('description', metadata.description);
      if (metadata.tags) formData.append('tags', Array.isArray(metadata.tags) ? metadata.tags.join(',') : metadata.tags);
      if (metadata.folder) formData.append('folder', metadata.folder);
      if (metadata.isPublic !== undefined) formData.append('isPublic', metadata.isPublic);
      if (metadata.mandal) formData.append('mandal', metadata.mandal);
      if (metadata.event) formData.append('event', metadata.event);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Photo upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Upload multiple photos to ImageKit
   * @param {FileList|Array} files - Array of image files
   * @param {Object} metadata - Common metadata for all photos
   * @returns {Promise<Object>} - Upload result
   */
  async uploadMultiplePhotos(files, metadata = {}) {
    try {
      const formData = new FormData();
      
      // Add all files
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      
      // Add metadata
      if (metadata.category) formData.append('category', metadata.category);
      if (metadata.folder) formData.append('folder', metadata.folder);
      if (metadata.tags) formData.append('tags', Array.isArray(metadata.tags) ? metadata.tags.join(',') : metadata.tags);
      if (metadata.isPublic !== undefined) formData.append('isPublic', metadata.isPublic);
      if (metadata.mandal) formData.append('mandal', metadata.mandal);
      if (metadata.event) formData.append('event', metadata.event);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/upload-multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Multiple photos upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all media items with pagination and filtering
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Media list result
   */
  async getMediaList(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('skip', (params.page - 1) * (params.limit || 20));
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', this.mapCategoryToBackend(params.category));
      if (params.type) queryParams.append('type', params.type);
      if (params.isPublic !== undefined) queryParams.append('isPublic', params.isPublic);
      if (params.uploadedBy) queryParams.append('uploadedBy', params.uploadedBy);
      if (params.mandal) queryParams.append('mandal', params.mandal);
      if (params.search) queryParams.append('search', params.search);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch media');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Get media list error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update media metadata
   * @param {string} mediaId - Media ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Update result
   */
  async updateMedia(mediaId, updateData) {
    try {
      // Map category if provided
      if (updateData.category) {
        updateData.category = this.mapCategoryToBackend(updateData.category);
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/${mediaId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Update failed');
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Update media error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete media from ImageKit and database
   * @param {string} mediaId - Media ID
   * @returns {Promise<Object>} - Delete result
   */
  async deleteMedia(mediaId) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/${mediaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Delete failed');
      }

      return {
        success: true,
        message: result.message
      };
    } catch (error) {
      console.error('Delete media error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get a single media item by ID
   * @param {string} mediaId - Media ID
   * @returns {Promise<Object>} - Media item result
   */
  async getMediaById(mediaId) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/${mediaId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch media');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Get media by ID error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Increment view count for a media item
   * @param {string} mediaId - Media ID
   * @returns {Promise<Object>} - Update result
   */
  async incrementViews(mediaId) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/${mediaId}/view`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to increment views');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Increment views error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new PhotoUploadService();
