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
      description: "Our headquarters location",
      contact: "Mumbai, Maharashtra, India",
      action: "#"
    }
  ]

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions, suggestions, or want to partner with us? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Let's Connect</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
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
                  className="block bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className="text-3xl mb-4 group-hover:animate-bounce">{info.icon}</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    {info.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">{info.description}</p>
                  <p className="text-orange-600 font-semibold">{info.contact}</p>
                </a>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
              <h4 className="text-xl font-bold mb-4">Follow Our Journey</h4>
              <p className="mb-6 opacity-90">Stay updated with the latest features, events, and community highlights</p>
              <div className="flex space-x-4">
                <button className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300 transform hover:scale-110">
                  <span className="text-xl">📘</span>
                </button>
                <button className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300 transform hover:scale-110">
                  <span className="text-xl">📷</span>
                </button>
                <button className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300 transform hover:scale-110">
                  <span className="text-xl">🐦</span>
                </button>
                <button className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300 transform hover:scale-110">
                  <span className="text-xl">▶️</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Send Message 🚀
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                We typically respond within 24 hours during business days
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-3">How do I register my mandal?</h4>
              <p className="text-gray-600">
                You can register your mandal through our platform by providing basic information about your organization and location. Our team will verify and approve your listing within 24-48 hours.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Is the platform free to use?</h4>
              <p className="text-gray-600">
                Yes! Our basic features are completely free for devotees. We offer premium features for mandal organizers and businesses at affordable rates.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Can I sell my Ganesha idols here?</h4>
              <p className="text-gray-600">
                Absolutely! We support local artisans and craftspeople. You can create a seller profile and showcase your beautiful handcrafted Ganesha idols to our community.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-3">How do virtual darshan sessions work?</h4>
              <p className="text-gray-600">
                Our virtual darshan feature uses 360° cameras and live streaming technology to provide immersive experiences. You can participate in real-time aarti and prayers from anywhere in the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
