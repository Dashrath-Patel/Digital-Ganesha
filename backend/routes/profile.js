import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Change Password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' })
    }

    // Get user with password
    const user = await User.findById(req.user.userId).select('+password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    // Hash new password
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await User.findByIdAndUpdate(req.user.userId, { password: hashedNewPassword })

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Change Email
router.put('/change-email', authenticateToken, async (req, res) => {
  try {
    const { password, newEmail } = req.body

    if (!password || !newEmail) {
      return res.status(400).json({ message: 'Password and new email are required' })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    // Get user with password
    const user = await User.findById(req.user.userId).select('+password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' })
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: newEmail })
    if (existingUser && existingUser._id.toString() !== req.user.userId) {
      return res.status(400).json({ message: 'Email already in use by another account' })
    }

    // Update email
    await User.findByIdAndUpdate(req.user.userId, { email: newEmail })

    res.json({ message: 'Email updated successfully' })
  } catch (error) {
    console.error('Change email error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update Profile (name and other non-sensitive fields)
router.put('/update-profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' })
    }

    // Prepare update data
    const updateData = {
      firstName: firstName.trim(),
      lastName: lastName.trim()
    }

    // Add phone if provided
    if (phone) {
      updateData.phone = phone.trim()
    }

    // Update profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, select: '-password' }
    )

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get Profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
