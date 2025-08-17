import mongoose from 'mongoose';

// Media Schema for ImageKit Integration
const mediaSchema = new mongoose.Schema({
    // Basic Information
    originalName: {
        type: String,
        required: [true, 'Original filename is required'],
        trim: true
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
            'promotional', 'social', 'other', 'festivals', 'community-events', 
            'volunteers', 'behind-the-scenes', 'cultural-activities', 'worship'
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

// Create and export the model
const Media = mongoose.model('Media', mediaSchema);

export default Media;
