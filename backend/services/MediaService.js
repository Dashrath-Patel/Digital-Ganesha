import imagekit from '../config/imagekit.js';
import fs from 'fs';
import path from 'path';

class MediaService {
    
    /**
     * Upload image to ImageKit
     * @param {Buffer|String} file - File buffer or base64 string
     * @param {String} fileName - Name of the file
     * @param {String} folder - Folder path in ImageKit (optional)
     * @param {Array} tags - Array of tags for the file (optional)
     * @returns {Promise} Upload response
     */
    async uploadImage(file, fileName, folder = 'ganesha-images', tags = []) {
        try {
            const uploadOptions = {
                file: file, // Buffer or base64 string
                fileName: fileName,
                folder: folder,
                tags: tags,
                useUniqueFileName: true,
                responseFields: 'url,fileId,name,size,versionInfo,isPrivateFile,customMetadata,tags,metadata'
            };

            const response = await imagekit.upload(uploadOptions);
            return {
                success: true,
                data: {
                    fileId: response.fileId,
                    url: response.url,
                    name: response.name,
                    size: response.size,
                    tags: response.tags,
                    folder: folder
                }
            };
        } catch (error) {
            console.error('ImageKit upload error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Upload video to ImageKit
     * @param {Buffer|String} file - File buffer or base64 string
     * @param {String} fileName - Name of the file
     * @param {String} folder - Folder path in ImageKit (optional)
     * @param {Array} tags - Array of tags for the file (optional)
     * @returns {Promise} Upload response
     */
    async uploadVideo(file, fileName, folder = 'ganesha-videos', tags = []) {
        try {
            const uploadOptions = {
                file: file,
                fileName: fileName,
                folder: folder,
                tags: tags,
                useUniqueFileName: true,
                responseFields: 'url,fileId,name,size,versionInfo,isPrivateFile,customMetadata,tags,metadata'
            };

            const response = await imagekit.upload(uploadOptions);
            return {
                success: true,
                data: {
                    fileId: response.fileId,
                    url: response.url,
                    name: response.name,
                    size: response.size,
                    tags: response.tags,
                    folder: folder
                }
            };
        } catch (error) {
            console.error('ImageKit video upload error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete file from ImageKit
     * @param {String} fileId - ImageKit file ID
     * @returns {Promise} Delete response
     */
    async deleteFile(fileId) {
        try {
            await imagekit.deleteFile(fileId);
            return {
                success: true,
                message: 'File deleted successfully'
            };
        } catch (error) {
            console.error('ImageKit delete error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get file details from ImageKit
     * @param {String} fileId - ImageKit file ID
     * @returns {Promise} File details
     */
    async getFileDetails(fileId) {
        try {
            const response = await imagekit.getFileDetails(fileId);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('ImageKit get file details error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * List files from ImageKit
     * @param {Object} options - List options (limit, skip, tags, etc.)
     * @returns {Promise} List of files
     */
    async listFiles(options = {}) {
        try {
            const defaultOptions = {
                limit: 100,
                skip: 0,
                ...options
            };
            
            const response = await imagekit.listFiles(defaultOptions);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('ImageKit list files error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate transformation URL for images
     * @param {String} imagePath - Path to the image
     * @param {Object} transformations - Transformation options
     * @returns {String} Transformed image URL
     */
    generateImageURL(imagePath, transformations = {}) {
        try {
            const url = imagekit.url({
                path: imagePath,
                transformation: [transformations]
            });
            return url;
        } catch (error) {
            console.error('ImageKit URL generation error:', error);
            return null;
        }
    }

    /**
     * Upload file from local path
     * @param {String} filePath - Local file path
     * @param {String} fileName - Desired file name
     * @param {String} folder - ImageKit folder
     * @param {Array} tags - File tags
     * @returns {Promise} Upload response
     */
    async uploadFromPath(filePath, fileName, folder = 'uploads', tags = []) {
        try {
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                return {
                    success: false,
                    error: 'File not found at specified path'
                };
            }

            // Read file as buffer
            const fileBuffer = fs.readFileSync(filePath);
            const fileExtension = path.extname(filePath).toLowerCase();
            
            // Determine if it's an image or video
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
            const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
            
            if (imageExtensions.includes(fileExtension)) {
                return await this.uploadImage(fileBuffer, fileName, folder, tags);
            } else if (videoExtensions.includes(fileExtension)) {
                return await this.uploadVideo(fileBuffer, fileName, folder, tags);
            } else {
                // For other file types, treat as general upload
                return await this.uploadImage(fileBuffer, fileName, folder, tags);
            }
        } catch (error) {
            console.error('Upload from path error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new MediaService();
