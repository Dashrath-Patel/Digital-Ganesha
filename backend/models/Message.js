import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Message title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Message author is required'],
    trim: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Made optional for now to debug
  },
  date: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['announcement', 'festival', 'community', 'important', 'general'],
    default: 'general'
  },
  expiryDate: {
    type: Date,
    default: null
  },
  readCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
messageSchema.index({ date: -1, isActive: 1 });
messageSchema.index({ authorId: 1 });
messageSchema.index({ category: 1, priority: 1 });

// Virtual for formatted date
messageSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pre-save middleware to update readCount
messageSchema.pre('save', function(next) {
  if (this.isNew) {
    this.readCount = 0;
  }
  next();
});

// Static methods
messageSchema.statics.getActiveMessages = function() {
  return this.find({ 
    isActive: true,
    $or: [
      { expiryDate: null },
      { expiryDate: { $gt: new Date() } }
    ]
  }).sort({ priority: -1, date: -1 });
};

messageSchema.statics.getMessagesByAuthor = function(authorId) {
  return this.find({ authorId }).sort({ date: -1 });
};

export default mongoose.model('Message', messageSchema);
