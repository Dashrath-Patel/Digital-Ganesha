// Test import of twoFactorAuth routes
import twoFactorAuthRoutes from './routes/twoFactorAuth.js'

console.log('✅ twoFactorAuth routes imported successfully')
console.log('Routes object:', typeof twoFactorAuthRoutes)

// Test import of TwoFactorAuthService
import TwoFactorAuthService from './services/TwoFactorAuthService.js'

console.log('✅ TwoFactorAuthService imported successfully')
console.log('Service object:', typeof TwoFactorAuthService)

// Test basic service function
try {
  const secret = TwoFactorAuthService.generateSecret('test@example.com')
  console.log('✅ Service generateSecret works')
  console.log('Secret length:', secret.secret.length)
} catch (error) {
  console.error('❌ Service generateSecret failed:', error.message)
}
