import express from 'express';
import Message from '../models/Message.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/messages
// @desc    Get all active messages for community page
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, author } = req.query;
    
    const query = { 
      isActive: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } }
      ]
    };
    
    if (category) query.category = category;
    if (author) query.author = new RegExp(author, 'i');
    
    const messages = await Message.find(query)
      .sort({ priority: -1, date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('authorId', 'name email')
      .exec();
    
    const total = await Message.countDocuments(query);
    
    res.json({
      success: true,
      data: messages,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
});

// @route   GET /api/messages/admin
// @desc    Get all messages for admin panel (including inactive)
// @access  Private (Admin only)
router.get('/admin', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, isActive } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') }
      ];
    }
    
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('authorId', 'name email')
      .exec();
    
    const total = await Message.countDocuments(query);
    
    res.json({
      success: true,
      data: messages,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching admin messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin messages',
      error: error.message
    });
  }
});

// @route   GET /api/messages/:id
// @desc    Get single message
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('authorId', 'name email');
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Increment read count
    message.readCount += 1;
    await message.save();
    
    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching message',
      error: error.message
    });
  }
});

// @route   POST /api/messages
// @desc    Create new message
// @access  Private (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, author, category, priority, expiryDate } = req.body;
    
    // Debug logging
    console.log('=== MESSAGE CREATION DEBUG ===');
    console.log('Creating message with user:', req.user);
    console.log('Request body:', req.body);
    
    // Check if user has admin role manually
    if (req.user.role !== 'admin') {
      console.log('User role check failed. Current role:', req.user.role);
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
        userRole: req.user.role
      });
    }
    
    // Validation
    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and author are required'
      });
    }
    
    const message = new Message({
      title,
      content,
      author,
      authorId: req.user?.userId,
      category,
      priority,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    });

    console.log('Message data to save:', message);
    await message.save();
    
    // Populate author info for response
    await message.populate('authorId', 'firstName lastName email');
    
    res.status(201).json({
      success: true,
      message: 'Message created successfully',
      data: message
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating message',
      error: error.message
    });
  }
});

// @route   PUT /api/messages/:id
// @desc    Update message
// @access  Private (Admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { title, content, author, category, priority, expiryDate, isActive } = req.body;
    
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Update fields
    if (title !== undefined) message.title = title;
    if (content !== undefined) message.content = content;
    if (author !== undefined) message.author = author;
    if (category !== undefined) message.category = category;
    if (priority !== undefined) message.priority = priority;
    if (expiryDate !== undefined) message.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (isActive !== undefined) message.isActive = isActive;
    
    await message.save();
    await message.populate('authorId', 'name email');
    
    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating message',
      error: error.message
    });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    await Message.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
});

// @route   PUT /api/messages/:id/toggle-status
// @desc    Toggle message active status
// @access  Private (Admin only)
router.put('/:id/toggle-status', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    message.isActive = !message.isActive;
    await message.save();
    await message.populate('authorId', 'name email');
    
    res.json({
      success: true,
      message: `Message ${message.isActive ? 'activated' : 'deactivated'} successfully`,
      data: message
    });
  } catch (error) {
    console.error('Error toggling message status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling message status',
      error: error.message
    });
  }
});

// @route   GET /api/messages/stats/overview
// @desc    Get message statistics
// @access  Private (Admin only)
router.get('/stats/overview', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const activeMessages = await Message.countDocuments({ isActive: true });
    const expiredMessages = await Message.countDocuments({ 
      expiryDate: { $lt: new Date() },
      isActive: true
    });
    
    const categoryStats = await Message.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const priorityStats = await Message.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalMessages,
        active: activeMessages,
        expired: expiredMessages,
        inactive: totalMessages - activeMessages,
        categoryBreakdown: categoryStats,
        priorityBreakdown: priorityStats
      }
    });
  } catch (error) {
    console.error('Error fetching message stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching message statistics',
      error: error.message
    });
  }
});

export default router;
