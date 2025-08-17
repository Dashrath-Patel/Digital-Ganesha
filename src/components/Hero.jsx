import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = ({ firstLine, secondLine, isFirstLineAnimating, isSecondLineAnimating, currentMantraIndex, mantraTranslations }) => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [randomOrder, setRandomOrder] = useState([])
  const titleRef = useRef(null)
  const imageRef = useRef(null)

  // Handle Gallery button click
  const handleGalleryClick = () => {
    navigate('/community?tab=gallery')
  }
  
  const slides = [
    {
      title: "गणपति बप्पा मोरया",
      subtitle: "Experience the divine presence of Lord Ganesha in the digital realm",
      image: "Hero/ganesh.svg",
      mantra: "ॐ गं गणपतये नमः"
    },
    {
      title: "विघ्न हर्ता गणराजा",
      subtitle: "Let the remover of obstacles guide your spiritual journey",
      image: "Hero/om.svg",
      mantra: "गणानां त्वा गणपतिं हवामहे"
    },
    {
      title: "मोदकप्रिया एकदन्त",
      subtitle: "Join millions in celebrating the elephant-headed deity",
      image: "Hero/modak.png",
      mantra: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ"
    },
    {
      title: "दीपज्योति विघ्नहर्ता",
      subtitle: "May the divine light of Ganesha illuminate your path",
      image: "Hero/diya.png",
      mantra: "ॐ दीपप्रभाय नमः"
    },
    {
      title: "जपा पुष्प प्रिय गणेश",
      subtitle: "Adore Lord Ganesha with the sacred hibiscus bloom",
      image: "Hero/flower.png",
      mantra: "ॐ जपाकुसुम प्रीताय नमः"
    }
  ];

  // Function to shuffle array randomly
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize random order on component mount
  useEffect(() => {
    const indices = Array.from({ length: slides.length }, (_, i) => i);
    setRandomOrder(shuffleArray(indices));
  }, []);

  // Slide transition effect with 45-second duration
  useEffect(() => {
    if (randomOrder.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const currentIndex = randomOrder.indexOf(prev);
        const nextIndex = (currentIndex + 1) % randomOrder.length;
        
        // If we've gone through all slides, reshuffle for next cycle
        if (nextIndex === 0) {
          setTimeout(() => {
            setRandomOrder(shuffleArray(Array.from({ length: slides.length }, (_, i) => i)));
          }, 100);
        }
        
        return randomOrder[nextIndex];
      });
    }, 5000); // 5 seconds duration
    
    return () => clearInterval(timer);
  }, [randomOrder]);

  // Trigger animations when slide changes
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.classList.remove('animate-image-reveal');
      setTimeout(() => {
        titleRef.current.classList.add('animate-image-reveal');
      }, 50);
    }
    
    if (imageRef.current) {
      imageRef.current.classList.remove('animate-image-reveal');
      setTimeout(() => {
        imageRef.current.classList.add('animate-image-reveal');
      }, 200);
    }
  }, [currentSlide])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-8 px-4" style={{ backgroundColor: 'rgb(21, 21, 21)'  }}>
      {/* Enhanced Spiritual Background - With Circles */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.3)' }}>
        {/* Mandala Pattern Background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-light"/>
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-dark"/>
            <path d="M50 10 L50 90 M10 50 L90 50 M25 25 L75 75 M75 25 L25 75" stroke="currentColor" strokeWidth="0.2" className="text-golden"/>
          </svg>
        </div>
        
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

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <div className="space-y-8">
          {/* Divine Header */}
          <div className="space-y-6">
            <div className="relative mx-auto" style={{ width: 'fit-content' }}>
              <div 
                ref={imageRef}
                className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto mb-4 animate-image-reveal drop-shadow-lg p-2"
              >
                {slides[currentSlide].image.includes('.') ? (
                  <img 
                    src={`/${slides[currentSlide].image}`} 
                    alt="Sacred Symbol" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-6xl md:text-7xl lg:text-8xl flex items-center justify-center h-full">
                    {slides[currentSlide].image}
                  </div>
                )}
              </div>
              <div className="absolute -top-2 -left-2 text-xl md:text-2xl animate-pulse">🪔</div>
              <div className="absolute -top-2 -right-2 text-xl md:text-2xl animate-pulse delay-300">🪔</div>
            </div>
            
            <h1 
              ref={titleRef}
              className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-golden leading-tight animate-image-reveal px-4"
            >
              <span className="bg-gradient-to-r from-golden via-golden-light to-golden-dark bg-clip-text text-transparent drop-shadow-sm">
                {slides[currentSlide].title}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-golden-light max-w-3xl mx-auto leading-relaxed px-4">
              {slides[currentSlide].subtitle}
            </p>
            
            {/* Animated Sanskrit Mantra - Same as Signup Page */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-golden/30 text-center min-h-[140px] flex flex-col justify-center max-w-2xl mx-auto shadow-2xl">
              <div className="text-lg font-medium mb-2 leading-relaxed min-h-[60px] flex flex-col items-center justify-center space-y-1">
                {/* First Line */}
                <div className="w-full flex justify-center">
                  {firstLine && (
                    <div 
                      className={`relative overflow-hidden ${isFirstLineAnimating ? 'animate-reveal-text' : ''}`}
                      style={{ 
                        animationDuration: '3s',
                        animationFillMode: 'forwards'
                      }}
                    >
                      <span className="mantra-glow whitespace-nowrap block" style={{ color: 'rgb(255, 215, 0)' }}>
                        {firstLine}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Second Line */}
                <div className="w-full flex justify-center">
                  {secondLine && (
                    <div 
                      className={`relative overflow-hidden ${isSecondLineAnimating ? 'animate-reveal-text' : ''}`}
                      style={{ 
                        animationDuration: '3s',
                        animationFillMode: 'forwards'
                      }}
                    >
                      <span className="mantra-glow whitespace-nowrap block" style={{ color: 'rgb(255, 215, 0)' }}>
                        {secondLine}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {mantraTranslations && mantraTranslations[currentMantraIndex] && (
                <p className="text-golden-light text-sm mt-2">
                  {mantraTranslations[currentMantraIndex]?.meaning}
                </p>
              )}
            </div>
          </div>

          {/* Divine CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4">
            <button className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-500 text-red-900 px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:from-yellow-500 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-2">
              <span>🎪</span>
              <span>Sacred Festivals</span>
              <span>🙏</span>
            </button>
            <button 
              onClick={handleGalleryClick}
              className="border-2 border-golden text-golden px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-golden hover:text-red-900 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>📿</span>
              <span>Gallery</span>
              <span>🪔</span>
            </button>
          </div>

          {/* Enhanced Slide Indicators */}
          <div className="flex justify-center space-x-3 mt-8 md:mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 border-2 ${
                  index === currentSlide 
                    ? 'bg-golden border-golden-dark scale-125 shadow-lg' 
                    : 'bg-golden/30 border-golden/60 hover:bg-golden/50'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Floating Spiritual Elements */}
      <div className="absolute top-20 left-5 text-6xl opacity-20 animate-pulse">🕉️</div>
      <div className="absolute top-20 right-5 text-6xl opacity-20 animate-pulse">🕉️</div>
      {/* <div className="absolute top-32 right-10 text-5xl opacity-25 animate-bounce delay-300">🪔</div> */}
      <div className="absolute bottom-10 left-10 text-4xl opacity-30 animate-pulse delay-700">📿</div>
      <div className="absolute bottom-10 right-5 text-5xl opacity-25 animate-bounce delay-500">🌺</div>
      <div className="absolute top-5/9 left-5 text-3xl opacity-20 animate-pulse delay-1000">🔱</div>
      <div className="absolute top-5/9 right-5 text-3xl opacity-20 animate-bounce delay-1200">🐚</div>
    </section>
  )
}

export default Hero
