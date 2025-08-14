import mongoose from 'mongoose'
import dotenv from 'dotenv'
import CulturalContent from './models/CulturalContent.js'
import connectDB from './config/database.js'

// Load environment variables
dotenv.config()

const adminActions = {
  // Add new content
  async add(contentData) {
    try {
      const content = new CulturalContent(contentData)
      const savedContent = await content.save()
      console.log('✅ Content added successfully:', savedContent.title)
      return savedContent
    } catch (error) {
      console.error('❌ Error adding content:', error.message)
      throw error
    }
  },

  // Update existing content
  async update(id, updateData) {
    try {
      const content = await CulturalContent.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      )
      if (!content) {
        throw new Error('Content not found')
      }
      console.log('✅ Content updated successfully:', content.title)
      return content
    } catch (error) {
      console.error('❌ Error updating content:', error.message)
      throw error
    }
  },

  // Delete content
  async delete(id) {
    try {
      const content = await CulturalContent.findByIdAndDelete(id)
      if (!content) {
        throw new Error('Content not found')
      }
      console.log('✅ Content deleted successfully:', content.title)
      return content
    } catch (error) {
      console.error('❌ Error deleting content:', error.message)
      throw error
    }
  },

  // List all content
  async list(category = null) {
    try {
      const query = category ? { category } : {}
      const content = await CulturalContent.find(query)
        .sort({ category: 1, order: 1, createdAt: -1 })
        .lean()
      
      console.log(`\n📋 ${category ? category.toUpperCase() : 'ALL'} CONTENT:`)
      console.log('='.repeat(50))
      
      content.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`)
        console.log(`   Category: ${item.category}`)
        console.log(`   ID: ${item._id}`)
        console.log(`   Featured: ${item.featured ? 'Yes' : 'No'}`)
        console.log(`   Views: ${item.viewCount}`)
        console.log('   ---')
      })
      
      console.log(`\nTotal: ${content.length} items\n`)
      return content
    } catch (error) {
      console.error('❌ Error listing content:', error.message)
      throw error
    }
  },

  // Search content
  async search(searchTerm) {
    try {
      const content = await CulturalContent.searchContent(searchTerm)
      
      console.log(`\n🔍 SEARCH RESULTS FOR: "${searchTerm}"`)
      console.log('='.repeat(50))
      
      content.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title} (${item.category})`)
        console.log(`   ID: ${item._id}`)
        console.log('   ---')
      })
      
      console.log(`\nFound: ${content.length} items\n`)
      return content
    } catch (error) {
      console.error('❌ Error searching content:', error.message)
      throw error
    }
  },

  // Toggle featured status
  async toggleFeatured(id) {
    try {
      const content = await CulturalContent.findById(id)
      if (!content) {
        throw new Error('Content not found')
      }
      
      content.featured = !content.featured
      await content.save()
      
      console.log(`✅ Featured status updated: ${content.title} is now ${content.featured ? 'featured' : 'not featured'}`)
      return content
    } catch (error) {
      console.error('❌ Error toggling featured status:', error.message)
      throw error
    }
  },

  // Get statistics
  async stats() {
    try {
      const stats = await CulturalContent.aggregate([
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

      const totalContent = await CulturalContent.countDocuments()
      const totalViews = await CulturalContent.aggregate([
        { $group: { _id: null, total: { $sum: '$viewCount' } } }
      ])

      console.log('\n📊 CONTENT STATISTICS:')
      console.log('='.repeat(50))
      console.log(`Total Content: ${totalContent}`)
      console.log(`Total Views: ${totalViews[0]?.total || 0}`)
      console.log('\nBy Category:')
      
      stats.forEach(stat => {
        console.log(`  ${stat._id.toUpperCase()}:`)
        console.log(`    Count: ${stat.count}`)
        console.log(`    Views: ${stat.totalViews}`)
        console.log(`    Featured: ${stat.featuredCount}`)
        console.log()
      })

      return { totalContent, totalViews: totalViews[0]?.total || 0, categoryStats: stats }
    } catch (error) {
      console.error('❌ Error getting statistics:', error.message)
      throw error
    }
  }
}

// CLI Interface
const runCLI = async () => {
  try {
    await connectDB()
    
    const args = process.argv.slice(2)
    const action = args[0]
    
    if (!action) {
      console.log(`
🎯 Cultural Content Admin Tool

Usage: node admin-cultural-content.js <action> [options]

Actions:
  list [category]           - List all content (optionally filter by category)
  search <term>            - Search content by term
  stats                    - Show content statistics
  featured <id>            - Toggle featured status of content
  add                      - Add new content (interactive)
  update <id>              - Update content (interactive)
  delete <id>              - Delete content

Categories: mantras, recipes, traditions, books, bhajans

Examples:
  node admin-cultural-content.js list mantras
  node admin-cultural-content.js search "ganesha"
  node admin-cultural-content.js stats
  node admin-cultural-content.js featured 60f1b2c3d4e5f6a7b8c9d0e1
      `)
      process.exit(0)
    }

    switch (action) {
      case 'list':
        await adminActions.list(args[1])
        break
        
      case 'search':
        if (!args[1]) {
          console.error('❌ Please provide a search term')
          process.exit(1)
        }
        await adminActions.search(args[1])
        break
        
      case 'stats':
        await adminActions.stats()
        break
        
      case 'featured':
        if (!args[1]) {
          console.error('❌ Please provide content ID')
          process.exit(1)
        }
        await adminActions.toggleFeatured(args[1])
        break
        
      case 'delete':
        if (!args[1]) {
          console.error('❌ Please provide content ID')
          process.exit(1)
        }
        await adminActions.delete(args[1])
        break
        
      default:
        console.error(`❌ Unknown action: ${action}`)
        process.exit(1)
    }
    
    process.exit(0)
    
  } catch (error) {
    console.error('💥 Admin tool error:', error.message)
    process.exit(1)
  }
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCLI()
}

export default adminActions
