const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Features", href: "#features" },
        { name: "Virtual Darshan", href: "#" },
        { name: "Mandal Locator", href: "#" },
        { name: "Community Hub", href: "#" },
        { name: "Marketplace", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "About Ganesha", href: "#" },
        { name: "Festival Guide", href: "#" },
        { name: "Eco-Friendly Tips", href: "#" },
        { name: "Traditional Recipes", href: "#" },
        { name: "Prayer Collections", href: "#" }
      ]
    },
    {
      title: "Community",
      links: [
        { name: "Join as Devotee", href: "#" },
        { name: "Register Mandal", href: "#" },
        { name: "Become Artisan", href: "#" },
        { name: "Volunteer", href: "#" },
        { name: "Partner with Us", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Contact Us", href: "#contact" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "API Documentation", href: "#" }
      ]
    }
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🕉️</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Digital Ganesha
              </span>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Bridging tradition and technology to create meaningful spiritual experiences for devotees worldwide. Join our growing community in celebrating Lord Ganesha.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4 mb-6">
              <button className="bg-gray-700 hover:bg-orange-600 rounded-full p-3 transition-all duration-300 transform hover:scale-110">
                <span className="text-xl">📘</span>
              </button>
              <button className="bg-gray-700 hover:bg-orange-600 rounded-full p-3 transition-all duration-300 transform hover:scale-110">
                <span className="text-xl">📷</span>
              </button>
              <button className="bg-gray-700 hover:bg-orange-600 rounded-full p-3 transition-all duration-300 transform hover:scale-110">
                <span className="text-xl">🐦</span>
              </button>
              <button className="bg-gray-700 hover:bg-orange-600 rounded-full p-3 transition-all duration-300 transform hover:scale-110">
                <span className="text-xl">▶️</span>
              </button>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4 text-orange-400">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">10M+</div>
              <div className="text-gray-400 text-sm">Devotees Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">1000+</div>
              <div className="text-gray-400 text-sm">Active Mandals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">50+</div>
              <div className="text-gray-400 text-sm">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © {currentYear} Digital Ganesha. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Privacy Policy
                </a>
                <span className="text-gray-600">•</span>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Terms of Service
                </a>
                <span className="text-gray-600">•</span>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Cookie Policy
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>for Lord Ganesha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-110 z-50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  )
}

export default Footer
