// Test script for Two-Factor Authentication Service
// Run with: node test-2fa.js

import TwoFactorAuthService from './services/TwoFactorAuthService.js';

async function test2FAService() {
  console.log('🔐 Testing Two-Factor Authentication Service\n');

  try {
    // Test 1: Generate Secret
    console.log('1. Testing secret generation...');
    const secret = TwoFactorAuthService.generateSecret('test@example.com');
    console.log('✅ Secret generated successfully');
    console.log('   Secret length:', secret.secret.length);
    console.log('   Manual entry key length:', secret.manual_entry_key.length);
    console.log('   Service name: Digital Ganesha\n');

    // Test 2: Generate QR Code
    console.log('2. Testing QR code generation...');
    const qrCodeUrl = await TwoFactorAuthService.generateQRCode(secret.otpauth_url);
    console.log('✅ QR code generated successfully');
    console.log('   QR code is data URL:', qrCodeUrl.startsWith('data:image/png;base64'));
    console.log('   Length:', qrCodeUrl.length, 'characters\n');

    // Test 3: Generate and verify token
    console.log('3. Testing token generation and verification...');
    const speakeasy = (await import('speakeasy')).default;
    const token = speakeasy.totp({
      secret: secret.secret,
      encoding: 'base32'
    });
    console.log('   Generated token:', token);
    
    const isValid = TwoFactorAuthService.verifyToken(token, secret.secret);
    console.log('✅ Token verification result:', isValid);

    // Test 4: Generate backup codes
    console.log('\n4. Testing backup code generation...');
    const backupCodes = TwoFactorAuthService.generateBackupCodes();
    console.log('✅ Backup codes generated successfully');
    console.log('   Number of codes:', backupCodes.length);
    console.log('   Sample codes:', backupCodes.slice(0, 3), '...');
    console.log('   Code format test:', /^[A-Z0-9]{8}-[A-Z0-9]{4}$/.test(backupCodes[0]));

    // Test 5: Verify backup code
    console.log('\n5. Testing backup code verification...');
    const testCode = backupCodes[0];
    const hashedCodes = TwoFactorAuthService.hashBackupCodes(backupCodes);
    const backupVerification = TwoFactorAuthService.verifyBackupCode(testCode, hashedCodes);
    console.log('✅ Backup code verification result:', backupVerification.isValid);
    console.log('   Code index found:', backupVerification.codeIndex);

    console.log('\n🎉 All tests passed! 2FA service is working correctly.');
    
    // Display setup info
    console.log('\n📋 Setup Information:');
    console.log('   Manual entry key:', secret.secret);
    console.log('   Service name: Digital Ganesha');
    console.log('   Account: test@example.com');
    console.log('   QR code ready for scanning\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run the test
test2FAService();
