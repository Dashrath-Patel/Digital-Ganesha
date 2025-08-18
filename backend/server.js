import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import mandalRoutes from './routes/mandals.js'
import eventRoutes from './routes/events.js'
import mediaRoutes from './routes/media.js'
import mediakitRoutes from './routes/media_imagekit.js'
import notificationRoutes from './routes/notifications.js'
import analyticsRoutes from './routes/analytics.js'
import adminRoutes from './routes/admin.js'
import culturalRoutes from './routes/cultural.js'
import messageRoutes from './routes/messages.js'
import twoFactorAuthRoutes from './routes/twoFactorAuth.js'
import profileRoutes from './routes/profile.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import { authenticateToken } from './middleware/auth.js'

// Import socket handlers
import { initializeSocket } from './socket/socketHandlers.js'

// Import database connection
import connectDB from './config/database.js'

// Load environment variables
dotenv.config()

const app = express()
const httpServer = createServer(app)

// Trust proxy for Render deployment
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

// Initialize socket handlers
initializeSocket(io)

// Connect to MongoDB
connectDB()

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}))

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Rate limiting - More lenient limits
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // Increased to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for OPTIONS requests (CORS preflight)
    return req.method === 'OPTIONS'
  }
})

// More lenient rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 50, // Increased from 5 to 50 attempts per windowMs
  message: {
    error: 'Too many authentication attempts from this IP, please try again later.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for OPTIONS requests (CORS preflight)
    return req.method === 'OPTIONS'
  }
})

// Apply general rate limiting
app.use('/api/', limiter)

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'https://digital-ganesha.vercel.app',
      'https://digital-ganesha-ln80lcszq-dashrath-patels-projects.vercel.app',
      process.env.FRONTEND_URL,
      process.env.CORS_ORIGIN
    ].filter(Boolean) // Remove undefined values
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    
    // For development, allow all localhost origins
    if (process.env.NODE_ENV === 'development' && origin && origin.includes('localhost')) {
      return callback(null, true)
    }
    
    // For production, allow all vercel.app domains for this project
    if (process.env.NODE_ENV === 'production' && origin && 
        (origin.includes('digital-ganesha') && origin.includes('vercel.app'))) {
      return callback(null, true)
    }
    
    console.log(`CORS blocked origin: ${origin}`) // Debug log
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  exposedHeaders: ['set-cookie'],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  preflightContinue: false
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Digital Ganesha API Server',
    status: 'active',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api_docs: '/api/docs',
      api_base: '/api'
    }
  })
})

// API Routes with specific rate limiting
app.use('/api/auth', authLimiter, authRoutes) // Apply auth-specific rate limiting
app.use('/api/users', authenticateToken, userRoutes)
app.use('/api/mandals', mandalRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/media', authenticateToken, mediaRoutes)
app.use('/api/mediakit', mediakitRoutes) // ImageKit media routes
app.use('/api/notifications', authenticateToken, notificationRoutes)
app.use('/api/analytics', authenticateToken, analyticsRoutes)
app.use('/api/admin', authenticateToken, adminRoutes)
app.use('/api/cultural', culturalRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/2fa', authLimiter, twoFactorAuthRoutes) // 2FA routes for admin users
app.use('/api/profile', profileRoutes) // Profile management routes

// Serve uploaded files
app.use('/uploads', express.static('uploads'))

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Ganesh Community API',
    version: '1.0.0',
    description: 'API documentation for Ganesh Community Platform',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/logout': 'Logout user',
        'POST /api/auth/refresh': 'Refresh access token',
        'POST /api/auth/forgot-password': 'Request password reset',
        'POST /api/auth/reset-password': 'Reset password'
      },
      users: {
        'GET /api/users/profile': 'Get user profile',
        'PUT /api/users/profile': 'Update user profile',
        'GET /api/users/search': 'Search users',
        'DELETE /api/users/account': 'Delete user account'
      },
      mandals: {
        'GET /api/mandals': 'Get all mandals',
        'POST /api/mandals': 'Create new mandal',
        'GET /api/mandals/:id': 'Get mandal by ID',
        'PUT /api/mandals/:id': 'Update mandal',
        'DELETE /api/mandals/:id': 'Delete mandal',
        'GET /api/mandals/search': 'Search mandals',
        'GET /api/mandals/nearby': 'Get nearby mandals'
      },
      events: {
        'GET /api/events': 'Get all events',
        'POST /api/events': 'Create new event',
        'GET /api/events/:id': 'Get event by ID',
        'PUT /api/events/:id': 'Update event',
        'DELETE /api/events/:id': 'Delete event',
        'POST /api/events/:id/join': 'Join event',
        'POST /api/events/:id/leave': 'Leave event'
      },
      media: {
        'POST /api/media/upload': 'Upload media files',
        'GET /api/media/:id': 'Get media by ID',
        'DELETE /api/media/:id': 'Delete media'
      },
      notifications: {
        'GET /api/notifications': 'Get user notifications',
        'PUT /api/notifications/:id/read': 'Mark notification as read',
        'POST /api/notifications/subscribe': 'Subscribe to push notifications'
      },
      analytics: {
        'GET /api/analytics/dashboard': 'Get dashboard analytics',
        'GET /api/analytics/events': 'Get event analytics',
        'GET /api/analytics/users': 'Get user analytics'
      },
      admin: {
        'GET /api/admin/users': 'Get all users (Admin only)',
        'GET /api/admin/dashboard-stats': 'Get admin dashboard stats',
        'PUT /api/admin/users/:userId/role': 'Update user role',
        'PUT /api/admin/users/:userId/committee': 'Assign/remove committee member',
        'PUT /api/admin/users/:userId/status': 'Toggle user active status',
        'PUT /api/admin/users/bulk/roles': 'Bulk update user roles',
        'GET /api/admin/users/:userId/activity': 'Get user activity logs',
        'GET /api/admin/users/export': 'Export users data'
      },
      cultural: {
        'GET /api/cultural/:category': 'Get cultural content by category',
        'GET /api/cultural/item/:id': 'Get single cultural content by ID',
        'GET /api/cultural/search/:searchTerm': 'Search cultural content',
        'GET /api/cultural/featured/all': 'Get featured content',
        'GET /api/cultural/stats/overview': 'Get content statistics'
      }
    }
  })
})

// 404 handler
app.use(notFound)

// Error handling middleware
app.use(errorHandler)

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  httpServer.close(() => {
    console.log('Process terminated')
    mongoose.connection.close()
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...')
  httpServer.close(() => {
    console.log('Process terminated')
    mongoose.connection.close()
  })
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`)
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
})
