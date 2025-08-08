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
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Revolutionary Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of digital devotion with our cutting-edge platform designed for modern devotees
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-orange-200"
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Learn More Link */}
              <div className="mt-6">
                <button className="text-orange-600 font-semibold hover:text-orange-700 transition-colors duration-200 group-hover:translate-x-1 transform inline-flex items-center">
                  Learn More
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Festival Experience?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of devotees already using our platform to enhance their spiritual journey
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
