/**
 * Geolocation hook for location-based features
 * Provides current position, watching position changes, and location utilities
 */

import { useState, useEffect, useRef, useCallback } from 'react'

export const useGeolocation = (options = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5 minutes
    watch = false,
    onLocationChange,
    onError
  } = options

  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  
  const watchIdRef = useRef(null)
  const timeoutRef = useRef(null)

  // Check geolocation support
  useEffect(() => {
    setIsSupported('geolocation' in navigator)
  }, [])

  // Geolocation options
  const geoOptions = {
    enableHighAccuracy,
    timeout,
    maximumAge
  }

  // Success callback
  const handleSuccess = useCallback((pos) => {
    const locationData = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      altitude: pos.coords.altitude,
      altitudeAccuracy: pos.coords.altitudeAccuracy,
      heading: pos.coords.heading,
      speed: pos.coords.speed,
      timestamp: pos.timestamp
    }

    setPosition(locationData)
    setError(null)
    setLoading(false)

    if (onLocationChange) {
      onLocationChange(locationData)
    }
  }, [onLocationChange])

  // Error callback
  const handleError = useCallback((err) => {
    const errorInfo = {
      code: err.code,
      message: err.message,
      type: getErrorType(err.code)
    }

    setError(errorInfo)
    setLoading(false)

    if (onError) {
      onError(errorInfo)
    }
  }, [onError])

  // Get error type description
  const getErrorType = (code) => {
    switch (code) {
      case 1:
        return 'PERMISSION_DENIED'
      case 2:
        return 'POSITION_UNAVAILABLE'
      case 3:
        return 'TIMEOUT'
      default:
        return 'UNKNOWN_ERROR'
    }
  }

  // Get current position
  const getCurrentPosition = useCallback(() => {
    if (!isSupported) {
      const notSupportedError = {
        code: 0,
        message: 'Geolocation is not supported by this browser',
        type: 'NOT_SUPPORTED'
      }
      setError(notSupportedError)
      if (onError) onError(notSupportedError)
      return
    }

    setLoading(true)
    setError(null)

    // Set timeout for loading state
    timeoutRef.current = setTimeout(() => {
      setLoading(false)
    }, timeout + 1000)

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      geoOptions
    )
  }, [isSupported, handleSuccess, handleError, geoOptions, timeout, onError])

  // Start watching position
  const startWatching = useCallback(() => {
    if (!isSupported || watchIdRef.current) {
      return
    }

    setLoading(true)
    setError(null)

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      geoOptions
    )
  }, [isSupported, handleSuccess, handleError, geoOptions])

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setLoading(false)
  }, [])

  // Auto-start watching if enabled
  useEffect(() => {
    if (watch) {
      startWatching()
    } else {
      stopWatching()
    }

    return () => {
      stopWatching()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [watch, startWatching, stopWatching])

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c // Distance in kilometers
  }, [])

  // Get distance to a point
  const getDistanceTo = useCallback((latitude, longitude) => {
    if (!position) return null
    return calculateDistance(
      position.latitude,
      position.longitude,
      latitude,
      longitude
    )
  }, [position, calculateDistance])

  // Check if position is within radius of a point
  const isWithinRadius = useCallback((latitude, longitude, radius) => {
    const distance = getDistanceTo(latitude, longitude)
    return distance !== null && distance <= radius
  }, [getDistanceTo])

  // Get formatted address (requires geocoding API)
  const getAddress = useCallback(async (lat = null, lng = null) => {
    const latitude = lat || position?.latitude
    const longitude = lng || position?.longitude

    if (!latitude || !longitude) {
      throw new Error('No coordinates available')
    }

    try {
      // Using a public geocoding service (replace with your preferred service)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
      
      if (!response.ok) {
        throw new Error('Geocoding failed')
      }
      
      const data = await response.json()
      return {
        formatted: data.display_name || `${latitude}, ${longitude}`,
        city: data.city,
        state: data.principalSubdivision,
        country: data.countryName,
        postalCode: data.postcode,
        raw: data
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      throw error
    }
  }, [position])

  return {
    // Current state
    position,
    error,
    loading,
    isSupported,
    isWatching: !!watchIdRef.current,

    // Methods
    getCurrentPosition,
    startWatching,
    stopWatching,
    getDistanceTo,
    isWithinRadius,
    calculateDistance,
    getAddress
  }
}

// Hook for nearby places detection
export const useNearbyPlaces = (radius = 5, options = {}) => {
  const [nearbyPlaces, setNearbyPlaces] = useState([])
  const [loading, setLoading] = useState(false)
  
  const { position, getCurrentPosition } = useGeolocation(options)

  const findNearbyPlaces = useCallback(async (places = []) => {
    if (!position || places.length === 0) {
      return []
    }

    setLoading(true)

    try {
      const nearby = places.filter(place => {
        const R = 6371 // Earth's radius in kilometers
        const dLat = (place.latitude - position.latitude) * Math.PI / 180
        const dLon = (place.longitude - position.longitude) * Math.PI / 180
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(position.latitude * Math.PI / 180) * Math.cos(place.latitude * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        const distance = R * c

        return distance <= radius
      }).map(place => ({
        ...place,
        distance: (() => {
          const R = 6371
          const dLat = (place.latitude - position.latitude) * Math.PI / 180
          const dLon = (place.longitude - position.longitude) * Math.PI / 180
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(position.latitude * Math.PI / 180) * Math.cos(place.latitude * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
          return R * c
        })()
      })).sort((a, b) => a.distance - b.distance)

      setNearbyPlaces(nearby)
      return nearby
    } catch (error) {
      console.error('Error finding nearby places:', error)
      return []
    } finally {
      setLoading(false)
    }
  }, [position, radius])

  return {
    position,
    nearbyPlaces,
    loading,
    findNearbyPlaces,
    getCurrentPosition
  }
}

export default useGeolocation
