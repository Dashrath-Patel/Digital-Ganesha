import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GoogleAuthService from '../services/GoogleAuthService'
import GaneshaImage from '../assets/Ganesh.jpeg'
import Header from '../components/Header'
import Footer from '../components/Footer'

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false)
  const [firstLine, setFirstLine] = useState('')
  const [secondLine, setSecondLine] = useState('')
  const [isFirstLineAnimating, setIsFirstLineAnimating] = useState(false)
  const [isSecondLineAnimating, setIsSecondLineAnimating] = useState(false)
  const [currentMantraIndex, setCurrentMantraIndex] = useState(0)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const mantraLines = [
    [
      "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।",
      "निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥"
    ],
    [
      "विघ्नेश्वराय वरदाय सुरप्रियाय लम्बोदराय सकलाय जगद्धितायं।",
      "एकदन्ताय शुद्घाय सुमुखाय नमो नमः।"
    ],
    [
      "अमेयाय च हेरम्ब परशुधारकाय ते।",
      "एकदंताय विद्‍महे। वक्रतुण्डाय धीमहि। तन्नो दंती प्रचोदयात्॥"
    ]
  ]

  const mantraTranslations = [
    {
      romanized: "Vakratunda Mahakaya Suryakoti Samaprabha, Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada",
      meaning: "O Lord with curved trunk and massive body, shining like million suns, remove all obstacles from my path in all endeavors always"
    },
    {
      romanized: "Vighneshvaraya Varadaya Surapriyaya Lambodaraya Sakalaya Jagaddhitayam, Ekadantaya Shudghaya Sumukhaya Namo Namah",
      meaning: "Salutations to the remover of obstacles, the boon giver, beloved of gods, pot-bellied one, complete one, benefactor of universe, single-tusked, pure and pleasant-faced"
    },
    {
      romanized: "Ameyaya Cha Heramba Parashudharkaya Te, Ekadantaya Vidmahe Vakratundaya Dhimahi Tanno Danti Prachodayat",
      meaning: "To the immeasurable one, Heramba, wielder of axe, we meditate on the single-tusked one, we focus on the curved-trunk one, may that tusked one inspire us"
    }
  ]

  useEffect(() => {
    // Initialize Google Auth when component mounts
    GoogleAuthService.initializeGoogleAuth()
      .then(() => setIsGoogleConfigured(true))
      .catch(console.error)
  }, [])

  // Sequential line-by-line animation effect for mantra
  useEffect(() => {
    const animateMantra = () => {
      // Reset everything
      setFirstLine('')
      setSecondLine('')
      setIsFirstLineAnimating(false)
      setIsSecondLineAnimating(false)

      // Use current index and cycle through mantras sequentially
      const selectedMantra = mantraLines[currentMantraIndex]

      // Start first line after a brief delay
      setTimeout(() => {
        setFirstLine(selectedMantra[0])
        setIsFirstLineAnimating(true)
        
        // Start second line after first line animation completes
        setTimeout(() => {
          setSecondLine(selectedMantra[1])
          setIsSecondLineAnimating(true)
        }, 1000) // Increased wait time for much slower animation
      }, 300)

      // Move to next mantra in sequence after animation completes
      setTimeout(() => {
        setCurrentMantraIndex((prevIndex) => (prevIndex + 1) % mantraLines.length)
      }, 6000) // Wait longer before switching to next mantra
    }

    // Initial animation
    animateMantra()

    // Repeat every 10 seconds (increased time to read mantras)
    const timer = setInterval(animateMantra, 10000)

    return () => clearInterval(timer)
  }, [currentMantraIndex])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (!agreeToTerms) {
      setError('Please agree to our Terms of use and Privacy Policy')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please provide both first and last name')
      setIsLoading(false)
      return
    }

    try {
      await signup(formData)
      navigate('/')
      setFormData({ firstName: '', lastName: '', email: '', password: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      if (!isGoogleConfigured) {
        setError('Google OAuth is not configured. Please use email signup.')
        return
      }

      await GoogleAuthService.signInWithGoogle()
      // The actual authentication will be handled by the callback in GoogleAuthService
    } catch (error) {
      console.error('Google signup error:', error)
      setError('Google signup failed. Please try again or use email signup.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Header />
      
      <div className="pt-16">
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Left Side - Spiritual Ganesha Design */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              {/* Floating Om Symbols */}
              <div className="absolute top-20 left-20 text-6xl text-white/20 animate-pulse">🕉️</div>
              <div className="absolute top-40 right-20 text-4xl text-white/15 animate-bounce">🕉️</div>
              <div className="absolute bottom-40 left-10 text-5xl text-white/10">🕉️</div>
              
              {/* Floating Diyas */}
              <div className="absolute top-60 left-40 text-3xl text-yellow-200/30 animate-pulse">🪔</div>
              <div className="absolute bottom-60 right-40 text-4xl text-yellow-200/20">🪔</div>
              
              {/* Floating Flowers */}
              <div className="absolute top-80 right-10 text-3xl text-pink-200/25">🌺</div>
              <div className="absolute bottom-20 left-32 text-3xl text-pink-200/20">🌺</div>
            </div>

            {/* Central Ganesha Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
              {/* Ganesha Image Container */}
              <div className="mb-8 relative">
                <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-2xl overflow-hidden">
                  <img 
                    src={GaneshaImage} 
                    alt="Lord Ganesha" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {/* Decorative elements around Ganesha */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400/80 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-2xl">🌸</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-400/80 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">🪔</span>
                </div>
                <div className="absolute top-8 -left-8 w-10 h-10 bg-orange-300/80 rounded-full flex items-center justify-center">
                  <span className="text-lg">🕉️</span>
                </div>
              </div>

              {/* Sacred Mantra */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">गणपति बप्पा मोरया</h1>
                <p className="text-xl mb-2">Welcome to Digital Ganesha</p>
                <p className="text-white/80 text-lg">श्री गणेशाय नमः</p>
              </div>

              {/* Sacred Mantra with Reveal Animation */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center min-h-[140px] flex flex-col justify-center">
                <div className="text-lg font-medium mb-2 leading-relaxed min-h-[60px] flex flex-col items-center justify-center space-y-2">
                  {firstLine && (
                    <div className={`relative overflow-hidden ${isFirstLineAnimating ? 'animate-reveal-text' : ''}`}
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text'
                      }}
                    >
                      <span className="mantra-glow whitespace-nowrap block text-yellow-200">
                        {firstLine}
                      </span>
                    </div>
                  )}
                  {secondLine && (
                    <div className={`relative overflow-hidden ${isSecondLineAnimating ? 'animate-reveal-text' : ''}`}
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text'
                      }}
                    >
                      <span className="mantra-glow whitespace-nowrap block text-yellow-200">
                        {secondLine}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-white/80 mt-4 leading-relaxed min-h-[50px] flex flex-col justify-center">
                  <p className="text-xs mt-2 text-white/60">{mantraTranslations[currentMantraIndex]?.meaning}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-between items-center mb-6">
                  <div></div>
                  <Link 
                    to="/login" 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Join the Divine Community</h2>
                <p className="text-gray-600">Create your account and connect with Ganesha devotees worldwide</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-orange-600 hover:text-orange-700">
                      Terms of use
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-orange-600 hover:text-orange-700">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                  </div>
                </div>

                {isGoogleConfigured ? (
                  <button
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    className="mt-4 w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                ) : (
                  <div className="mt-4 w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-500 text-center">
                    Google Sign-up temporarily unavailable
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default SignUpPage
