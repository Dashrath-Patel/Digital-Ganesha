const About = () => {
  const stats = [
    { number: "10M+", label: "Devotees Connected", icon: "👥" },
    { number: "50+", label: "Cities Covered", icon: "🏙️" },
    { number: "1000+", label: "Active Mandals", icon: "🏛️" },
    { number: "24/7", label: "Virtual Access", icon: "⏰" }
  ]

  const values = [
    {
      title: "Preserve Tradition",
      description: "We honor and preserve the rich cultural heritage of Ganesh festivals while embracing modern technology.",
      icon: "🕉️"
    },
    {
      title: "Unite Communities",
      description: "Bringing devotees together from across the globe to celebrate and share in the joy of Ganesha.",
      icon: "🤝"
    },
    {
      title: "Eco-Conscious",
      description: "Promoting sustainable and environmentally friendly celebration practices for future generations.",
      icon: "🌍"
    },
    {
      title: "Innovation",
      description: "Leveraging cutting-edge technology to enhance spiritual experiences and cultural connections.",
      icon: "⚡"
    }
  ]

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              About Digital Ganesha
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We are bridging the gap between ancient traditions and modern technology, creating a platform that honors Lord Ganesha while serving today's digital devotees.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="text-6xl mb-6">🐘</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission: Digital Devotion for Modern Times
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              In an increasingly connected world, we believe that spiritual experiences should be accessible to everyone, everywhere. Digital Ganesha transforms how devotees engage with festivals, creating meaningful connections between tradition and technology.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Our platform empowers communities to organize better festivals, helps devotees discover and participate in celebrations, and ensures that the beautiful traditions of Ganesh worship continue to thrive in the digital age.
            </p>
            
            {/* Key Benefits */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Seamless integration of tradition and technology</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Global accessibility to local celebrations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Eco-friendly and sustainable practices</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
              >
                <div className="text-4xl mb-3 group-hover:animate-bounce">{stat.icon}</div>
                <div className="text-3xl font-bold text-orange-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{value.icon}</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  {value.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Join Our Growing Community</h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Be part of a movement that's revolutionizing how we celebrate and connect with our spiritual traditions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                🤝 Become a Partner
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-105">
                📧 Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
