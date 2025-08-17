// ImageKit Service for Frontend
class ImageKitService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        this.imagekitURL = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
    }

    /**
     * Upload single file
     * @param {File} file - File object from input
     * @param {Object} options - Upload options
     * @returns {Promise} Upload response
     */
    async uploadFile(file, options = {}) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            // Add optional parameters
            if (options.folder) formData.append('folder', options.folder);
            if (options.tags) formData.append('tags', options.tags.join(','));
            if (options.category) formData.append('category', options.category);
            if (options.title) formData.append('title', options.title);
            if (options.description) formData.append('description', options.description);
            if (options.isPublic !== undefined) formData.append('isPublic', options.isPublic);
            if (options.mandal) formData.append('mandal', options.mandal);
            if (options.event) formData.append('event', options.event);

            const token = localStorage.getItem('token');
            const response = await fetch(`${this.baseURL}/mediakit/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            return await response.json();
        } catch (error) {
            console.error('Upload error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Upload multiple files
     * @param {FileList} files - Files from input
     * @param {Object} options - Upload options
     * @returns {Promise} Upload response
     */
    async uploadMultipleFiles(files, options = {}) {
        try {
            const formData = new FormData();
            
            // Add all files
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });
            
            // Add optional parameters
            if (options.folder) formData.append('folder', options.folder);
            if (options.tags) formData.append('tags', options.tags.join(','));
            if (options.category) formData.append('category', options.category);
            if (options.isPublic !== undefined) formData.append('isPublic', options.isPublic);
            if (options.mandal) formData.append('mandal', options.mandal);
            if (options.event) formData.append('event', options.event);

            const token = localStorage.getItem('token');
            const response = await fetch(`${this.baseURL}/mediakit/upload-multiple`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            return await response.json();
        } catch (error) {
            console.error('Multiple upload error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete file
     * @param {String} mediaId - Database media ID
     * @returns {Promise} Delete response
     */
    async deleteFile(mediaId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.baseURL}/mediakit/${mediaId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Delete error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get media details
     * @param {String} mediaId - Database media ID
     * @returns {Promise} Media details
     */
    async getMediaDetails(mediaId) {
        try {
            const response = await fetch(`${this.baseURL}/mediakit/${mediaId}`);
            return await response.json();
        } catch (error) {
            console.error('Get media details error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * List media files
     * @param {Object} filters - Filter options
     * @returns {Promise} List of media files
     */
    async listMedia(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== null) {
                    queryParams.append(key, filters[key]);
                }
            });

            const response = await fetch(`${this.baseURL}/mediakit?${queryParams.toString()}`);
            return await response.json();
        } catch (error) {
            console.error('List media error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate transformed image URL
     * @param {String} imagePath - Image path from ImageKit
     * @param {Object} transformations - Transformation options
     * @returns {Promise} Transformed URL
     */
    async generateTransformedURL(imagePath, transformations = {}) {
        try {
            const response = await fetch(`${this.baseURL}/mediakit/generate-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imagePath,
                    transformations
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Generate URL error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Helper method to get optimized image URL
     * @param {String} originalURL - Original ImageKit URL
     * @param {Object} options - Optimization options
     * @returns {String} Optimized URL
     */
    getOptimizedImageURL(originalURL, options = {}) {
        if (!originalURL) return '';

        const {
            width,
            height,
            quality = 80,
            format = 'auto',
            crop = 'maintain_ratio',
            focus = 'auto'
        } = options;

        // Build transformation string
        const transformations = [];
        
        if (width) transformations.push(`w-${width}`);
        if (height) transformations.push(`h-${height}`);
        if (quality) transformations.push(`q-${quality}`);
        if (format) transformations.push(`f-${format}`);
        if (crop) transformations.push(`c-${crop}`);
        if (focus) transformations.push(`fo-${focus}`);

        if (transformations.length === 0) {
            return originalURL;
        }

        // Insert transformations into URL
        const transformationString = transformations.join(',');
        
        // ImageKit URL format: https://ik.imagekit.io/your_imagekit_id/tr:transformations/path
        if (originalURL.includes('/tr:')) {
            // URL already has transformations, replace them
            return originalURL.replace(/\/tr:[^\/]+\//, `/tr:${transformationString}/`);
        } else {
            // Add transformations to URL
            const urlParts = originalURL.split('/');
            const baseIndex = urlParts.findIndex(part => part.includes('ik.imagekit.io'));
            if (baseIndex !== -1 && baseIndex + 2 < urlParts.length) {
                urlParts.splice(baseIndex + 2, 0, `tr:${transformationString}`);
                return urlParts.join('/');
            }
        }

        return originalURL;
    }

    /**
     * Validate file before upload
     * @param {File} file - File to validate
     * @param {Object} options - Validation options
     * @returns {Object} Validation result
     */
    validateFile(file, options = {}) {
        const {
            maxSize = 50 * 1024 * 1024, // 50MB
            allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/avi', 'video/mov'],
            maxImageWidth = 5000,
            maxImageHeight = 5000
        } = options;

        const errors = [];

        // Check file size
        if (file.size > maxSize) {
            errors.push(`File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`);
        }

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            errors.push('File type not supported');
        }

        // For images, check dimensions (requires creating an Image element)
        if (file.type.startsWith('image/')) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    if (img.width > maxImageWidth || img.height > maxImageHeight) {
                        errors.push(`Image dimensions exceed ${maxImageWidth}x${maxImageHeight}px limit`);
                    }
                    resolve({
                        valid: errors.length === 0,
                        errors,
                        dimensions: { width: img.width, height: img.height }
                    });
                };
                img.onerror = () => {
                    errors.push('Invalid image file');
                    resolve({
                        valid: false,
                        errors
                    });
                };
                img.src = URL.createObjectURL(file);
            });
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Get file type from file
     * @param {File} file - File object
     * @returns {String} File type ('image' or 'video')
     */
    getFileType(file) {
        if (file.type.startsWith('image/')) {
            return 'image';
        } else if (file.type.startsWith('video/')) {
            return 'video';
        }
        return 'unknown';
    }

    /**
     * Format file size for display
     * @param {Number} bytes - File size in bytes
     * @returns {String} Formatted size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export default new ImageKitService();
