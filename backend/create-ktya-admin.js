import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// User Schema (matching your existing model)
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
  username: {
    type: String,
    unique: true,
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

const createKtyaAdmin = async () => {
  try {
    console.log('🔍 Connecting to MongoDB...')
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set!')
      console.log('📋 Please check your .env file in the backend directory')
      process.exit(1)
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB successfully!')

    // Check if KTYA admin already exists
    const existingKtyaAdmin = await User.findOne({ email: 'ktya@ganeshweb.com' })
    if (existingKtyaAdmin) {
      console.log('⚠️  KTYA admin already exists!')
      console.log('📧 Email:', existingKtyaAdmin.email)
      console.log('🆔 ID:', existingKtyaAdmin._id)
      console.log('🛡️  Current Role:', existingKtyaAdmin.role)
      
      if (existingKtyaAdmin.role !== 'admin') {
        console.log('\n🔄 Updating user role to admin...')
        existingKtyaAdmin.role = 'admin'
        existingKtyaAdmin.isActive = true
        existingKtyaAdmin.isVerified = true
        existingKtyaAdmin.emailVerifiedAt = new Date()
        await existingKtyaAdmin.save()
        console.log('✅ User role updated to admin!')
      }
      
      console.log('\n🔑 LOGIN CREDENTIALS:')
      console.log('📧 Email: ktya@ganeshweb.com')
      console.log('🔒 Password: Ktya@123456')
      return
    }

    // Create KTYA admin user data
    const ktyaAdminData = {
      firstName: 'KTYA',
      lastName: 'Admin',
      email: 'ktya@ganeshweb.com',
      username: 'ktya_admin',
      password: 'Ktya@123456', // Will be hashed by pre-save middleware
      role: 'admin',
      isActive: true,
      isVerified: true,
      emailVerifiedAt: new Date()
    }

    console.log('👤 Creating KTYA admin user...')
    const ktyaAdminUser = new User(ktyaAdminData)
    await ktyaAdminUser.save()

    console.log('\n✅ KTYA ADMIN CREATED SUCCESSFULLY!')
    console.log('🆔 User ID:', ktyaAdminUser._id)
    console.log('👤 Name:', ktyaAdminUser.firstName, ktyaAdminUser.lastName)
    console.log('📧 Email:', ktyaAdminUser.email)
    console.log('🛡️  Role:', ktyaAdminUser.role)
    
    console.log('\n🔑 LOGIN CREDENTIALS:')
    console.log('📧 Email: ktya@ganeshweb.com')
    console.log('🔒 Password: Ktya@123456')
    
    console.log('\n📋 ALL ADMIN ACCOUNTS:')
    const allAdmins = await User.find({ role: 'admin' }).select('firstName lastName email _id')
    allAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.firstName} ${admin.lastName} - ${admin.email} (ID: ${admin._id})`)
    })
    
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:')
    console.log('1. Please change passwords after first login')
    console.log('2. Access admin dashboard at: http://localhost:5173/admin')
    console.log('3. Keep these credentials secure')

  } catch (error) {
    console.error('❌ Error creating KTYA admin user:', error.message)
    
    if (error.code === 11000) {
      console.log('\n💡 It looks like a user with this email already exists.')
      console.log('🔍 Checking existing user...')
      
      try {
        const existingUser = await User.findOne({ email: 'ktya@ganeshweb.com' })
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
          console.log('📧 Email: ktya@ganeshweb.com')
          console.log('🔒 Password: Ktya@123456')
        }
      } catch (updateError) {
        console.error('❌ Error updating existing user:', updateError.message)
      }
    }
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Database connection closed')
    process.exit(0)
  }
}

// Run the script
createKtyaAdmin()
