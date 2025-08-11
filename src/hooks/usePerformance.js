/**
 * Performance monitoring hook for Core Web Vitals and custom metrics
 * Tracks LCP, FID, CLS, TTFB, and custom performance metrics
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export const usePerformance = (options = {}) => {
  const {
    enableWebVitals = true,
    enableCustomMetrics = true,
    reportingInterval = 30000, // 30 seconds
    onMetricUpdate,
    onReport
  } = options

  const [metrics, setMetrics] = useState({
    webVitals: {
      lcp: null,      // Largest Contentful Paint
      fid: null,      // First Input Delay
      cls: null,      // Cumulative Layout Shift
      ttfb: null,     // Time to First Byte
      fcp: null       // First Contentful Paint
    },
    custom: {
      componentLoadTime: {},
      apiResponseTimes: {},
      resourceLoadTimes: {},
      memoryUsage: null,
      networkInfo: null
    },
    runtime: {
      startTime: Date.now(),
      pageViews: 1,
      sessionDuration: 0,
      interactions: 0
    }
  })

  const [isSupported, setIsSupported] = useState({
    performance: false,
    observer: false,
    memory: false,
    connection: false
  })

  const observersRef = useRef([])
  const metricsBufferRef = useRef([])
  const reportingTimerRef = useRef(null)

  // Check browser support
  useEffect(() => {
    setIsSupported({
      performance: 'performance' in window,
      observer: 'PerformanceObserver' in window,
      memory: 'memory' in performance,
      connection: 'connection' in navigator
    })
  }, [])

  // Web Vitals measurement
  const measureWebVitals = useCallback(() => {
    if (!enableWebVitals || !isSupported.observer) return

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      setMetrics(prev => ({
        ...prev,
        webVitals: {
          ...prev.webVitals,
          lcp: {
            value: lastEntry.startTime,
            rating: lastEntry.startTime <= 2500 ? 'good' : lastEntry.startTime <= 4000 ? 'needs-improvement' : 'poor',
            timestamp: Date.now()
          }
        }
      }))

      if (onMetricUpdate) {
        onMetricUpdate('lcp', lastEntry.startTime)
      }
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      observersRef.current.push(lcpObserver)
    } catch (e) {
      console.warn('LCP measurement not supported')
    }

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        setMetrics(prev => ({
          ...prev,
          webVitals: {
            ...prev.webVitals,
            fid: {
              value: entry.processingStart - entry.startTime,
              rating: entry.processingStart - entry.startTime <= 100 ? 'good' : 
                      entry.processingStart - entry.startTime <= 300 ? 'needs-improvement' : 'poor',
              timestamp: Date.now()
            }
          }
        }))

        if (onMetricUpdate) {
          onMetricUpdate('fid', entry.processingStart - entry.startTime)
        }
      })
    })

    try {
      fidObserver.observe({ entryTypes: ['first-input'] })
      observersRef.current.push(fidObserver)
    } catch (e) {
      console.warn('FID measurement not supported')
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })

      setMetrics(prev => ({
        ...prev,
        webVitals: {
          ...prev.webVitals,
          cls: {
            value: clsValue,
            rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
            timestamp: Date.now()
          }
        }
      }))

      if (onMetricUpdate) {
        onMetricUpdate('cls', clsValue)
      }
    })

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      observersRef.current.push(clsObserver)
    } catch (e) {
      console.warn('CLS measurement not supported')
    }

    // Time to First Byte (TTFB)
    if (isSupported.performance) {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation) {
        const ttfbValue = navigation.responseStart - navigation.requestStart
        
        setMetrics(prev => ({
          ...prev,
          webVitals: {
            ...prev.webVitals,
            ttfb: {
              value: ttfbValue,
              rating: ttfbValue <= 800 ? 'good' : ttfbValue <= 1800 ? 'needs-improvement' : 'poor',
              timestamp: Date.now()
            }
          }
        }))

        if (onMetricUpdate) {
          onMetricUpdate('ttfb', ttfbValue)
        }
      }
    }

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        setMetrics(prev => ({
          ...prev,
          webVitals: {
            ...prev.webVitals,
            fcp: {
              value: entry.startTime,
              rating: entry.startTime <= 1800 ? 'good' : entry.startTime <= 3000 ? 'needs-improvement' : 'poor',
              timestamp: Date.now()
            }
          }
        }))

        if (onMetricUpdate) {
          onMetricUpdate('fcp', entry.startTime)
        }
      })
    })

    try {
      fcpObserver.observe({ entryTypes: ['paint'] })
      observersRef.current.push(fcpObserver)
    } catch (e) {
      console.warn('FCP measurement not supported')
    }
  }, [enableWebVitals, isSupported.observer, isSupported.performance, onMetricUpdate])

  // Custom metrics measurement
  const measureCustomMetrics = useCallback(() => {
    if (!enableCustomMetrics) return

    // Memory usage
    if (isSupported.memory) {
      const memoryInfo = {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      }

      setMetrics(prev => ({
        ...prev,
        custom: {
          ...prev.custom,
          memoryUsage: memoryInfo
        }
      }))
    }

    // Network information
    if (isSupported.connection) {
      const networkInfo = {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData,
        timestamp: Date.now()
      }

      setMetrics(prev => ({
        ...prev,
        custom: {
          ...prev.custom,
          networkInfo
        }
      }))
    }

    // Resource load times
    if (isSupported.performance) {
      const resources = performance.getEntriesByType('resource')
      const resourceTimes = {}

      resources.forEach(resource => {
        const loadTime = resource.responseEnd - resource.startTime
        const resourceType = resource.initiatorType || 'other'
        
        if (!resourceTimes[resourceType]) {
          resourceTimes[resourceType] = []
        }
        
        resourceTimes[resourceType].push({
          name: resource.name,
          loadTime,
          size: resource.transferSize
        })
      })

      setMetrics(prev => ({
        ...prev,
        custom: {
          ...prev.custom,
          resourceLoadTimes: resourceTimes
        }
      }))
    }
  }, [enableCustomMetrics, isSupported.memory, isSupported.connection, isSupported.performance])

  // Track component load time
  const trackComponentLoad = useCallback((componentName, startTime = null) => {
    const start = startTime || performance.now()
    
    return () => {
      const loadTime = performance.now() - start
      
      setMetrics(prev => ({
        ...prev,
        custom: {
          ...prev.custom,
          componentLoadTime: {
            ...prev.custom.componentLoadTime,
            [componentName]: {
              loadTime,
              timestamp: Date.now()
            }
          }
        }
      }))

      if (onMetricUpdate) {
        onMetricUpdate('componentLoad', { componentName, loadTime })
      }
    }
  }, [onMetricUpdate])

  // Track API response time
  const trackApiCall = useCallback((apiName, startTime = null) => {
    const start = startTime || performance.now()
    
    return (success = true, error = null) => {
      const responseTime = performance.now() - start
      
      setMetrics(prev => ({
        ...prev,
        custom: {
          ...prev.custom,
          apiResponseTimes: {
            ...prev.custom.apiResponseTimes,
            [apiName]: {
              responseTime,
              success,
              error,
              timestamp: Date.now()
            }
          }
        }
      }))

      if (onMetricUpdate) {
        onMetricUpdate('apiCall', { apiName, responseTime, success, error })
      }
    }
  }, [onMetricUpdate])

  // Track user interaction
  const trackInteraction = useCallback((interactionType = 'click') => {
    setMetrics(prev => ({
      ...prev,
      runtime: {
        ...prev.runtime,
        interactions: prev.runtime.interactions + 1,
        sessionDuration: Date.now() - prev.runtime.startTime
      }
    }))

    if (onMetricUpdate) {
      onMetricUpdate('interaction', { type: interactionType, count: metrics.runtime.interactions + 1 })
    }
  }, [onMetricUpdate, metrics.runtime.interactions])

  // Get performance score
  const getPerformanceScore = useCallback(() => {
    const { webVitals } = metrics
    let score = 0
    let count = 0

    // Score each web vital (0-100)
    Object.entries(webVitals).forEach(([key, value]) => {
      if (value && value.rating) {
        count++
        switch (value.rating) {
          case 'good':
            score += 100
            break
          case 'needs-improvement':
            score += 50
            break
          case 'poor':
            score += 0
            break
        }
      }
    })

    return count > 0 ? Math.round(score / count) : null
  }, [metrics])

  // Generate performance report
  const generateReport = useCallback(() => {
    const report = {
      timestamp: Date.now(),
      session: {
        duration: Date.now() - metrics.runtime.startTime,
        pageViews: metrics.runtime.pageViews,
        interactions: metrics.runtime.interactions
      },
      webVitals: metrics.webVitals,
      custom: metrics.custom,
      score: getPerformanceScore(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      }
    }

    metricsBufferRef.current.push(report)

    if (onReport) {
      onReport(report)
    }

    return report
  }, [metrics, getPerformanceScore, onReport])

  // Start performance monitoring
  useEffect(() => {
    measureWebVitals()
    measureCustomMetrics()

    // Set up periodic reporting
    if (reportingInterval > 0) {
      reportingTimerRef.current = setInterval(() => {
        generateReport()
        measureCustomMetrics() // Update custom metrics periodically
      }, reportingInterval)
    }

    // Update session duration periodically
    const sessionTimer = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        runtime: {
          ...prev.runtime,
          sessionDuration: Date.now() - prev.runtime.startTime
        }
      }))
    }, 1000)

    return () => {
      // Clean up observers
      observersRef.current.forEach(observer => {
        try {
          observer.disconnect()
        } catch (e) {
          console.warn('Error disconnecting performance observer:', e)
        }
      })

      // Clear timers
      if (reportingTimerRef.current) {
        clearInterval(reportingTimerRef.current)
      }
      clearInterval(sessionTimer)
    }
  }, [measureWebVitals, measureCustomMetrics, reportingInterval, generateReport])

  return {
    // Current metrics
    metrics,
    isSupported,
    
    // Methods
    trackComponentLoad,
    trackApiCall,
    trackInteraction,
    generateReport,
    getPerformanceScore,
    
    // Computed values
    performanceScore: getPerformanceScore(),
    sessionDuration: Date.now() - metrics.runtime.startTime,
    
    // Buffer for analytics
    metricsBuffer: metricsBufferRef.current
  }
}

export default usePerformance
