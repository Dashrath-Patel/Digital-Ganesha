import express from 'express';
import multer from 'multer';
import MediaService from '../services/MediaService.js';
import { authenticateToken } from '../middleware/auth.js';
import Media from '../models/Media.js';

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

// Gallery-specific multer configuration for stricter validation
const galleryUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit for gallery
    },
    fileFilter: (req, file, cb) => {
        // Only allow specific image types for gallery
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png';

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only JPEG, JPG, and PNG formats are allowed for gallery photos!'));
        }
    }
});

// @route   POST /api/media/gallery/upload
// @desc    Upload gallery photos with category management
// @access  Admin only
router.post('/gallery/upload', authenticateToken, galleryUpload.array('photos', 10), async (req, res) => {
    console.log('Gallery upload request received');
    console.log('User info:', req.user);
    console.log('Files received:', req.files?.length || 0);
    console.log('Category:', req.body.category);
    
    try {
        // Check if user is admin
        if (!req.user.isAdmin && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const { category } = req.body;
        
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Category is required'
            });
        }

        const allowedCategories = ['ganesh-chaturthi', 'community-volunteers', 'cultural-programs'];
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        // Check category photo limit
        const existingPhotos = await Media.find({
            tags: { $in: [`gallery:${category}`] }
        }).countDocuments();

        const MAX_PHOTOS_PER_CATEGORY = 20;
        if (existingPhotos + req.files.length > MAX_PHOTOS_PER_CATEGORY) {
            return res.status(400).json({
                success: false,
                message: `Cannot upload ${req.files.length} files. Category limit is ${MAX_PHOTOS_PER_CATEGORY} photos. Current: ${existingPhotos}`
            });
        }

        const uploadResults = [];
        const errors = [];

        for (const file of req.files) {
            try {
                const fileName = `gallery-${category}-${Date.now()}-${file.originalname}`;
                const folder = `/gallery/${category}`;
                const tags = [`gallery:${category}`, 'community-gallery'];

                // Upload to ImageKit
                const uploadResult = await MediaService.uploadImage(
                    file.buffer,
                    fileName,
                    folder,
                    tags
                );

                if (!uploadResult.success) {
                    errors.push(`Failed to upload ${file.originalname}: ${uploadResult.error}`);
                    continue;
                }

                // Save to database
                const mediaDoc = new Media({
                    title: file.originalname.replace(/\.[^/.]+$/, ""), // Remove extension from title
                    originalName: file.originalname,
                    filename: uploadResult.data.name,
                    url: uploadResult.data.url,
                    fileId: uploadResult.data.fileId,
                    mimeType: file.mimetype,
                    size: file.size,
                    type: 'image',
                    category: 'event-gallery', // Using an existing category from the enum
                    tags: [`gallery:${category}`, 'community-gallery', category],
                    uploadedBy: req.user.userId,
                    isPublic: true
                });

                console.log('About to save media doc:', {
                    title: mediaDoc.title,
                    fileId: mediaDoc.fileId,
                    url: mediaDoc.url,
                    tags: mediaDoc.tags,
                    uploadedBy: mediaDoc.uploadedBy
                });

                const savedMedia = await mediaDoc.save();
                console.log('Media saved successfully:', savedMedia._id);
                uploadResults.push({
                    fileId: uploadResult.data.fileId,
                    url: uploadResult.data.url,
                    fileName: file.originalname
                });

            } catch (error) {
                console.error(`Failed to upload ${file.originalname}:`, error);
                errors.push({
                    fileName: file.originalname,
                    error: error.message
                });
            }
        }

        res.json({
            success: true,
            message: `Successfully uploaded ${uploadResults.length} photo(s) to ${category}`,
            data: {
                uploaded: uploadResults,
                errors: errors,
                category: category,
                total: uploadResults.length
            }
        });

    } catch (error) {
        console.error('Gallery upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Gallery upload failed',
            error: error.message
        });
    }
});

// @route   GET /api/media/gallery/:category
// @desc    Get gallery photos by category
// @access  Public
router.get('/gallery/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { limit = 20, skip = 0 } = req.query;

        const allowedCategories = ['ganesh-chaturthi', 'community-volunteers', 'cultural-programs'];
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        console.log(`Fetching gallery photos for category: ${category}, limit: ${limit}, skip: ${skip}`);

        const photos = await Media.find({
            tags: { $in: [`gallery:${category}`] }
        })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .select('title fileId filename url createdAt uploadedBy tags');

        console.log(`Found ${photos.length} photos for category ${category}`);
        console.log('Sample photo data:', photos[0] || 'No photos found');

        const total = await Media.find({
            tags: { $in: [`gallery:${category}`] }
        }).countDocuments();

        res.json({
            success: true,
            data: {
                photos,
                category,
                total,
                page: Math.floor(skip / limit) + 1,
                hasMore: skip + photos.length < total
            }
        });

    } catch (error) {
        console.error('Gallery fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch gallery photos',
            error: error.message
        });
    }
});

// @route   DELETE /api/media/gallery/:fileId
// @desc    Delete gallery photo
// @access  Admin only
router.delete('/gallery/:fileId', authenticateToken, async (req, res) => {
    try {
        console.log('Delete request received for fileId:', req.params.fileId);
        console.log('User info:', req.user);
        
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const { fileId } = req.params;

        // Find the media document
        const media = await Media.findOne({ fileId });
        if (!media) {
            console.log('Media not found in database for fileId:', fileId);
            return res.status(404).json({
                success: false,
                message: 'Photo not found'
            });
        }

        console.log('Found media document:', media._id);

        // Delete from ImageKit
        try {
            await MediaService.deleteFile(fileId);
            console.log('Deleted from ImageKit successfully');
        } catch (imagekitError) {
            console.error('ImageKit delete failed:', imagekitError);
            // Continue with database deletion even if ImageKit fails
        }

        // Delete from database (hard delete)
        await Media.findByIdAndDelete(media._id);
        console.log('Deleted from database successfully');

        res.json({
            success: true,
            message: 'Photo deleted successfully',
            data: { fileId }
        });

    } catch (error) {
        console.error('Gallery delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete photo',
            error: error.message
        });
    }
});

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
