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
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="../../public/ganesha-navbar.jpg"  // Replace with your image path
                  alt="Sacred Symbol"
                  className="w-full h-full object-cover rounded-full"  // Fills the container perfectly
                />
              </div>
              <span className="text-2xl font-bold text-golden">
                कृष्णा टाउनशिपचा सम्राट
              </span>
            </div>

            <p className="text-golden-light leading-relaxed mb-6 max-w-md">
              कृष्णा टाउनशिपमधील KTYA मंडळाच्या भक्तीने आणलेला हा देव,
              विश्वासाचा आणि एकतेचा प्रतीक.
              सर्व विघ्ने दूर करून, समृद्धी आणि आनंदाचा आशीर्वाद देणारा,
              आमच्या गणेशोत्सवाचा गौरवशाली सम्राट!"
            </p>

            {/* Social Media */}
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
              <div className="text-3xl font-bold text-golden mb-2">4.5K+</div>
              <div className="text-golden-light text-sm">Devotees Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-golden mb-2">100+</div>
              <div className="text-golden-light text-sm">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-golden mb-2">
                {new Date().getFullYear() - 1995}+
              </div>
              <div className="text-golden-light text-sm">Years of Divine Blessings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-golden-light text-sm">Acess Available</div>
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
                © {currentYear} KTYA . All rights reserved.
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
