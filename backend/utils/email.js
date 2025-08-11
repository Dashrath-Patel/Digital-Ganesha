import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}

// Email templates
const emailTemplates = {
  verification: (context) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Ganesh Community</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🙏 Ganesh Community</div>
        <h1>Welcome to Our Community!</h1>
      </div>
      <div class="content">
        <h2>Hi ${context.firstName},</h2>
        <p>Thank you for joining the Ganesh Community! We're excited to have you as part of our spiritual family.</p>
        <p>To complete your registration and start exploring mandals, events, and connecting with fellow devotees, please verify your email address by clicking the button below:</p>
        <div style="text-align: center;">
          <a href="${context.verificationUrl}" class="button">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #f97316;">${context.verificationUrl}</p>
        <p>This verification link will expire in 24 hours for security reasons.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <p>Best regards,<br>The Ganesh Community Team</p>
      </div>
      <div class="footer">
        <p>© 2025 Ganesh Community. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `,

  passwordReset: (context) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Ganesh Community</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🙏 Ganesh Community</div>
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <h2>Hi ${context.firstName},</h2>
        <p>We received a request to reset your password for your Ganesh Community account.</p>
        <p>If you requested this password reset, click the button below to create a new password:</p>
        <div style="text-align: center;">
          <a href="${context.resetUrl}" class="button">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #dc2626;">${context.resetUrl}</p>
        <div class="warning">
          <strong>⚠️ Important Security Information:</strong>
          <ul>
            <li>This reset link will expire in 1 hour</li>
            <li>If you didn't request this reset, please ignore this email</li>
            <li>Your password won't change until you create a new one</li>
            <li>For security, this link can only be used once</li>
          </ul>
        </div>
        <p>If you're having trouble or didn't request this reset, please contact our support team.</p>
        <p>Best regards,<br>The Ganesh Community Team</p>
      </div>
      <div class="footer">
        <p>© 2025 Ganesh Community. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `,

  welcome: (context) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Ganesh Community</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .feature { background: #fef7ed; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #f97316; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🙏 Ganesh Community</div>
        <h1>Welcome ${context.firstName}!</h1>
      </div>
      <div class="content">
        <p>Your email has been verified successfully! Welcome to the Ganesh Community family.</p>
        
        <h3>🎉 What you can do now:</h3>
        
        <div class="feature">
          <strong>🏛️ Discover Mandals</strong><br>
          Find and join mandals in your area, connect with like-minded devotees.
        </div>
        
        <div class="feature">
          <strong>📅 Attend Events</strong><br>
          Participate in festivals, rituals, and community gatherings.
        </div>
        
        <div class="feature">
          <strong>💝 Make Donations</strong><br>
          Support your favorite mandals and charitable causes.
        </div>
        
        <div class="feature">
          <strong>📸 Share Moments</strong><br>
          Upload photos and videos of celebrations and events.
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${context.loginUrl}" class="button">Start Exploring</a>
          <a href="${context.profileUrl}" class="button">Complete Profile</a>
        </div>
        
        <p>May Lord Ganesha bless your journey with us! 🙏</p>
        
        <p>Best regards,<br>The Ganesh Community Team</p>
      </div>
      <div class="footer">
        <p>© 2025 Ganesh Community. All rights reserved.</p>
        <p>Need help? Contact us at support@ganeshcommunity.com</p>
      </div>
    </body>
    </html>
  `,

  eventInvitation: (context) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Invitation - ${context.eventName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .event-details { background: #f8fafc; padding: 20px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🙏 Ganesh Community</div>
        <h1>You're Invited!</h1>
      </div>
      <div class="content">
        <h2>Hi ${context.firstName},</h2>
        <p>You're invited to join an exciting event organized by ${context.mandalName}!</p>
        
        <div class="event-details">
          <h3>📅 ${context.eventName}</h3>
          <p><strong>📍 Location:</strong> ${context.location}</p>
          <p><strong>🕒 Date & Time:</strong> ${context.dateTime}</p>
          <p><strong>👥 Organized by:</strong> ${context.mandalName}</p>
          ${context.description ? `<p><strong>📋 Description:</strong> ${context.description}</p>` : ''}
        </div>
        
        <div style="text-align: center;">
          <a href="${context.eventUrl}" class="button">View Event Details</a>
        </div>
        
        <p>Don't miss this opportunity to be part of our community celebration!</p>
        
        <p>Best regards,<br>The Ganesh Community Team</p>
      </div>
      <div class="footer">
        <p>© 2025 Ganesh Community. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}

// Send email function
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter()

    // Verify connection configuration
    await transporter.verify()

    const { to, subject, template, context, html, text } = options

    let htmlContent = html
    let textContent = text

    // Use template if provided
    if (template && emailTemplates[template]) {
      htmlContent = emailTemplates[template](context)
      // Create text version by stripping HTML
      textContent = htmlContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    }

    const mailOptions = {
      from: `"Ganesh Community" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html: htmlContent,
      text: textContent
    }

    const result = await transporter.sendMail(mailOptions)
    
    console.log('Email sent successfully:', {
      messageId: result.messageId,
      to,
      subject
    })

    return {
      success: true,
      messageId: result.messageId
    }

  } catch (error) {
    console.error('Email sending failed:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

// Send bulk email function
export const sendBulkEmail = async (recipients, options) => {
  const results = []
  const { batchSize = 10, delay = 1000 } = options

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize)
    
    const batchPromises = batch.map(async (recipient) => {
      try {
        const result = await sendEmail({
          ...options,
          to: recipient.email,
          context: {
            ...options.context,
            firstName: recipient.firstName || 'Friend'
          }
        })
        
        return {
          email: recipient.email,
          success: true,
          messageId: result.messageId
        }
      } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error)
        return {
          email: recipient.email,
          success: false,
          error: error.message
        }
      }
    })

    const batchResults = await Promise.allSettled(batchPromises)
    results.push(...batchResults.map(result => result.value || result.reason))

    // Add delay between batches to avoid rate limiting
    if (i + batchSize < recipients.length && delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  return results
}

// Test email function
export const testEmail = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    
    console.log('✅ Email configuration is valid')
    return true
  } catch (error) {
    console.error('❌ Email configuration failed:', error.message)
    return false
  }
}

export default {
  sendEmail,
  sendBulkEmail,
  testEmail
}
