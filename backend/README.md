# Ganesh Community Backend

A comprehensive Node.js/Express backend API for the Ganesh Community Platform with MongoDB integration, real-time features, and authentication.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (User, Moderator, Admin, Super-Admin)
  - Password reset and email verification
  - Account security with login attempt limiting

- **User Management**
  - Complete user profiles with preferences
  - Location-based features and geospatial queries
  - Social features and community connections
  - Push notification support (FCM)

- **Mandal Management**
  - Create and manage religious mandals
  - Member management with role hierarchies
  - Financial tracking (donations, expenses)
  - Event organization and management

- **Real-time Features**
  - Socket.IO for live chat and updates
  - WebRTC signaling for video calls
  - Live event updates and notifications
  - Typing indicators and user presence

- **Media Handling**
  - File upload with Cloudinary integration
  - Image/video processing and compression
  - Gallery management for mandals and events

- **Security**
  - Rate limiting and DDoS protection
  - Input validation and sanitization
  - CORS configuration
  - Helmet.js security headers

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Redis (optional, for caching)
- Cloudinary account (for media storage)
- Gmail account (for email services)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ganesh_community
   JWT_SECRET=your_super_secret_jwt_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using MongoDB Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Global error handling
│   └── notFound.js          # 404 handler
├── models/
│   ├── User.js              # User model with authentication
│   ├── Mandal.js            # Mandal/Temple model
│   ├── Event.js             # Event model
│   ├── Media.js             # Media/File model
│   └── Notification.js      # Notification model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management routes
│   ├── mandals.js           # Mandal CRUD routes
│   ├── events.js            # Event management routes
│   ├── media.js             # File upload routes
│   ├── notifications.js     # Notification routes
│   └── analytics.js         # Analytics and reporting
├── socket/
│   └── socketHandlers.js    # Socket.IO event handlers
├── utils/
│   ├── email.js             # Email service with templates
│   ├── cloudinary.js        # Cloudinary configuration
│   └── helpers.js           # Utility functions
├── scripts/
│   └── seedData.js          # Database seeding script
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
└── server.js                # Main application entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users
- `DELETE /api/users/account` - Delete user account

### Mandals
- `GET /api/mandals` - Get all mandals
- `POST /api/mandals` - Create new mandal
- `GET /api/mandals/:id` - Get mandal by ID
- `PUT /api/mandals/:id` - Update mandal
- `DELETE /api/mandals/:id` - Delete mandal
- `GET /api/mandals/search` - Search mandals
- `GET /api/mandals/nearby` - Get nearby mandals

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

## 🔐 Authentication

The API uses JWT tokens for authentication:

1. **Access Token**: Short-lived (7 days) for API access
2. **Refresh Token**: Long-lived (30 days) for token renewal

Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## 🌐 Socket.IO Events

### Client to Server
- `join_mandal` - Join mandal chat room
- `leave_mandal` - Leave mandal chat room
- `send_message` - Send chat message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

### Server to Client
- `new_message` - Receive new chat message
- `user_typing` - User started typing
- `user_stopped_typing` - User stopped typing
- `new_notification` - Receive new notification
- `live_event_update` - Receive live event updates

## 🔧 Configuration

### MongoDB Indexes
The application automatically creates the following indexes:
- User email (unique)
- User location (geospatial)
- Mandal location (geospatial)
- Event date and status

### Rate Limiting
- Authentication endpoints: 5 requests per 15 minutes
- General API: 100 requests per 15 minutes
- Login endpoint: 10 requests per 15 minutes

### File Upload Limits
- Maximum file size: 10MB
- Supported image formats: JPEG, PNG, GIF, WebP
- Supported video formats: MP4, WebM, OGG

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure MongoDB Atlas or production MongoDB
4. Set up Redis for session storage
5. Configure proper CORS origins
6. Set up SSL certificates
7. Use PM2 for process management

### Docker Deployment
```bash
# Build image
docker build -t ganesh-backend .

# Run container
docker run -d -p 5000:5000 --env-file .env ganesh-backend
```

## 🔍 Monitoring

- Health check endpoint: `GET /health`
- API documentation: `GET /api/docs`
- Real-time logging with Morgan
- Error tracking and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Express.js and MongoDB
- Authentication powered by JWT
- Real-time features with Socket.IO
- File storage with Cloudinary
- Email services with Nodemailer

---

**May Lord Ganesha bless this project! 🙏**
