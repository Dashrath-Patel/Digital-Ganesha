import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import MediaService from '../services/MediaService.js';
import { authenticateToken } from '../middleware/auth.js';
import Media from '../models/Media.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only images, videos, and audio files are allowed.'), false)
    }
  }
})

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (buffer, filename, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: `ganesh-web/${folder}`,
        public_id: filename,
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )
    uploadStream.end(buffer)
  })
}

// @desc    Upload media files
// @route   POST /api/media/upload
// @access  Private
router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      tags,
      mandal,
      event,
      isPublic = true
    } = req.body

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      })
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      })
    }

    const uploadedFiles = []
    const errors = []

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i]

      try {
        // Determine file type
        let type = 'document'
        if (file.mimetype.startsWith('image/')) type = 'image'
        else if (file.mimetype.startsWith('video/')) type = 'video'
        else if (file.mimetype.startsWith('audio/')) type = 'audio'

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const filename = `${timestamp}-${randomString}`

        // Determine folder based on category
        let folder = 'general'
        if (category.includes('profile')) folder = 'profiles'
        else if (category.includes('mandal')) folder = 'mandals'
        else if (category.includes('event')) folder = 'events'
        else if (category.includes('festival')) folder = 'festivals'

        // Upload to Cloudinary
        const resourceType = type === 'image' ? 'image' : type === 'video' ? 'video' : 'raw'
        const uploadResult = await uploadToCloudinary(file.buffer, filename, folder, resourceType)

        // Create media document
        const mediaData = {
          originalName: file.originalname,
          filename,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          mimeType: file.mimetype,
          size: file.size,
          type,
          category,
          uploadedBy: req.user?.id || new mongoose.Types.ObjectId(), // Fallback for testing
          title: title || file.originalname,
          description,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          mandal: mandal || null,
          event: event || null,
          isPublic: isPublic === 'true' || isPublic === true
        }

        // Add dimensions for images
        if (type === 'image' && uploadResult.width && uploadResult.height) {
          mediaData.dimensions = {
            width: uploadResult.width,
            height: uploadResult.height
          }
        }

        // Add duration for videos/audio
        if ((type === 'video' || type === 'audio') && uploadResult.duration) {
          mediaData.duration = uploadResult.duration
        }

        const media = new Media(mediaData)
        await media.save()

        uploadedFiles.push(media)

      } catch (fileError) {
        console.error('File upload error:', fileError)
        errors.push({
          filename: file.originalname,
          error: fileError.message
        })
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      data: {
        files: uploadedFiles,
        errors: errors.length > 0 ? errors : undefined
      }
    })

  } catch (error) {
    console.error('Upload media error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while uploading media'
    })
  }
})

// @desc    Get media files with filtering
// @route   GET /api/media
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      type,
      category,
      mandal,
      event,
      uploadedBy,
      isPublic,
      search,
      limit = 20,
      skip = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const searchQuery = {}

    // Type filter
    if (type) {
      searchQuery.type = type
    }

    // Category filter
    if (category) {
      searchQuery.category = category
    }

    // Context filters
    if (mandal) {
      searchQuery.mandal = mandal
    }
    if (event) {
      searchQuery.event = event
    }
    if (uploadedBy) {
      searchQuery.uploadedBy = uploadedBy
    }

    // Public filter
    if (isPublic !== undefined) {
      searchQuery.isPublic = isPublic === 'true'
    }

    // Text search
    if (search) {
      searchQuery.$text = { $search: search }
    }

    // Sort options
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1

    const media = await Media.find(searchQuery)
      .populate('uploadedBy', 'firstName lastName avatar role isCommitteeMember committeeRole')
      .populate('mandal', 'name logo')
      .populate('event', 'title startDate')
      .select('-comments') // Exclude comments for list view
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    const total = await Media.countDocuments(searchQuery)

    res.json({
      success: true,
      data: {
        media,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get media error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching media'
    })
  }
})

// @desc    Get media by ID
// @route   GET /api/media/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const media = await Media.findById(id)
      .populate('uploadedBy', 'firstName lastName avatar role isCommitteeMember committeeRole')
      .populate('mandal', 'name logo')
      .populate('event', 'title startDate')
      .populate('comments.userId', 'firstName lastName avatar')
      .populate('likes.userId', 'firstName lastName avatar')

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      })
    }

    // Increment view count
    media.stats.views += 1
    await media.save()

    res.json({
      success: true,
      data: {
        media
      }
    })

  } catch (error) {
    console.error('Get media error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching media'
    })
  }
})

// @desc    Update media
// @route   PUT /api/media/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Media update endpoint - Implementation pending'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Media deletion endpoint - Implementation pending'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Like/Unlike media
// @route   POST /api/media/:id/like
// @access  Private
router.post('/:id/like', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Media like endpoint - Implementation pending'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Add comment to media
// @route   POST /api/media/:id/comment
// @access  Private
router.post('/:id/comment', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Media comment endpoint - Implementation pending'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

export default router
