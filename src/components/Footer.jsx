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
    <footer className="relative" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
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

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-red-900 text-2xl font-bold">🕉️</span>
              </div>
              <span className="text-2xl font-bold text-golden">
                Digital Ganesha
              </span>
            </div>
            
            <p className="text-golden-light leading-relaxed mb-6 max-w-md">
              Bridging tradition and technology to create meaningful spiritual experiences for devotees worldwide. Join our growing community in celebrating Lord Ganesha.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4 mb-6">
              <button className="bg-red-950/50 hover:bg-yellow-600 rounded-full p-3 transition-all duration-300 transform hover:scale-110 border border-yellow-500/30">
                <span className="text-xl">📘</span>
              </button>
              <button className="bg-red-950/50 hover:bg-yellow-600 rounded-full p-3 transition-all duration-300 transform hover:scale-110 border border-yellow-500/30">
                <span className="text-xl">📷</span>
              </button>
              <button className="bg-red-950/50 hover:bg-yellow-600 rounded-full p-3 transition-all duration-300 transform hover:scale-110 border border-yellow-500/30">
                <span className="text-xl">🐦</span>
              </button>
              <button className="bg-red-950/50 hover:bg-yellow-600 rounded-full p-3 transition-all duration-300 transform hover:scale-110 border border-yellow-500/30">
                <span className="text-xl">▶️</span>
              </button>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-golden">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-golden placeholder-golden/50 backdrop-blur-sm"
                />
                <button className="bg-gradient-to-r from-yellow-600 to-yellow-500 px-6 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-red-900 font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4 text-golden">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-golden-light hover:text-golden transition-colors duration-200 hover:translate-x-1 transform inline-block"
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
        <div className="mt-16 pt-8 border-t border-yellow-500/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-golden mb-2">10M+</div>
              <div className="text-golden-light text-sm">Devotees Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-golden mb-2">1000+</div>
              <div className="text-golden-light text-sm">Active Mandals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-golden mb-2">50+</div>
              <div className="text-golden-light text-sm">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-golden-light text-sm">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-yellow-500/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-golden-light text-sm">
                © {currentYear} Digital Ganesha. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="text-golden-light hover:text-golden transition-colors duration-200">
                  Privacy Policy
                </a>
                <span className="text-golden/50">•</span>
                <a href="#" className="text-golden-light hover:text-golden transition-colors duration-200">
                  Terms of Service
                </a>
                <span className="text-golden/50">•</span>
                <a href="#" className="text-golden-light hover:text-golden transition-colors duration-200">
                  Cookie Policy
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-golden-light">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>for Lord Ganesha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 p-4 rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-110 z-50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  )
}

export default Footer
