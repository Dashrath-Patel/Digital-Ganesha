const Features = () => {
  const features = [
    {
      icon: "🗺️",
      title: "Smart Mandal Locator",
      description: "Find nearby Ganesh mandals with real-time updates, crowd density, and navigation support.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "📱",
      title: "Virtual Darshan",
      description: "Experience 360° virtual tours and participate in live aarti ceremonies from anywhere.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "🌱",
      title: "Eco-Friendly Tracker",
      description: "Promote sustainable celebrations with eco-friendly mandal recommendations and tips.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "📚",
      title: "Cultural Learning",
      description: "Explore interactive stories, traditional recipes, and learn about Ganesha's significance.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "👥",
      title: "Community Hub",
      description: "Connect with devotees, organize events, coordinate volunteers, and share experiences.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: "🎨",
      title: "Artisan Marketplace",
      description: "Support local artisans and discover authentic handcrafted Ganesha idols and decorations.",
      color: "from-yellow-500 to-orange-500"
    }
  ]

  return (
    <section 
      id="features" 
      className="py-20 bg-gradient-to-br from-red-900/10 via-yellow-900/5 to-amber-900/10 transition-colors duration-300 relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-600/30 to-amber-600/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-golden/20 to-golden-light/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-amber-700/20 to-yellow-700/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            id="features-heading"
            className="text-4xl md:text-5xl font-bold text-golden mb-6"
          >
            <span className="bg-gradient-to-r from-golden via-golden-light to-golden-dark bg-clip-text text-transparent">
              Revolutionary Features
            </span>
          </h2>
          <p className="text-xl text-golden-light max-w-3xl mx-auto leading-relaxed">
            Experience the future of digital devotion with our cutting-edge platform designed for modern devotees
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
          {features.map((feature, index) => (
            <div
              key={index}
              role="listitem"
              className="group relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/30 dark:border-gray-700/30 hover:border-white/50 dark:hover:border-gray-600/50 hover:bg-white/30 dark:hover:bg-gray-800/30"
            >
              {/* Icon */}
              <div 
                className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl backdrop-blur-sm border border-white/20`}
                aria-hidden="true"
              >
                <span className="text-3xl filter drop-shadow-lg">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-golden mb-4 group-hover:text-golden-light transition-colors duration-500 filter drop-shadow-sm">
                {feature.title}
              </h3>
              <p className="text-golden-light leading-relaxed filter drop-shadow-sm">
                {feature.description}
              </p>

              {/* Learn More Link */}
              <div className="mt-6">
                <button 
                  className="text-golden-dark font-semibold hover:text-golden-light transition-colors duration-300 group-hover:translate-x-2 transform inline-flex items-center filter drop-shadow-sm"
                  aria-label={`Learn more about ${feature.title}`}
                >
                  Learn More
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="relative bg-white/10 dark:bg-gray-800/10 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/20 dark:border-gray-700/20 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-golden/10 to-golden-light/10 rounded-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-golden mb-4 filter drop-shadow-sm">
                Ready to Transform Your Festival Experience?
              </h3>
              <p className="text-xl text-golden-light mb-8 max-w-2xl mx-auto filter drop-shadow-sm">
                Join thousands of devotees already using our platform to enhance their spiritual journey
              </p>
              <button 
                className="bg-gradient-to-r from-golden-dark to-golden text-red-900 px-8 py-4 rounded-full text-lg font-semibold hover:from-golden-light hover:to-golden-dark transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-golden focus:ring-offset-2 backdrop-blur-sm filter drop-shadow-lg"
                aria-label="Get started with Digital Ganesha"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
