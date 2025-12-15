/**
 * Hook for Map Businesses
 * 
 * Fetches real business data from API and transforms it for the map.
 * Replaces static MAP_BUSINESSES with dynamic data.
 * 
 * @author Senior Engineer
 * @pattern Custom Hook Pattern
 * @principle Separation of Concerns - Data fetching isolated from UI
 */

'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { getPublicBusinesses, type PublicBusiness } from '@/lib/api/business-service'
import { transformToMapBusinesses } from '@/lib/adapters/map-business-adapter'
import type { MapBusiness } from '@/lib/mapbox-data'

interface UseMapBusinessesOptions {
  autoFetch?: boolean
  refreshInterval?: number // ms, 0 = no auto-refresh
}

interface UseMapBusinessesReturn {
  businesses: MapBusiness[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  lastUpdated: Date | null
}

/**
 * Hook to fetch and manage map businesses from the API
 * 
 * @example
 * const { businesses, loading, error } = useMapBusinesses()
 */
export function useMapBusinesses(options: UseMapBusinessesOptions = {}): UseMapBusinessesReturn {
  const { autoFetch = true, refreshInterval = 0 } = options

  const [rawBusinesses, setRawBusinesses] = useState<PublicBusiness[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Transform raw data to map format
  const businesses = useMemo(() => {
    return transformToMapBusinesses(rawBusinesses)
  }, [rawBusinesses])

  // Fetch function
  const fetchBusinesses = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('🗺️ [useMapBusinesses] Fetching businesses for map...')
      const data = await getPublicBusinesses()
      
      console.log(`✅ [useMapBusinesses] Received ${data.length} businesses`)
      
      // Log businesses with coordinates for debugging
      const withCoords = data.filter(b => b.location?.lat && b.location?.lng)
      console.log(`📍 [useMapBusinesses] ${withCoords.length} businesses have valid coordinates`)
      
      setRawBusinesses(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('❌ [useMapBusinesses] Error:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch businesses'))
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchBusinesses()
    }
  }, [autoFetch, fetchBusinesses])

  // Optional auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchBusinesses, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval, fetchBusinesses])

  return {
    businesses,
    loading,
    error,
    refetch: fetchBusinesses,
    lastUpdated,
  }
}

export default useMapBusinesses
