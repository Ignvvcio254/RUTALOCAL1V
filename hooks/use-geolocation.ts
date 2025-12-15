"use client"

import { useState, useEffect, useCallback } from 'react'
import { calculateDistance, formatDistance } from '@/lib/api/interactions-service'

/**
 * Geolocation Hook
 * 
 * Provides user location and distance calculation utilities.
 * 
 * @author Senior Engineer
 * @pattern Custom Hook
 */

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  watch?: boolean
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000, // Cache for 1 minute
    watch = false,
  } = options

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
  })

  const [watchId, setWatchId] = useState<number | null>(null)

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      error: null,
      loading: false,
    })
    console.log(`📍 [useGeolocation] Location updated: ${position.coords.latitude}, ${position.coords.longitude}`)
  }, [])

  const onError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Error desconocido al obtener ubicación'
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Permiso de ubicación denegado'
        break
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Ubicación no disponible'
        break
      case error.TIMEOUT:
        errorMessage = 'Tiempo de espera agotado'
        break
    }

    setState((prev) => ({
      ...prev,
      error: errorMessage,
      loading: false,
    }))
    console.warn(`⚠️ [useGeolocation] Error: ${errorMessage}`)
  }, [])

  // Request location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocalización no soportada',
        loading: false,
      }))
      return
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    }

    if (watch) {
      const id = navigator.geolocation.watchPosition(onSuccess, onError, geoOptions)
      setWatchId(id)
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions)
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watch, enableHighAccuracy, timeout, maximumAge, onSuccess, onError, watchId])

  /**
   * Refresh location manually
   */
  const refresh = useCallback(() => {
    if (!navigator.geolocation) return

    setState((prev) => ({ ...prev, loading: true }))
    
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy,
      timeout,
      maximumAge: 0, // Force fresh location
    })
  }, [enableHighAccuracy, timeout, onSuccess, onError])

  /**
   * Calculate distance to a point
   */
  const getDistanceTo = useCallback((lat: number, lng: number): number | null => {
    if (state.latitude === null || state.longitude === null) {
      return null
    }
    return calculateDistance(state.latitude, state.longitude, lat, lng)
  }, [state.latitude, state.longitude])

  /**
   * Get formatted distance to a point
   */
  const getFormattedDistanceTo = useCallback((lat: number, lng: number): string => {
    const distance = getDistanceTo(lat, lng)
    if (distance === null) {
      return 'Calculando...'
    }
    return formatDistance(distance)
  }, [getDistanceTo])

  return {
    ...state,
    refresh,
    getDistanceTo,
    getFormattedDistanceTo,
    hasLocation: state.latitude !== null && state.longitude !== null,
  }
}

export default useGeolocation
