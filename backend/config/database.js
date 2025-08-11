import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // Debug: Check if MONGODB_URI is loaded
    if (!process.env.MONGODB_URI) {
      console.error('📛 MONGODB_URI environment variable is not set!')
      process.exit(1)
    }

    console.log('🔍 Connecting to MongoDB...')
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Remove deprecated options - these are now defaults in mongoose 6+
    })

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('📛 MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close()
        console.log('🛑 MongoDB connection closed due to app termination')
        process.exit(0)
      } catch (err) {
        console.error('Error closing MongoDB connection:', err)
        process.exit(1)
      }
    })

  } catch (error) {
    console.error('📛 MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
