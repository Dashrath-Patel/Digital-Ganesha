import { FORMSPREE_CONFIG } from '../config/formspree.js'

class ContactFormService {
  /**
   * Submit contact form data to Formspree
   * @param {Object} formData - The form data to submit
   * @returns {Promise<Object>} Response object with success status
   */
  static async submitContactForm(formData) {
    try {
      // Validate form data before submission
      this.validateFormData(formData)
      
      const response = await fetch(FORMSPREE_CONFIG.ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _replyto: formData.email,
          _subject: `New Contact Form Submission from ${formData.name}`,
          _cc: formData.email,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP Error: ${response.status}`)
      }

      const responseData = await response.json()
      
      return {
        success: true,
        message: 'Your message has been sent successfully! We will get back to you soon. 🙏',
        data: responseData
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      
      return {
        success: false,
        message: error.message.includes('HTTP Error') 
          ? 'Sorry, there was a problem sending your message. Please try again or contact us directly.'
          : error.message,
        error: error
      }
    }
  }

  /**
   * Validate form data
   * @param {Object} formData - The form data to validate
   * @throws {Error} If validation fails
   */
  static validateFormData(formData) {
    const { name, email, subject, message } = formData

    if (!name || name.trim().length < 2) {
      throw new Error('Please enter a valid name (minimum 2 characters)')
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address')
    }

    if (!subject || subject.trim().length < 5) {
      throw new Error('Please enter a subject (minimum 5 characters)')
    }

    if (!message || message.trim().length < 10) {
      throw new Error('Please enter a message (minimum 10 characters)')
    }

    if (name.length > 50) {
      throw new Error('Name is too long (maximum 50 characters)')
    }

    if (subject.length > 100) {
      throw new Error('Subject is too long (maximum 100 characters)')
    }

    if (message.length > 1000) {
      throw new Error('Message is too long (maximum 1000 characters)')
    }
  }

  /**
   * Get form configuration for display
   * @returns {Object} Configuration object
   */
  static getFormConfig() {
    return {
      isConfigured: FORMSPREE_CONFIG.FORM_ID !== 'YOUR_FORM_ID',
      formId: FORMSPREE_CONFIG.FORM_ID,
      endpoint: FORMSPREE_CONFIG.ENDPOINT
    }
  }
}

export default ContactFormService
