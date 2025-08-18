// Formspree configuration
export const FORMSPREE_CONFIG = {
  // Replace with your actual Formspree form ID
  // You can get this from https://formspree.io after creating an account and form
  // Or use environment variable VITE_FORMSPREE_FORM_ID
  FORM_ID: import.meta.env.VITE_FORMSPREE_FORM_ID || 'YOUR_FORM_ID',
  
  get ENDPOINT() {
    return `https://formspree.io/f/${this.FORM_ID}`
  },
  
  // Optional: Configure additional settings
  SETTINGS: {
    replyTo: '@replyTo',
    subject: 'New Contact Form Submission from Digital Ganesha',
  }
}

// Form validation rules
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  subject: {
    required: true,
    minLength: 5,
    maxLength: 100
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000
  }
}
