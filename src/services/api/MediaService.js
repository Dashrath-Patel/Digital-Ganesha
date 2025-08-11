/**
 * Media service for handling file uploads, images, videos, and media management
 * Supports multiple file types and provides optimization features
 */

import { ApiService } from './ApiService.js'

class MediaServiceClass {
  constructor() {
    this.endpoints = {
      upload: '/media/upload',
      gallery: '/media/gallery',
      delete: '/media/delete',
      optimize: '/media/optimize'
    }
    
    this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    this.allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
    this.maxImageSize = 10 * 1024 * 1024 // 10MB
    this.maxVideoSize = 100 * 1024 * 1024 // 100MB
  }

  // Validate file before upload
  validateFile(file, type = 'image') {
    const errors = []
    
    if (!file) {
      errors.push('No file selected')
      return errors
    }
    
    // Check file type
    const allowedTypes = type === 'image' ? this.allowedImageTypes : this.allowedVideoTypes
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`)
    }
    
    // Check file size
    const maxSize = type === 'image' ? this.maxImageSize : this.maxVideoSize
    if (file.size > maxSize) {
      errors.push(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`)
    }
    
    return errors
  }

  // Upload single file
  async uploadFile(file, options = {}) {
    try {
      // Validate file
      const fileType = file.type.startsWith('image/') ? 'image' : 'video'
      const validationErrors = this.validateFile(file, fileType)
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '))
      }
      
      // Prepare form data
      const formData = new FormData()
      formData.append('file', file)
      
      // Add optional metadata
      if (options.caption) formData.append('caption', options.caption)
      if (options.tags) formData.append('tags', JSON.stringify(options.tags))
      if (options.category) formData.append('category', options.category)
      if (options.visibility) formData.append('visibility', options.visibility)
      
      // Upload with progress tracking
      return await this.uploadWithProgress(formData, options.onProgress)
    } catch (error) {
      console.error('Upload file error:', error)
      throw error
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, options = {}) {
    try {
      const uploads = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileOptions = {
          ...options,
          onProgress: options.onProgress ? 
            (progress) => options.onProgress(i, progress, files.length) : 
            undefined
        }
        
        uploads.push(this.uploadFile(file, fileOptions))
      }
      
      return await Promise.all(uploads)
    } catch (error) {
      console.error('Upload multiple files error:', error)
      throw error
    }
  }

  // Upload with progress tracking
  async uploadWithProgress(formData, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100
            onProgress(percentComplete)
          }
        })
      }
      
      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch {
            resolve(xhr.responseText)
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`))
        }
      })
      
      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed: Network error'))
      })
      
      // Set headers and send
      const token = ApiService.getAuthToken()
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
      
      xhr.open('POST', `${ApiService.baseURL}${this.endpoints.upload}`)
      xhr.send(formData)
    })
  }

  // Get user's media gallery
  async getGallery(page = 1, limit = 20, filters = {}) {
    try {
      const params = {
        page,
        limit,
        ...filters
      }
      
      return await ApiService.get(this.endpoints.gallery, params)
    } catch (error) {
      console.error('Get gallery error:', error)
      throw error
    }
  }

  // Get media by ID
  async getMediaById(id) {
    try {
      return await ApiService.get(`/media/${id}`)
    } catch (error) {
      console.error('Get media by ID error:', error)
      throw error
    }
  }

  // Update media metadata
  async updateMedia(id, metadata) {
    try {
      return await ApiService.put(`/media/${id}`, metadata)
    } catch (error) {
      console.error('Update media error:', error)
      throw error
    }
  }

  // Delete media
  async deleteMedia(id) {
    try {
      return await ApiService.delete(`/media/${id}`)
    } catch (error) {
      console.error('Delete media error:', error)
      throw error
    }
  }

  // Optimize image (resize, compress, format conversion)
  async optimizeImage(id, options = {}) {
    try {
      const optimizationOptions = {
        width: options.width,
        height: options.height,
        quality: options.quality || 80,
        format: options.format || 'webp'
      }
      
      return await ApiService.post(`/media/${id}/optimize`, optimizationOptions)
    } catch (error) {
      console.error('Optimize image error:', error)
      throw error
    }
  }

  // Generate thumbnails
  async generateThumbnails(id, sizes = ['small', 'medium', 'large']) {
    try {
      return await ApiService.post(`/media/${id}/thumbnails`, { sizes })
    } catch (error) {
      console.error('Generate thumbnails error:', error)
      throw error
    }
  }

  // Client-side image preprocessing
  async preprocessImage(file, options = {}) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        try {
          // Calculate new dimensions
          const maxWidth = options.maxWidth || 1920
          const maxHeight = options.maxHeight || 1080
          const quality = options.quality || 0.8
          
          let { width, height } = img
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
          
          // Set canvas size and draw image
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          
          // Convert to blob
          canvas.toBlob(
            (blob) => {
              const processedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(processedFile)
            },
            file.type,
            quality
          )
        } catch (error) {
          reject(error)
        }
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Extract video metadata
  async extractVideoMetadata(file) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      
      video.onloadedmetadata = () => {
        const metadata = {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          size: file.size,
          type: file.type
        }
        
        URL.revokeObjectURL(video.src)
        resolve(metadata)
      }
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        reject(new Error('Failed to load video metadata'))
      }
      
      video.src = URL.createObjectURL(file)
    })
  }

  // Generate video thumbnail
  async generateVideoThumbnail(file, timeInSeconds = 1) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      video.onloadeddata = () => {
        video.currentTime = timeInSeconds
      }
      
      video.onseeked = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)
        
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(video.src)
          resolve(blob)
        }, 'image/jpeg', 0.8)
      }
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        reject(new Error('Failed to generate video thumbnail'))
      }
      
      video.src = URL.createObjectURL(file)
    })
  }

  // Bulk operations
  async bulkDelete(mediaIds) {
    try {
      return await ApiService.post('/media/bulk-delete', { ids: mediaIds })
    } catch (error) {
      console.error('Bulk delete error:', error)
      throw error
    }
  }

  async bulkUpdateTags(mediaIds, tags) {
    try {
      return await ApiService.post('/media/bulk-update-tags', { 
        ids: mediaIds, 
        tags 
      })
    } catch (error) {
      console.error('Bulk update tags error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const MediaService = new MediaServiceClass()
export default MediaService
