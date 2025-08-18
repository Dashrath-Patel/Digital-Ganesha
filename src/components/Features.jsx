import React from 'react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🗺️",
      title: "Mandal Locator",
      description: "Find our mandal in real-time with google map navigation support.",
      color: "from-blue-500 to-cyan-500",
      path: "/mandal-locator"
    },
    {
      icon: "📱",
      title: "Virtual Darshan",
      description: "Experience 360° virtual tours and participate in live aarti ceremonies from anywhere.",
      color: "from-purple-500 to-pink-500",
      path: "/virtual-darshan"
    },
    {
      icon: "📚",
      title: "Cultural Learning",
      description: "Explore interactive stories, traditional recipes, and learn about Ganesha's significance.",
      color: "from-orange-500 to-red-500",
      path: "/cultural-learning"
    },
    {
      icon: "👥",
      title: "Community Hub",
      description: "Connect with devotees, organize events, coordinate volunteers, and share experiences.",
      color: "from-indigo-500 to-purple-500",
      path: "/community"
    }
  ]

  const handleFeatureClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <section 
      id="features" 
      className="py-16 sm:py-20 relative"
      style={{ backgroundColor: 'rgb(21, 21, 21)' }}
      aria-labelledby="features-heading"
    >
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
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 
            id="features-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-golden mb-4 sm:mb-6"
          >
            <span className="bg-gradient-to-r from-golden via-golden-light to-golden-dark bg-clip-text text-transparent">
              Our Digital Features
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-golden-light max-w-3xl mx-auto leading-relaxed px-2">
            Experience the future of digital devotion with our cutting-edge platform designed for modern devotees
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto" role="list">
          {features.map((feature, index) => (
            <div
              key={index}
              role="listitem"
              className={`group relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/30 dark:border-gray-700/30 hover:border-white/50 dark:hover:border-gray-600/50 hover:bg-white/30 dark:hover:bg-gray-800/30 ${
                feature.path ? 'cursor-pointer' : ''
              }`}
              onClick={() => handleFeatureClick(feature.path)}
            >
              {/* Icon */}
              <div 
                className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl backdrop-blur-sm border border-yellow-500/30`}
                aria-hidden="true"
              >
                <span className="text-2xl sm:text-3xl filter drop-shadow-lg text-red-900">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-lg sm:text-xl font-bold text-golden mb-3 sm:mb-4 group-hover:text-golden-light transition-colors duration-500 filter drop-shadow-sm">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-golden-light leading-relaxed filter drop-shadow-sm">
                {feature.description}
              </p>

              {/* Learn More Link */}
              <div className="mt-4 sm:mt-6">
                <button 
                  className="text-sm sm:text-base text-golden-dark font-semibold hover:text-golden-light transition-colors duration-300 group-hover:translate-x-2 transform inline-flex items-center filter drop-shadow-sm"
                  aria-label={`Learn more about ${feature.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeatureClick(feature.path);
                  }}
                >
                  {feature.path ? 'Explore Now' : 'Learn More'}
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
