import mongoose from './backend/node_modules/mongoose/index.js'
import bcrypt from './backend/node_modules/bcryptjs/index.js'
import dotenv from './backend/node_modules/dotenv/lib/main.js'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, 'backend', '.env') })

// User Schema (simplified version matching your model)
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'committee_member', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: {
    type: Date
  },
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
  }
}, {
  timestamps: true
})

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  const saltRounds = 12
  this.password = await bcrypt.hash(this.password, saltRounds)
  next()
})

const User = mongoose.model('User', userSchema)

const createAdminUser = async () => {
  try {
    console.log('🔍 Connecting to MongoDB...')
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set!')
      console.log('📋 Please check your backend/.env file')
      process.exit(1)
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB successfully!')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!')
      console.log('📧 Email:', existingAdmin.email)
      console.log('🆔 ID:', existingAdmin._id)
      console.log('\n🔑 Use these credentials to login:')
      console.log('📧 Email: admin@ganeshweb.com')
      console.log('🔒 Password: Admin@123456')
      return
    }

    // Create admin user data
    const adminData = {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'ktya@ganeshweb.com',
      password: 'Ktya@123456', // Will be hashed by pre-save middleware
      role: 'admin',
      isActive: true,
      isVerified: true,
      emailVerifiedAt: new Date()
    }

    console.log('👤 Creating admin user...')
    const adminUser = new User(adminData)
    await adminUser.save()

    console.log('\n✅ ADMIN CREATED SUCCESSFULLY!')
    console.log('🆔 User ID:', adminUser._id)
    console.log('👤 Name:', adminUser.firstName, adminUser.lastName)
    console.log('📧 Email:', adminUser.email)
    console.log('🛡️  Role:', adminUser.role)
    
    console.log('\n🔑 LOGIN CREDENTIALS:')
    console.log('📧 Email: ktya@ganeshweb.com')
    console.log('🔒 Password: Ktya@123456')
    
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:')
    console.log('1. Please change the password after first login')
    console.log('2. Access admin dashboard at: http://localhost:5173/admin')
    console.log('3. Make sure to keep these credentials secure')

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    
    if (error.code === 11000) {
      console.log('\n💡 It looks like a user with this email already exists.')
      console.log('🔍 Checking existing user...')
      
      const existingUser = await User.findOne({ email: 'admin@ganeshweb.com' })
      if (existingUser) {
        console.log('👤 Found existing user:')
        console.log('🆔 ID:', existingUser._id)
        console.log('📧 Email:', existingUser.email)
        console.log('🛡️  Current Role:', existingUser.role)
        
        if (existingUser.role !== 'admin') {
          console.log('\n🔄 Updating user role to admin...')
          existingUser.role = 'admin'
          existingUser.isActive = true
          existingUser.isVerified = true
          existingUser.emailVerifiedAt = new Date()
          await existingUser.save()
          console.log('✅ User role updated to admin!')
        }
        
        console.log('\n🔑 LOGIN CREDENTIALS:')
        console.log('📧 Email: admin@ganeshweb.com')
        console.log('🔒 Password: Admin@123456')
      }
    }
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Database connection closed')
    process.exit(0)
  }
}

// Run the script
createAdminUser()
