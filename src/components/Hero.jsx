import { useState, useEffect } from 'react'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      title: "Experience Divine Celebration",
      subtitle: "Connect with Ganesha festivals across the globe",
      image: "🏛️"
    },
    {
      title: "Discover Sacred Traditions",
      subtitle: "Explore the rich heritage of Ganesh festivals",
      image: "🎭"
    },
    {
      title: "Join the Community",
      subtitle: "Be part of the largest digital Ganesha celebration",
      image: "🎉"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <div className="text-8xl mb-4 animate-bounce">
              {slides[currentSlide].image}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                {slides[currentSlide].title}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 hover:-translate-y-1">
              🎪 Explore Festivals
            </button>
            <button className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105">
              📱 Virtual Darshan
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl md:text-4xl font-bold text-orange-600">1000+</div>
              <div className="text-gray-700 font-medium">Active Mandals</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl md:text-4xl font-bold text-red-600">50K+</div>
              <div className="text-gray-700 font-medium">Happy Devotees</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl md:text-4xl font-bold text-yellow-600">24/7</div>
              <div className="text-gray-700 font-medium">Virtual Access</div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-orange-500 scale-125' 
                    : 'bg-orange-200 hover:bg-orange-300'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-pulse">🪔</div>
      <div className="absolute top-40 right-20 text-4xl opacity-30 animate-bounce delay-300">🌺</div>
      <div className="absolute bottom-20 left-20 text-5xl opacity-25 animate-pulse delay-700">🕉️</div>
      <div className="absolute bottom-40 right-10 text-3xl opacity-35 animate-bounce delay-500">🎊</div>
    </section>
  )
}

export default Hero
