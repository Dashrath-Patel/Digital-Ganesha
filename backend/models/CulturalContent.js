import mongoose from 'mongoose'

const culturalContentSchema = new mongoose.Schema({
  // Common fields for all content types
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['mantras', 'recipes', 'traditions', 'books', 'bhajans'],
    index: true
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  image: {
    type: String,
    default: ''
  },
  
  videoId: {
    type: String,
    default: ''
  },
  
  significance: {
    type: String,
    trim: true,
    maxlength: [2000, 'Significance cannot exceed 2000 characters']
  },
  
  source: {
    type: String,
    trim: true,
    maxlength: [200, 'Source cannot exceed 200 characters']
  },
  
  // Mantra-specific fields
  sanskrit: {
    type: String,
    trim: true
  },
  
  translation: {
    type: String,
    trim: true
  },
  
  // Recipe-specific fields
  ingredients: [{
    type: String,
    trim: true
  }],
  
  instructions: [{
    type: String,
    trim: true
  }],
  
  // Book-specific fields
  author: {
    type: String,
    trim: true,
    maxlength: [100, 'Author cannot exceed 100 characters']
  },
  
  chapters: [{
    type: String,
    trim: true
  }],
  
  // Tradition-specific fields
  rituals: [{
    type: String,
    trim: true
  }],
  
  // Bhajan-specific fields
  artist: {
    type: String,
    trim: true,
    maxlength: [100, 'Artist cannot exceed 100 characters']
  },
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  
  viewCount: {
    type: Number,
    default: 0
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  featured: {
    type: Boolean,
    default: false
  },
  
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better performance
culturalContentSchema.index({ category: 1, isActive: 1 })
culturalContentSchema.index({ featured: 1, order: 1 })
culturalContentSchema.index({ title: 'text', description: 'text', tags: 'text' })

// Virtual for content type validation
culturalContentSchema.virtual('contentType').get(function() {
  return this.category
})

// Pre-save middleware to set appropriate fields based on category
culturalContentSchema.pre('save', function(next) {
  // Clean up unused fields based on category
  switch (this.category) {
    case 'mantras':
      this.ingredients = undefined
      this.instructions = undefined
      this.chapters = undefined
      this.rituals = undefined
      this.artist = undefined
      this.author = undefined
      break
    case 'recipes':
      this.sanskrit = undefined
      this.translation = undefined
      this.chapters = undefined
      this.rituals = undefined
      this.artist = undefined
      this.author = undefined
      break
    case 'traditions':
      this.sanskrit = undefined
      this.translation = undefined
      this.ingredients = undefined
      this.instructions = undefined
      this.chapters = undefined
      this.artist = undefined
      this.author = undefined
      break
    case 'books':
      this.sanskrit = undefined
      this.translation = undefined
      this.ingredients = undefined
      this.instructions = undefined
      this.rituals = undefined
      this.artist = undefined
      break
    case 'bhajans':
      this.sanskrit = undefined
      this.translation = undefined
      this.ingredients = undefined
      this.instructions = undefined
      this.chapters = undefined
      this.rituals = undefined
      this.author = undefined
      break
  }
  next()
})

// Method to increment view count
culturalContentSchema.methods.incrementViewCount = function() {
  this.viewCount += 1
  return this.save()
}

// Static method to get content by category
culturalContentSchema.statics.getByCategory = function(category, options = {}) {
  const {
    limit = 0,
    skip = 0,
    featured = null,
    isActive = true,
    sort = { order: 1, createdAt: -1 }
  } = options
  
  const query = { category, isActive }
  if (featured !== null) {
    query.featured = featured
  }
  
  return this.find(query)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .lean()
}

// Static method to search content
culturalContentSchema.statics.searchContent = function(searchTerm, category = null, options = {}) {
  const {
    limit = 20,
    skip = 0,
    isActive = true
  } = options
  
  const query = {
    isActive,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { tags: { $regex: searchTerm, $options: 'i' } }
    ]
  }
  
  if (category) {
    query.category = category
  }
  
  return this.find(query)
    .sort({ order: 1, createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
}

const CulturalContent = mongoose.model('CulturalContent', culturalContentSchema)

export default CulturalContent
