import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  
  // Profile Information
  avatar: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  
  // Social Login IDs
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allow multiple null values
  },
  
  phone: {
    type: String,
    trim: true,
    match: [/^[+]?[1-9][\d]{9,14}$/, 'Please enter a valid phone number']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  
  // Location Information
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  
  // Community Information
  mandals: [{
    mandalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mandal'
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  interests: [{
    type: String,
    enum: [
      'festivals', 'rituals', 'music', 'dance', 'art', 'cooking',
      'volunteering', 'photography', 'decoration', 'organizing',
      'spiritual-discussion', 'cultural-events', 'community-service'
    ]
  }],
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    select: false
  },
  emailVerifiedAt: {
    type: Date
  },
  
  // Security
  refreshTokens: [{
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 2592000 // 30 days
    }
  }],
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  
  // Preferences
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
      },
      showLocation: {
        type: Boolean,
        default: false
      },
      showPhone: {
        type: Boolean,
        default: false
      }
    },
    language: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  },
  
  // Statistics
  stats: {
    eventsAttended: {
      type: Number,
      default: 0
    },
    eventsOrganized: {
      type: Number,
      default: 0
    },
    contributionsCount: {
      type: Number,
      default: 0
    },
    reputationScore: {
      type: Number,
      default: 0
    }
  },
  
  // Admin fields
  role: {
    type: String,
    enum: ['user', 'committee_member', 'admin'],
    default: 'user'
  },
  permissions: [{
    type: String
  }],
  
  // Committee fields
  isCommitteeMember: {
    type: Boolean,
    default: false
  },
  committeeRole: {
    type: String,
    enum: ['president', 'vice_president', 'secretary', 'treasurer', 'coordinator', 'volunteer'],
    default: null
  },
  mandal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mandal',
    default: null
  },
  
  // Push notification tokens
  fcmTokens: [{
    token: String,
    device: String,
    lastUsed: {
      type: Date,
      default: Date.now
    }
  }]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// Indexes
// Note: email and username indexes are automatically created by unique: true
userSchema.index({ 'location': '2dsphere' })
userSchema.index({ 'mandals.mandalId': 1 })
userSchema.index({ createdAt: -1 })
userSchema.index({ lastLogin: -1 })

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()
  
  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12
    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
  } catch (error) {
    next(error)
  }
})

// Pre-save middleware to handle location field
userSchema.pre('save', function(next) {
  // If location exists but coordinates are not provided, remove the location field
  if (this.location && (!this.location.coordinates || this.location.coordinates.length !== 2)) {
    this.location = undefined
  }
  next()
})

// Pre-save middleware to generate username if not provided
userSchema.pre('save', function(next) {
  if (!this.username && this.email) {
    // Generate username from email
    const emailPrefix = this.email.split('@')[0]
    this.username = emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, '') + 
                   Math.floor(Math.random() * 1000)
  }
  next()
})

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  const maxAttempts = 5
  const lockTime = 2 * 60 * 60 * 1000 // 2 hours

  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    })
  }
  
  const updates = { $inc: { loginAttempts: 1 } }
  
  // Lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime }
  }
  
  return this.updateOne(updates)
}

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  })
}

// Instance method to add FCM token
userSchema.methods.addFCMToken = function(token, device) {
  // Remove existing token for this device
  this.fcmTokens = this.fcmTokens.filter(t => t.device !== device)
  
  // Add new token
  this.fcmTokens.push({
    token,
    device,
    lastUsed: new Date()
  })
  
  // Keep only last 5 tokens
  if (this.fcmTokens.length > 5) {
    this.fcmTokens = this.fcmTokens.slice(-5)
  }
  
  return this.save()
}

// Instance method to remove FCM token
userSchema.methods.removeFCMToken = function(token) {
  this.fcmTokens = this.fcmTokens.filter(t => t.token !== token)
  return this.save()
}

// Instance method to add refresh token
userSchema.methods.addRefreshToken = function(token) {
  this.refreshTokens.push({ token })
  
  // Keep only last 5 refresh tokens
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5)
  }
  
  return this.save()
}

// Instance method to remove refresh token
userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token)
  return this.save()
}

// Static method to find by credentials
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password')
  
  if (!user) {
    throw new Error('Invalid login credentials')
  }
  
  if (user.isLocked) {
    throw new Error('Account is temporarily locked due to too many failed login attempts')
  }
  
  const isMatch = await user.comparePassword(password)
  
  if (!isMatch) {
    await user.incLoginAttempts()
    throw new Error('Invalid login credentials')
  }
  
  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts()
  }
  
  // Update last login
  user.lastLogin = new Date()
  await user.save()
  
  return user
}

// Static method to find users near location
userSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: maxDistance
      }
    },
    isActive: true
  })
}

export default mongoose.model('User', userSchema)
