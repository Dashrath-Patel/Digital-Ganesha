import { useState, useEffect } from 'react'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      title: "गणपति बप्पा मोरया",
      subtitle: "Experience the divine presence of Lord Ganesha in the digital realm",
      image: "🐘",
      mantra: "ॐ गं गणपतये नमः"
    },
    {
      title: "विघ्न हर्ता गणराजा",
      subtitle: "Let the remover of obstacles guide your spiritual journey",
      image: "🕉️",
      mantra: "गणानां त्वा गणपतिं हवामहे"
    },
    {
      title: "मोदकप्रिया एकदन्त",
      subtitle: "Join millions in celebrating the elephant-headed deity",
      image: "🪔",
      mantra: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Enhanced Spiritual Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-red-100">
        {/* Mandala Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-orange-500"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-red-500"/>
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-amber-500"/>
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-orange-600"/>
            <path d="M50 10 L50 90 M10 50 L90 50 M25 25 L75 75 M75 25 L25 75" stroke="currentColor" strokeWidth="0.2" className="text-orange-400"/>
          </svg>
        </div>
        
        {/* Floating Petals */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 text-4xl text-red-500 animate-float">🌺</div>
          <div className="absolute top-40 right-10 text-3xl text-orange-500 animate-float-delay">🌸</div>
          <div className="absolute bottom-20 left-10 text-5xl text-amber-500 animate-float">🌼</div>
          <div className="absolute bottom-40 right-20 text-4xl text-red-400 animate-float-delay">🌻</div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Divine Header */}
          <div className="space-y-6">
            <div className="relative">
              <div className="text-8xl md:text-9xl mb-4 animate-bounce drop-shadow-lg">
                {slides[currentSlide].image}
              </div>
              <div className="absolute -top-4 -left-4 text-2xl animate-pulse">🪔</div>
              <div className="absolute -top-4 -right-4 text-2xl animate-pulse delay-300">🪔</div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
                {slides[currentSlide].title}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
            
            {/* Sanskrit Mantra */}
            <div className="bg-gradient-to-r from-orange-100 via-amber-50 to-red-100 p-4 rounded-2xl border border-orange-200 max-w-2xl mx-auto">
              <p className="text-lg md:text-xl font-semibold text-orange-700 mb-2">
                {slides[currentSlide].mantra}
              </p>
              <div className="flex items-center justify-center space-x-2 text-orange-600">
                <span>🕉️</span>
                <span className="text-sm">Sacred Mantra</span>
                <span>🕉️</span>
              </div>
            </div>
          </div>

          {/* Divine CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:via-red-600 hover:to-amber-600 transition-all duration-300 shadow-2xl hover:shadow-orange-500/30 transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-2">
              <span>🎪</span>
              <span>Sacred Festivals</span>
              <span>🙏</span>
            </button>
            <button className="border-2 border-orange-500 text-orange-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
              <span>📿</span>
              <span>Virtual Darshan</span>
              <span>🪔</span>
            </button>
          </div>

          {/* Enhanced Divine Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:scale-105 border border-orange-100">
              <div className="text-6xl mb-4">🏛️</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">1000+</div>
              <div className="text-gray-700 font-medium text-lg">Sacred Mandals</div>
              <div className="text-sm text-orange-600 mt-2">Across the globe</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-105 border border-red-100">
              <div className="text-6xl mb-4">👥</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">50K+</div>
              <div className="text-gray-700 font-medium text-lg">Blessed Devotees</div>
              <div className="text-sm text-red-600 mt-2">United in faith</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:scale-105 border border-amber-100">
              <div className="text-6xl mb-4">🌟</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">24/7</div>
              <div className="text-gray-700 font-medium text-lg">Divine Access</div>
              <div className="text-sm text-amber-600 mt-2">Always blessed</div>
            </div>
          </div>

          {/* Enhanced Slide Indicators */}
          <div className="flex justify-center space-x-3 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                  index === currentSlide 
                    ? 'bg-orange-500 border-orange-600 scale-125 shadow-lg' 
                    : 'bg-orange-100 border-orange-300 hover:bg-orange-200'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Floating Spiritual Elements */}
      <div className="absolute top-10 left-5 text-6xl opacity-20 animate-pulse">🕉️</div>
      <div className="absolute top-32 right-10 text-5xl opacity-25 animate-bounce delay-300">🪔</div>
      <div className="absolute bottom-32 left-10 text-4xl opacity-30 animate-pulse delay-700">📿</div>
      <div className="absolute bottom-10 right-5 text-5xl opacity-25 animate-bounce delay-500">🌺</div>
      <div className="absolute top-1/2 left-5 text-3xl opacity-20 animate-pulse delay-1000">🔱</div>
      <div className="absolute top-1/2 right-5 text-3xl opacity-20 animate-bounce delay-1200">🐚</div>
    </section>
  )
}

export default Hero
