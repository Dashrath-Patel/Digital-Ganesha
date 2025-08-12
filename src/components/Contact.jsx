import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' })
    alert('Thank you for your message! We will get back to you soon.')
  }

  const contactInfo = [
    {
      icon: "📧",
      title: "Email Us",
      description: "Get in touch with our support team",
      contact: "support@digitalganesha.com",
      action: "mailto:support@digitalganesha.com"
    },
    {
      icon: "📱",
      title: "Call Us",
      description: "Speak directly with our team",
      contact: "+91-XXXX-XXXXXX",
      action: "tel:+91XXXXXXXXXX"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with us in real-time",
      contact: "Available 24/7",
      action: "#"
    },
    {
      icon: "📍",
      title: "Visit Us",
      description: "KTYA Ground, Krishna Township Vasai (W)",
      contact: "Mumbai, Maharashtra, India",
      action: "#"
    }
  ]

  return (
    <section id="contact" className="py-20 relative" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
      {/* Enhanced Spiritual Background - Without Circles */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.3)' }}>
        {/* Floating Petals */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-60 left-10 text-4xl text-golden animate-float">🌺</div>
          <div className="absolute top-60 right-10 text-3xl text-golden-light animate-float-delay">🌸</div>
        </div>
      </div>

      {/* Enhanced Floating Spiritual Elements */}
      <div className="absolute top-20 left-5 text-6xl opacity-20 animate-pulse">🕉️</div>
      <div className="absolute top-20 right-5 text-6xl opacity-20 animate-pulse">🕉️</div>
      <div className="absolute bottom-10 left-10 text-4xl opacity-30 animate-pulse delay-700">📿</div>
      <div className="absolute bottom-10 right-5 text-5xl opacity-25 animate-bounce delay-500">🌺</div>
      <div className="absolute top-1/2 left-5 text-3xl opacity-20 animate-pulse delay-1000">🔱</div>
      <div className="absolute top-1/2 right-5 text-3xl opacity-20 animate-bounce delay-1200">🐚</div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-golden mb-6">
            <span className="bg-gradient-to-r from-golden via-golden-light to-golden-dark bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="text-xl text-golden-light max-w-3xl mx-auto leading-relaxed">
            Have questions, suggestions, or want to partner with us? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-golden mb-6">Let's Connect</h3>
              <p className="text-lg text-golden-light leading-relaxed mb-8">
                Whether you're a devotee looking for help, a mandal organizer wanting to join our platform,
                or an artisan seeking to showcase your work, we're here to assist you.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.action}
                  className="block bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group border border-yellow-500/30 shadow-lg"
                >
                  <div className="text-3xl mb-4 group-hover:animate-bounce">{info.icon}</div>
                  <h4 className="text-lg font-bold text-golden mb-2 group-hover:text-golden-light transition-colors duration-300">
                    {info.title}
                  </h4>
                  <p className="text-golden-light text-sm mb-3">{info.description}</p>
                  <p className="text-yellow-300 font-semibold">{info.contact}</p>
                </a>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-2xl p-6 text-red-900 shadow-2xl">
              <h4 className="text-xl font-bold mb-4">Follow Our Journey</h4>
              <p className="mb-6 opacity-90">Stay updated with KTYA's latest events and community highlights.</p>
              <div className="flex space-x-4">
                {/* Facebook - Blue Logo */}
                <a
                  href="https://www.facebook.com/vasaichiambemaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-full p-3 transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>

                {/* Instagram - Gradient Logo */}
                <a
                  href="https://www.instagram.com/ktya_utsav_mandal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white  rounded-full p-3 transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="insta-gradient" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FD5949" />
                        <stop offset="45%" stopColor="#D6249F" />
                        <stop offset="100%" stopColor="#285AEB" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#insta-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>

                {/* YouTube - Red Logo */}
                <a
                  href="https://www.youtube.com/@ktyautsavmandal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white  rounded-full p-3 transition-all duration-300 transform hover:scale-110"
                  aria-label="YouTube"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-yellow-500/30">
            <h3 className="text-2xl font-bold text-golden mb-6">Send Us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-golden-light mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-golden placeholder-golden/50 backdrop-blur-sm transition-all duration-200"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-golden-light mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-golden placeholder-golden/50 backdrop-blur-sm transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-golden-light mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-golden placeholder-golden/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-golden-light mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-golden placeholder-golden/50 backdrop-blur-sm transition-all duration-200 resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Send Message 🚀
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-golden-light text-sm">
                We typically respond within 24 hours during business days
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-golden mb-12">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
              <h4 className="text-lg font-bold text-golden mb-3">How do I register to KTYA mandal?</h4>
              <p className="text-golden-light">
                You can register to our mandal by contacting any of our KTYA committe members.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
              <h4 className="text-lg font-bold text-golden mb-3">Is the platform free to use?</h4>
              <p className="text-golden-light">
                Yes! Our basic features are completely free for devotees. We also offer premium features for mandal organizers and businesses.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
              <h4 className="text-lg font-bold text-golden mb-3">Can I sell my Ganesha idols here?</h4>
              <p className="text-golden-light">
                Absolutely! We support local artisans and craftspeople. You can create a seller profile and showcase your beautiful handcrafted Ganesha idols to our community.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
              <h4 className="text-lg font-bold text-golden mb-3">How do virtual darshan sessions work?</h4>
              <p className="text-golden-light">
                Our virtual darshan feature uses 360° cameras and live streaming linked to our Instagram Channel. You can participate in real-time aarti and prayers from anywhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
