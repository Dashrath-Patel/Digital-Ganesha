import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

const Captcha = forwardRef(({ onCaptchaChange, onCaptchaValidate, error }, ref) => {
  const [captchaText, setCaptchaText] = useState('')
  const [userInput, setUserInput] = useState('')
  const canvasRef = useRef(null)

  // Generate random captcha with alphanumeric and special characters
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Draw captcha on canvas with distortion and noise
  const drawCaptcha = (text) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Background with gradient - dark theme
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#451a03')
    gradient.addColorStop(1, '#7c2d12')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add noise lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 50 + 50}, 0.4)`
      ctx.lineWidth = Math.random() * 2
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.stroke()
    }
    
    // Add noise dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 50 + 50}, 0.6)`
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2)
    }
    
    // Draw captcha text with different styles for each character
    ctx.textBaseline = 'middle'
    const textWidth = canvas.width - 20
    const charWidth = textWidth / text.length
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const x = 10 + (i * charWidth) + (Math.random() * 10 - 5)
      const y = canvas.height / 2 + (Math.random() * 10 - 5)
      
      // Random font size and style
      const fontSize = 20 + Math.random() * 8
      const fontFamily = ['Arial', 'Times', 'Courier', 'Verdana'][Math.floor(Math.random() * 4)]
      const fontWeight = ['normal', 'bold'][Math.floor(Math.random() * 2)]
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
      
      // Bright yellow/white colors for visibility
      const colors = ['#fbbf24', '#f59e0b', '#ffffff', '#fde047', '#facc15']
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
      
      // Add text shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      ctx.shadowBlur = 2
      
      // Rotate character slightly
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((Math.random() * 0.4 - 0.2))
      ctx.fillText(char, 0, 0)
      ctx.restore()
      
      // Reset shadow for next character
      ctx.shadowColor = 'transparent'
    }
  }

  // Initialize captcha on component mount
  useEffect(() => {
    refreshCaptcha()
  }, [])

  // Expose refreshCaptcha and validateCaptcha methods to parent component
  useImperativeHandle(ref, () => ({
    refreshCaptcha,
    validateCaptcha: () => userInput === captchaText,
    getCaptchaValue: () => userInput
  }))

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha()
    setCaptchaText(newCaptcha)
    setUserInput('')
    onCaptchaChange('')
    
    // Draw after state update
    setTimeout(() => {
      drawCaptcha(newCaptcha)
    }, 0)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setUserInput(value)
    onCaptchaChange(value)
    
    // Only validate captcha, don't auto-refresh
    const isValid = value === captchaText
    onCaptchaValidate(isValid)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-yellow-300 mb-2">
        <span className="flex items-center">
          <span className="mr-2">🔒</span>
          Captcha Verification
        </span>
      </label>
      
      {/* Captcha Canvas */}
      <div className="flex items-center space-x-3">
        <canvas
          ref={canvasRef}
          width={160}
          height={60}
          className="border border-yellow-500/30 rounded-lg bg-red-900/50 backdrop-blur-sm"
        />
        <button
          type="button"
          onClick={refreshCaptcha}
          className="p-2 text-yellow-300 hover:text-yellow-200 transition-colors bg-red-900/50 border border-yellow-500/30 rounded-lg backdrop-blur-sm"
          title="Refresh Captcha"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {/* Captcha Input */}
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter the 5 characters shown above"
        className={`w-full px-4 py-3 bg-red-900/50 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-yellow-100 placeholder-yellow-300/50 backdrop-blur-sm transition-all ${
          error ? 'border-red-400 bg-red-800/50' : 'border-yellow-500/30'
        }`}
        maxLength={5}
      />
      
      {error && (
        <p className="text-sm text-red-300 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
      
      <p className="text-xs text-yellow-200/60">
        Enter exactly 5 characters as shown in the image above
      </p>
    </div>
  )
})

Captcha.displayName = 'Captcha'

export default Captcha
