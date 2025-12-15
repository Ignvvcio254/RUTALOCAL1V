/**
 * Hook personalizado para manejar negocios públicos
 * Proporciona estado, carga y error handling para negocios
 *
 * @author Claude Sonnet 4.5
 * @module useBusinesses
 */

'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
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
  debounceMs?: number
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
 * Optimizado con memoization y debouncing para evitar loops infinitos
 */
export function useBusinesses(options: UseBusinessesOptions = {}): UseBusinessesReturn {
  const { 
    filters, 
    autoFetch = true, 
    useLegacyFormat = true,
    debounceMs = 0 
  } = options

  const [rawBusinesses, setRawBusinesses] = useState<PublicBusiness[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  // Ref para controlar fetch en progreso
  const abortControllerRef = useRef<AbortController | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Serializar filters para evitar cambios de referencia
  const filtersKey = useMemo(() => 
    JSON.stringify(filters || {}), 
    [filters]
  )

  const fetchBusinesses = useCallback(async () => {
    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
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
      // Ignorar errores de abort
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      console.error('❌ Error in useBusinesses:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setRawBusinesses([])
      setBusinesses([])
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [filtersKey, useLegacyFormat]) // Usar filtersKey en lugar de filters

  // Auto-fetch con debouncing
  useEffect(() => {
    if (!autoFetch) return

    // Limpiar timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Si hay debounce, esperar
    if (debounceMs > 0) {
      setLoading(true) // Mostrar loading inmediatamente
      debounceTimerRef.current = setTimeout(() => {
        fetchBusinesses()
      }, debounceMs)
    } else {
      fetchBusinesses()
    }

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [autoFetch, filtersKey, debounceMs]) // Dependencias estables

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
 * Hook para buscar negocios por texto con debouncing
 * Evita múltiples requests mientras el usuario escribe
 */
export function useBusinessSearch(query: string, debounceMs: number = 500) {
  return useBusinesses({
    filters: query.length >= 2 ? { search: query } : undefined,
    autoFetch: query.length >= 2,
    debounceMs, // Debouncing de 500ms por defecto
  })
}
