"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { calculateDistance, formatDistance } from '@/lib/api/interactions-service'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

/**
 * useGeolocation Hook - Fixed version
 * Prevents multiple re-renders and infinite loops
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  })
  
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocalización no soportada', loading: false }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        })
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: error.code === 1 ? 'Permiso denegado' : 'No disponible',
          loading: false,
        }))
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  const getDistanceTo = useCallback((lat: number, lng: number): number | null => {
    if (state.latitude === null || state.longitude === null) return null
    return calculateDistance(state.latitude, state.longitude, lat, lng)
  }, [state.latitude, state.longitude])

  const getFormattedDistanceTo = useCallback((lat: number, lng: number): string => {
    const distance = getDistanceTo(lat, lng)
    return distance === null ? '' : formatDistance(distance)
  }, [getDistanceTo])

  return {
    ...state,
    getDistanceTo,
    getFormattedDistanceTo,
    hasLocation: state.latitude !== null && state.longitude !== null,
  }
}

export default useGeolocation
