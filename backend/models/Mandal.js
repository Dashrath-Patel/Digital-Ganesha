import mongoose from 'mongoose'

const mandalSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Mandal name is required'],
    trim: true,
    maxlength: [100, 'Mandal name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  tagline: {
    type: String,
    maxlength: [200, 'Tagline cannot exceed 200 characters']
  },
  
  // Visual Identity
  logo: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  bannerImage: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  gallery: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    caption: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Location Information
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'India'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Location coordinates are required'],
      index: '2dsphere'
    }
  },
  
  // Contact Information
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[+]?[1-9][\d]{9,14}$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String
    }
  },
  
  // Organization Details
  establishedYear: {
    type: Number,
    min: [1800, 'Established year cannot be before 1800'],
    max: [new Date().getFullYear(), 'Established year cannot be in the future']
  },
  registrationNumber: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'residential', 'community', 'cultural', 'charitable', 
      'educational', 'commercial', 'public', 'private'
    ],
    required: [true, 'Category is required']
  },
  
  // Membership Management
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['member', 'volunteer', 'coordinator', 'secretary', 'treasurer', 'president', 'admin'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    permissions: [{
      type: String,
      enum: [
        'view_events', 'create_events', 'edit_events', 'delete_events',
        'view_members', 'invite_members', 'remove_members', 'edit_member_roles',
        'upload_media', 'edit_mandal', 'view_analytics', 'manage_finances'
      ]
    }]
  }],
  
  // Events and Activities
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  
  // Financial Information
  finances: {
    totalFunds: {
      type: Number,
      default: 0,
      min: 0
    },
    targetAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    expenses: [{
      description: String,
      amount: Number,
      category: String,
      date: {
        type: Date,
        default: Date.now
      },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    donations: [{
      donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      amount: Number,
      isAnonymous: {
        type: Boolean,
        default: false
      },
      message: String,
      date: {
        type: Date,
        default: Date.now
      },
      paymentId: String
    }]
  },
  
  // Status and Visibility
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'members-only'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'under-review'],
    default: 'under-review'
  },
  
  // Rules and Guidelines
  rules: [{
    title: String,
    description: String,
    order: Number
  }],
  
  // Statistics
  stats: {
    totalMembers: {
      type: Number,
      default: 0
    },
    totalEvents: {
      type: Number,
      default: 0
    },
    totalDonations: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  
  // Ratings and Reviews
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Admin Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Notification Settings
  notifications: {
    newMemberJoined: {
      type: Boolean,
      default: true
    },
    eventCreated: {
      type: Boolean,
      default: true
    },
    donationReceived: {
      type: Boolean,
      default: true
    },
    reviewReceived: {
      type: Boolean,
      default: true
    }
  },
  
  // Additional Information
  traditions: [{
    name: String,
    description: String,
    significance: String
  }],
  
  specialFeatures: [{
    type: String,
    enum: [
      'eco-friendly', 'traditional-music', 'cultural-programs', 
      'charity-activities', 'senior-citizen-friendly', 'child-friendly',
      'wheelchair-accessible', 'parking-available', 'food-stalls',
      'live-streaming', 'photography-allowed'
    ]
  }],
  
  // Timings (for events/darshan)
  timings: {
    morning: {
      start: String, // "06:00"
      end: String    // "12:00"
    },
    evening: {
      start: String, // "18:00"
      end: String    // "22:00"
    },
    specialDays: [{
      date: Date,
      timing: {
        start: String,
        end: String
      },
      description: String
    }]
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for full address
mandalSchema.virtual('fullAddress').get(function() {
  const addr = this.address
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`
})

// Virtual for member count
mandalSchema.virtual('memberCount').get(function() {
  return this.members ? this.members.filter(member => member.isActive).length : 0
})

// Virtual for active events count
mandalSchema.virtual('activeEventsCount').get(function() {
  return this.events ? this.events.length : 0
})

// Indexes
mandalSchema.index({ name: 'text', description: 'text', tagline: 'text' })
mandalSchema.index({ location: '2dsphere' })
mandalSchema.index({ category: 1 })
mandalSchema.index({ isActive: 1, status: 1 })
mandalSchema.index({ createdAt: -1 })
mandalSchema.index({ 'members.userId': 1 })
mandalSchema.index({ 'stats.averageRating': -1 })

// Pre-save middleware to update member count
mandalSchema.pre('save', function(next) {
  if (this.isModified('members')) {
    this.stats.totalMembers = this.members.filter(member => member.isActive).length
  }
  next()
})

// Instance method to add member
mandalSchema.methods.addMember = function(userId, role = 'member') {
  // Check if user is already a member
  const existingMember = this.members.find(member => 
    member.userId.toString() === userId.toString()
  )
  
  if (existingMember) {
    if (!existingMember.isActive) {
      existingMember.isActive = true
      existingMember.joinedAt = new Date()
    }
    return this.save()
  }
  
  // Add new member
  this.members.push({
    userId,
    role,
    joinedAt: new Date(),
    isActive: true
  })
  
  return this.save()
}

// Instance method to remove member
mandalSchema.methods.removeMember = function(userId) {
  const member = this.members.find(member => 
    member.userId.toString() === userId.toString()
  )
  
  if (member) {
    member.isActive = false
  }
  
  return this.save()
}

// Instance method to update member role
mandalSchema.methods.updateMemberRole = function(userId, newRole) {
  const member = this.members.find(member => 
    member.userId.toString() === userId.toString() && member.isActive
  )
  
  if (member) {
    member.role = newRole
  }
  
  return this.save()
}

// Instance method to add rating
mandalSchema.methods.addRating = function(userId, rating, review = '') {
  // Remove existing rating from this user
  this.ratings = this.ratings.filter(r => r.userId.toString() !== userId.toString())
  
  // Add new rating
  this.ratings.push({
    userId,
    rating,
    review,
    date: new Date()
  })
  
  // Recalculate average rating
  const totalRating = this.ratings.reduce((sum, r) => sum + r.rating, 0)
  this.stats.averageRating = totalRating / this.ratings.length
  this.stats.totalRatings = this.ratings.length
  
  return this.save()
}

// Instance method to add donation
mandalSchema.methods.addDonation = function(donorId, amount, isAnonymous = false, message = '', paymentId = '') {
  this.finances.donations.push({
    donorId,
    amount,
    isAnonymous,
    message,
    paymentId,
    date: new Date()
  })
  
  this.finances.totalFunds += amount
  this.stats.totalDonations += amount
  
  return this.save()
}

// Static method to find nearby mandals
mandalSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: maxDistance
      }
    },
    isActive: true,
    status: 'active'
  })
}

// Static method to search mandals
mandalSchema.statics.searchMandals = function(query, options = {}) {
  const {
    category,
    city,
    state,
    latitude,
    longitude,
    maxDistance = 50000,
    limit = 20,
    skip = 0
  } = options
  
  const searchQuery = {
    isActive: true,
    status: 'active'
  }
  
  // Text search
  if (query) {
    searchQuery.$text = { $search: query }
  }
  
  // Category filter
  if (category) {
    searchQuery.category = category
  }
  
  // Location filters
  if (city) {
    searchQuery['address.city'] = new RegExp(city, 'i')
  }
  
  if (state) {
    searchQuery['address.state'] = new RegExp(state, 'i')
  }
  
  // Geographic search
  if (latitude && longitude) {
    searchQuery.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: maxDistance
      }
    }
  }
  
  return this.find(searchQuery)
    .populate('createdBy', 'firstName lastName avatar')
    .populate('members.userId', 'firstName lastName avatar')
    .sort(query ? { score: { $meta: 'textScore' } } : { 'stats.averageRating': -1 })
    .limit(limit)
    .skip(skip)
}

export default mongoose.model('Mandal', mandalSchema)
