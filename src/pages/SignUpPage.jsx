import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GoogleAuthService from '../services/GoogleAuthService'
import GaneshaImage from '../assets/Ganesh.jpeg'
import Header from '../components/Header'
import Captcha from '../components/Captcha'

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
  const [captchaValue, setCaptchaValue] = useState('')
  const [isCaptchaValid, setIsCaptchaValid] = useState(false)
  const [captchaError, setCaptchaError] = useState('')
  const captchaRef = useRef(null)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    color: 'bg-gray-300',
    width: '0%'
  })
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

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    if (!password) {
      return {
        score: 0,
        feedback: '',
        color: 'bg-gray-300',
        width: '0%'
      }
    }

    let score = 0
    let feedback = []
    
    // Length check
    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('At least 8 characters')
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('One uppercase letter')
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('One lowercase letter')
    }
    
    // Number check
    if (/[0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push('One number')
    }
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push('One special character')
    }

    // Determine strength level
    let strengthText = ''
    let color = ''
    let width = ''

    switch (score) {
      case 0:
      case 1:
        strengthText = 'Very Weak'
        color = 'bg-red-500'
        width = '20%'
        break
      case 2:
        strengthText = 'Weak'
        color = 'bg-orange-500'
        width = '40%'
        break
      case 3:
        strengthText = 'Fair'
        color = 'bg-yellow-500'
        width = '60%'
        break
      case 4:
        strengthText = 'Good'
        color = 'bg-blue-500'
        width = '80%'
        break
      case 5:
        strengthText = 'Strong'
        color = 'bg-green-500'
        width = '100%'
        break
      default:
        strengthText = 'Very Weak'
        color = 'bg-red-500'
        width = '20%'
    }

    return {
      score,
      feedback: feedback.length > 0 ? `Missing: ${feedback.join(', ')}` : 'Strong password! 🔒',
      color,
      width,
      strengthText
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Calculate password strength when password field changes
    if (name === 'password') {
      const strength = calculatePasswordStrength(value)
      setPasswordStrength(strength)
    }
    
    setError('')
  }

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value)
    setCaptchaError('')
  }

  const handleCaptchaValidate = (isValid) => {
    setIsCaptchaValid(isValid)
    // Don't show error while typing, only on submit
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setCaptchaError('')

    // Validate captcha on submit
    const isValidCaptcha = captchaRef.current && captchaRef.current.validateCaptcha()
    
    if (!isValidCaptcha || captchaValue.length !== 5) {
      setCaptchaError('Invalid captcha')
      setIsLoading(false)
      // Auto-refresh captcha after showing error
      setTimeout(() => {
        if (captchaRef.current) {
          captchaRef.current.refreshCaptcha()
        }
      }, 1500)
      return
    }

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

    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password. Your password should include uppercase, lowercase, numbers, and special characters.')
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
      setCaptchaValue('')
      setIsCaptchaValid(false)
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
    <div className="relative">
      <Header />
      
      <div className="pt-16">
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Left Side - Spiritual Ganesha Design */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-800 via-red-700 to-amber-700 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              {/* Floating Om Symbols */}
              <div className="absolute top-20 left-20 text-6xl text-yellow-300/20 animate-pulse">🕉️</div>
              <div className="absolute top-40 right-20 text-4xl text-yellow-200/15 animate-bounce">🕉️</div>
              <div className="absolute bottom-40 left-10 text-5xl text-yellow-300/10">🕉️</div>
              
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
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-red-950/90 to-amber-900/90 backdrop-blur-sm">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-between items-center mb-6">
                  <div></div>
                  <Link 
                    to="/login" 
                    className="bg-yellow-600/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                  >
                    Sign In
                  </Link>
                </div>
                
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">Join the Divine Community</h2>
                <p className="text-yellow-200/80">Create your account and connect with Ganesha devotees worldwide</p>
              </div>

              {error && (
                <div className="bg-red-800/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center backdrop-blur-sm">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-yellow-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-red-900/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-yellow-100 placeholder-yellow-300/50 backdrop-blur-sm"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-yellow-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-red-900/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-yellow-100 placeholder-yellow-300/50 backdrop-blur-sm"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-yellow-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full px-3 py-2 bg-red-900/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-yellow-100 placeholder-yellow-300/50 backdrop-blur-sm"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-yellow-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="w-full px-3 py-2 bg-red-900/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-yellow-100 placeholder-yellow-300/50 backdrop-blur-sm"
                    placeholder="Create a password"
                  />
                  
                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-yellow-200">Password Strength:</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength.score <= 2 ? 'text-red-300' :
                          passwordStrength.score === 3 ? 'text-yellow-300' :
                          passwordStrength.score === 4 ? 'text-blue-300' :
                          'text-green-300'
                        }`}>
                          {passwordStrength.strengthText}
                        </span>
                      </div>
                      <div className="w-full bg-red-900/30 rounded-full h-2 backdrop-blur-sm">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: passwordStrength.width }}
                        ></div>
                      </div>
                      <p className="text-xs text-yellow-200/80 mt-1">{passwordStrength.feedback}</p>
                    </div>
                  )}
                </div>

                {/* Captcha Component */}
                <div>
                  <Captcha
                    ref={captchaRef}
                    onCaptchaChange={handleCaptchaChange}
                    onCaptchaValidate={handleCaptchaValidate}
                    error={captchaError}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-yellow-500/30 rounded bg-red-900/50"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-yellow-200">
                    I agree to the{' '}
                    <a href="#" className="text-yellow-300 hover:text-yellow-200 underline">
                      Terms of use
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-yellow-300 hover:text-yellow-200 underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-900 mr-2 inline-block"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-yellow-200">
                  Already have an account?{' '}
                  <Link to="/login" className="text-yellow-300 hover:text-yellow-200 font-medium underline">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-yellow-500/30" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gradient-to-r from-red-950/90 to-amber-900/90 text-yellow-200">Or continue with</span>
                  </div>
                </div>

                {isGoogleConfigured ? (
                  <button
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    className="mt-4 w-full bg-red-900/50 border border-yellow-500/30 rounded-lg px-4 py-3 text-yellow-200 font-medium hover:bg-red-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center backdrop-blur-sm"
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
                  <div className="mt-4 w-full bg-red-900/30 border border-yellow-500/20 rounded-lg px-4 py-3 text-yellow-300/70 text-center backdrop-blur-sm">
                    Google Sign-up temporarily unavailable
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
