/**
 * Hook personalizado para manejar negocios públicos
 * Proporciona estado, carga y error handling para negocios
 *
 * @author Claude Sonnet 4.5
 * @module useBusinesses
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getPublicBusinesses,
  type PublicBusiness,
  type BusinessFilters,
  convertToLegacyFormat
} from '@/lib/api/business-service'
import type { Business } from '@/lib/filters/filter-utils'

interface UseBusinessesOptions {
  filters?: BusinessFilters
  autoFetch?: boolean
  useLegacyFormat?: boolean
}

interface UseBusinessesReturn {
  businesses: Business[]
  rawBusinesses: PublicBusiness[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  hasData: boolean
}

/**
 * Hook para obtener y gestionar negocios públicos
 */
export function useBusinesses(options: UseBusinessesOptions = {}): UseBusinessesReturn {
  const { filters, autoFetch = true, useLegacyFormat = true } = options

  const [rawBusinesses, setRawBusinesses] = useState<PublicBusiness[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<Error | null>(null)

  const fetchBusinesses = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('🔄 Fetching businesses with filters:', filters)
      const data = await getPublicBusinesses(filters)

      console.log('✅ Received businesses:', data.length)
      setRawBusinesses(data)

      // Convertir a formato legacy si es necesario
      if (useLegacyFormat) {
        const converted = data.map(convertToLegacyFormat)
        setBusinesses(converted)
      } else {
        setBusinesses(data as unknown as Business[])
      }

    } catch (err) {
      console.error('❌ Error in useBusinesses:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setRawBusinesses([])
      setBusinesses([])
    } finally {
      setLoading(false)
    }
  }, [filters, useLegacyFormat])

  // Auto-fetch en mount si autoFetch está activado
  useEffect(() => {
    if (autoFetch) {
      fetchBusinesses()
    }
  }, [autoFetch, fetchBusinesses])

  return {
    businesses,
    rawBusinesses,
    loading,
    error,
    refetch: fetchBusinesses,
    hasData: businesses.length > 0,
  }
}

/**
 * Hook simplificado para obtener todos los negocios
 */
export function useAllBusinesses() {
  return useBusinesses({ autoFetch: true })
}

/**
 * Hook para obtener negocios por categoría
 */
export function useBusinessesByCategory(categorySlug: string) {
  return useBusinesses({
    filters: { category: categorySlug },
    autoFetch: Boolean(categorySlug),
  })
}

/**
 * Hook para buscar negocios por texto
 */
export function useBusinessSearch(query: string) {
  return useBusinesses({
    filters: { search: query },
    autoFetch: query.length >= 2, // Solo buscar si hay al menos 2 caracteres
  })
}
