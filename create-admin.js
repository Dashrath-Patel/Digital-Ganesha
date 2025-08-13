// Script to create initial admin user
import { adminAPI } from '../src/services/AdminService.js'

const createInitialAdmin = async () => {
  try {
    const adminData = {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'ktya@ganeshweb.com',
      password: 'Ktya@123456'
    }

    console.log('Creating initial admin user...')
    const result = await adminAPI.createInitialAdmin(adminData)
    
    console.log('✅ Admin user created successfully!')
    console.log('\n🔑 ADMIN LOGIN CREDENTIALS:')
    console.log('📧 Email: ktya@ganeshweb.com')
    console.log('🔒 Password: Ktya@123456')
    console.log('\n⚠️  Please change the password after first login!')
    
    return result
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message)
  }
}

// Run the script
createInitialAdmin()
