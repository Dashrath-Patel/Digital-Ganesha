import express from 'express'
import CulturalContent from '../models/CulturalContent.js'

const router = express.Router()

// @desc    Get all cultural content by category
// @route   GET /api/cultural/:category
// @access  Public
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params
    const { 
      limit = 0, 
      skip = 0, 
      featured, 
      search,
      shuffle = 'false'
    } = req.query

    // Validate category
    const validCategories = ['mantras', 'recipes', 'traditions', 'books', 'bhajans']
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Valid categories are: ' + validCategories.join(', ')
      })
    }

    let content

    if (search) {
      // Search within category
      content = await CulturalContent.searchContent(search, category, {
        limit: parseInt(limit),
        skip: parseInt(skip)
      })
    } else {
      // Get content by category
      const options = {
        limit: parseInt(limit),
        skip: parseInt(skip)
      }

      if (featured !== undefined) {
        options.featured = featured === 'true'
      }

      content = await CulturalContent.getByCategory(category, options)
    }

    // Shuffle if requested (useful for random recipes/bhajans)
    if (shuffle === 'true' && content.length > 0) {
      for (let i = content.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [content[i], content[j]] = [content[j], content[i]]
      }
    }

    res.json({
      success: true,
      count: content.length,
      data: content
    })

  } catch (error) {
    console.error('Get cultural content error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cultural content',
      error: error.message
    })
  }
})

// @desc    Get single cultural content by ID
// @route   GET /api/cultural/item/:id
// @access  Public
router.get('/item/:id', async (req, res) => {
  try {
    const content = await CulturalContent.findById(req.params.id)

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Cultural content not found'
      })
    }

    // Increment view count
    await content.incrementViewCount()

    res.json({
      success: true,
      data: content
    })

  } catch (error) {
    console.error('Get single cultural content error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cultural content',
      error: error.message
    })
  }
})

// @desc    Search cultural content across all categories
// @route   GET /api/cultural/search/:searchTerm
// @access  Public
router.get('/search/:searchTerm', async (req, res) => {
  try {
    const { searchTerm } = req.params
    const { 
      limit = 20, 
      skip = 0, 
      category 
    } = req.query

    const content = await CulturalContent.searchContent(searchTerm, category, {
      limit: parseInt(limit),
      skip: parseInt(skip)
    })

    res.json({
      success: true,
      count: content.length,
      searchTerm,
      data: content
    })

  } catch (error) {
    console.error('Search cultural content error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to search cultural content',
      error: error.message
    })
  }
})

// @desc    Get featured content across all categories
// @route   GET /api/cultural/featured/all
// @access  Public
router.get('/featured/all', async (req, res) => {
  try {
    const { limit = 10 } = req.query

    const content = await CulturalContent.find({ 
      featured: true, 
      isActive: true 
    })
    .sort({ order: 1, createdAt: -1 })
    .limit(parseInt(limit))
    .lean()

    res.json({
      success: true,
      count: content.length,
      data: content
    })

  } catch (error) {
    console.error('Get featured content error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured content',
      error: error.message
    })
  }
})

// @desc    Get content statistics
// @route   GET /api/cultural/stats/overview
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await CulturalContent.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$viewCount' },
          featuredCount: {
            $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] }
          }
        }
      }
    ])

    const totalContent = await CulturalContent.countDocuments({ isActive: true })
    const totalViews = await CulturalContent.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ])

    res.json({
      success: true,
      data: {
        totalContent,
        totalViews: totalViews[0]?.total || 0,
        categoryStats: stats
      }
    })

  } catch (error) {
    console.error('Get content stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content statistics',
      error: error.message
    })
  }
})

export default router
