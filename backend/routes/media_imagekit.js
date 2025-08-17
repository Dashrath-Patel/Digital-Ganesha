import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import MediaService from '../services/MediaService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow images and videos
        const allowedTypes = /jpeg|jpg|png|gif|bmp|webp|svg|mp4|avi|mov|wmv|flv|webm|mkv/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and videos are allowed!'));
        }
    }
});

// Media Schema for database tracking
const mediaSchema = new mongoose.Schema({
    // Basic Information
    originalName: {
        type: String,
        required: [true, 'Original filename is required']
    },
    filename: {
        type: String,
        required: [true, 'Filename is required']
    },
    url: {
        type: String,
        required: [true, 'File URL is required']
    },
    fileId: {
        type: String,
        required: [true, 'ImageKit file ID is required'],
        unique: true
    },
    
    // File Details
    mimeType: {
        type: String,
        required: [true, 'MIME type is required']
    },
    size: {
        type: Number,
        required: [true, 'File size is required']
    },
    
    // Categorization
    type: {
        type: String,
        enum: ['image', 'video'],
        required: [true, 'Media type is required']
    },
    category: {
        type: String,
        enum: [
            'profile-avatar', 'profile-cover', 'mandal-logo', 'mandal-cover',
            'event-banner', 'event-gallery', 'festival-photos', 'ritual-videos',
            'promotional', 'social', 'other'
        ],
        required: [true, 'Category is required']
    },
    folder: {
        type: String,
        default: 'ganesha-uploads'
    },
    
    // Ownership & Context
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Uploader is required']
    },
    mandal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mandal'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    
    // Metadata
    title: {
        type: String,
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    tags: [String],
    
    // Access Control
    isPublic: {
        type: Boolean,
        default: true
    },
    
    // Usage Statistics
    stats: {
        views: { type: Number, default: 0 },
        downloads: { type: Number, default: 0 },
        shares: { type: Number, default: 0 }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
mediaSchema.index({ uploadedBy: 1, createdAt: -1 });
mediaSchema.index({ mandal: 1, createdAt: -1 });
mediaSchema.index({ event: 1, createdAt: -1 });
mediaSchema.index({ category: 1, type: 1 });
mediaSchema.index({ isPublic: 1, createdAt: -1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ fileId: 1 });

// Create the model
const Media = mongoose.model('Media', mediaSchema);

// @route   POST /api/media/upload
// @desc    Upload single file to ImageKit
// @access  Protected
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const { folder, tags, category, title, description, isPublic, mandal, event } = req.body;
        const fileName = req.file.originalname;
        const fileBuffer = req.file.buffer;
        
        // Parse tags if provided as string
        let fileTags = [];
        if (tags) {
            fileTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
        }

        // Determine file type
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];

        let fileType;
        let uploadResult;
        
        if (imageExtensions.includes(fileExtension)) {
            fileType = 'image';
            uploadResult = await MediaService.uploadImage(
                fileBuffer, 
                fileName, 
                folder || 'ganesha-images', 
                fileTags
            );
        } else if (videoExtensions.includes(fileExtension)) {
            fileType = 'video';
            uploadResult = await MediaService.uploadVideo(
                fileBuffer, 
                fileName, 
                folder || 'ganesha-videos', 
                fileTags
            );
        } else {
            return res.status(400).json({
                success: false,
                message: 'Unsupported file type'
            });
        }

        if (!uploadResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Upload to ImageKit failed',
                error: uploadResult.error
            });
        }

        // Save to database
        const mediaDoc = new Media({
            originalName: fileName,
            filename: uploadResult.data.name,
            url: uploadResult.data.url,
            fileId: uploadResult.data.fileId,
            mimeType: req.file.mimetype,
            size: uploadResult.data.size,
            type: fileType,
            category: category || 'other',
            folder: uploadResult.data.folder,
            uploadedBy: req.user.userId,
            mandal: mandal || null,
            event: event || null,
            title: title || '',
            description: description || '',
            tags: fileTags,
            isPublic: isPublic !== undefined ? isPublic : true
        });

        await mediaDoc.save();

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                media: mediaDoc,
                imagekit: uploadResult.data
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during upload',
            error: error.message
        });
    }
});

// @route   POST /api/media/upload-multiple
// @desc    Upload multiple files to ImageKit
// @access  Protected
router.post('/upload-multiple', authenticateToken, upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const { folder, tags, category, isPublic, mandal, event } = req.body;
        let fileTags = [];
        if (tags) {
            fileTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
        }

        const results = [];
        const errors = [];

        for (const file of req.files) {
            try {
                const fileName = file.originalname;
                const fileBuffer = file.buffer;
                const fileExtension = fileName.split('.').pop().toLowerCase();
                
                const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
                const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];

                let fileType;
                let uploadResult;

                if (imageExtensions.includes(fileExtension)) {
                    fileType = 'image';
                    uploadResult = await MediaService.uploadImage(
                        fileBuffer, 
                        fileName, 
                        folder || 'ganesha-images', 
                        fileTags
                    );
                } else if (videoExtensions.includes(fileExtension)) {
                    fileType = 'video';
                    uploadResult = await MediaService.uploadVideo(
                        fileBuffer, 
                        fileName, 
                        folder || 'ganesha-videos', 
                        fileTags
                    );
                } else {
                    errors.push(`Unsupported file type: ${fileName}`);
                    continue;
                }

                if (!uploadResult.success) {
                    errors.push(`Failed to upload ${fileName}: ${uploadResult.error}`);
                    continue;
                }

                // Save to database
                const mediaDoc = new Media({
                    originalName: fileName,
                    filename: uploadResult.data.name,
                    url: uploadResult.data.url,
                    fileId: uploadResult.data.fileId,
                    mimeType: file.mimetype,
                    size: uploadResult.data.size,
                    type: fileType,
                    category: category || 'other',
                    folder: uploadResult.data.folder,
                    uploadedBy: req.user.userId,
                    mandal: mandal || null,
                    event: event || null,
                    tags: fileTags,
                    isPublic: isPublic !== undefined ? isPublic : true
                });

                await mediaDoc.save();
                results.push(mediaDoc);

            } catch (error) {
                errors.push(`Error processing ${file.originalname}: ${error.message}`);
            }
        }

        res.status(200).json({
            success: true,
            message: `${results.length} files uploaded successfully, ${errors.length} failed`,
            data: {
                successful: results,
                errors: errors
            }
        });
    } catch (error) {
        console.error('Multiple upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during upload',
            error: error.message
        });
    }
});

// @route   DELETE /api/media/:id
// @desc    Delete file from ImageKit and database
// @access  Protected
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const mediaDoc = await Media.findById(req.params.id);
        
        if (!mediaDoc) {
            return res.status(404).json({
                success: false,
                message: 'Media not found'
            });
        }

        // Check ownership or admin privileges
        if (mediaDoc.uploadedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this media'
            });
        }

        // Delete from ImageKit
        const deleteResult = await MediaService.deleteFile(mediaDoc.fileId);
        
        if (!deleteResult.success) {
            console.error('ImageKit delete failed:', deleteResult.error);
            // Continue with database deletion even if ImageKit deletion fails
        }

        // Delete from database
        await Media.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Media deleted successfully'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during delete',
            error: error.message
        });
    }
});

// @route   GET /api/media/:id
// @desc    Get media details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const mediaDoc = await Media.findById(req.params.id)
            .populate('uploadedBy', 'name email')
            .populate('mandal', 'name')
            .populate('event', 'name');
        
        if (!mediaDoc) {
            return res.status(404).json({
                success: false,
                message: 'Media not found'
            });
        }

        // Increment view count
        mediaDoc.stats.views += 1;
        await mediaDoc.save();

        res.status(200).json({
            success: true,
            data: mediaDoc
        });
    } catch (error) {
        console.error('Get media details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/media
// @desc    List media files with filtering
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { 
            limit = 20, 
            skip = 0, 
            type, 
            category, 
            mandal, 
            event, 
            uploadedBy,
            isPublic = true,
            tags,
            search 
        } = req.query;
        
        // Build query
        const query = {};
        
        if (isPublic !== undefined) {
            query.isPublic = isPublic;
        }
        
        if (type) {
            query.type = type;
        }
        
        if (category) {
            query.category = category;
        }
        
        if (mandal) {
            query.mandal = mandal;
        }
        
        if (event) {
            query.event = event;
        }
        
        if (uploadedBy) {
            query.uploadedBy = uploadedBy;
        }
        
        if (tags) {
            query.tags = { $in: tags.split(',') };
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }
        
        const mediaFiles = await Media.find(query)
            .populate('uploadedBy', 'name email')
            .populate('mandal', 'name')
            .populate('event', 'name')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));
            
        const total = await Media.countDocuments(query);
        
        res.status(200).json({
            success: true,
            data: {
                media: mediaFiles,
                pagination: {
                    total,
                    limit: parseInt(limit),
                    skip: parseInt(skip),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('List media error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   POST /api/media/generate-url
// @desc    Generate transformed image URL
// @access  Public
router.post('/generate-url', async (req, res) => {
    try {
        const { imagePath, transformations } = req.body;
        
        if (!imagePath) {
            return res.status(400).json({
                success: false,
                message: 'Image path is required'
            });
        }
        
        const url = MediaService.generateImageURL(imagePath, transformations || {});
        
        if (url) {
            res.status(200).json({
                success: true,
                url: url
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to generate URL'
            });
        }
    } catch (error) {
        console.error('Generate URL error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

export default router;
