import { useState } from 'react'
import ContactFormService from '../services/ContactFormService'

const ContactFormTest = () => {
  const [testResult, setTestResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const runFormTest = async () => {
    setIsLoading(true)
    setTestResult(null)

    // Test data
    const testFormData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Form Submission',
      message: 'This is a test message to verify the contact form is working correctly.'
    }

    try {
      const result = await ContactFormService.submitContactForm(testFormData)
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message,
        error: error
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkConfiguration = () => {
    const config = ContactFormService.getFormConfig()
    return config
  }

  const config = checkConfiguration()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 to-amber-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30">
          <h1 className="text-3xl font-bold text-golden mb-8 text-center">
            Contact Form Testing
          </h1>

          {/* Configuration Status */}
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl border border-blue-500/30">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">Configuration Status</h2>
            <div className="space-y-2 text-sm">
              <div className={`flex items-center space-x-2 ${config.isConfigured ? 'text-green-300' : 'text-red-300'}`}>
                <span>{config.isConfigured ? '✅' : '❌'}</span>
                <span>Form Configuration: {config.isConfigured ? 'Configured' : 'Not Configured'}</span>
              </div>
              <div className="text-blue-200">
                <span className="font-medium">Form ID:</span> {config.formId}
              </div>
              <div className="text-blue-200">
                <span className="font-medium">Endpoint:</span> {config.endpoint}
              </div>
            </div>
            
            {!config.isConfigured && (
              <div className="mt-4 p-4 bg-red-900/30 rounded-lg border border-red-500/30">
                <p className="text-red-300 text-sm">
                  ⚠️ Form not configured! Please update the FORM_ID in `/src/config/formspree.js`
                </p>
              </div>
            )}
          </div>

          {/* Test Button */}
          <div className="text-center mb-8">
            <button
              onClick={runFormTest}
              disabled={isLoading || !config.isConfigured}
              className="bg-gradient-to-r from-golden to-golden-light text-red-950 px-8 py-4 rounded-xl font-semibold hover:from-golden-light hover:to-golden transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Testing Form...
                </>
              ) : (
                'Test Contact Form'
              )}
            </button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`p-6 rounded-xl border ${
              testResult.success 
                ? 'bg-green-900/30 border-green-500/50' 
                : 'bg-red-900/30 border-red-500/50'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                testResult.success ? 'text-green-300' : 'text-red-300'
              }`}>
                Test Result: {testResult.success ? 'SUCCESS' : 'FAILED'}
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className={testResult.success ? 'text-green-200' : 'text-red-200'}>
                  <span className="font-medium">Message:</span> {testResult.message}
                </div>
                
                {testResult.data && (
                  <div className="text-green-200">
                    <span className="font-medium">Response Data:</span>
                    <pre className="mt-2 p-3 bg-black/30 rounded text-xs overflow-auto">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  </div>
                )}
                
                {testResult.error && (
                  <div className="text-red-200">
                    <span className="font-medium">Error Details:</span>
                    <pre className="mt-2 p-3 bg-black/30 rounded text-xs overflow-auto">
                      {JSON.stringify(testResult.error, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-6 bg-gradient-to-br from-gray-900/30 to-gray-800/30 rounded-xl border border-gray-500/30">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Instructions</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>1. Make sure you have configured your Formspree Form ID in <code>/src/config/formspree.js</code></li>
              <li>2. Click "Test Contact Form" to send a test submission</li>
              <li>3. Check your email (and spam folder) for the test message</li>
              <li>4. Verify the success/error response appears correctly</li>
              <li>5. If successful, your contact form is ready to use!</li>
            </ul>
          </div>

          {/* Back to Main App */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-golden-light hover:text-golden transition-colors duration-200 underline"
            >
              ← Back to Main App
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactFormTest
