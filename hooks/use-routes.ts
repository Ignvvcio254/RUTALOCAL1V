/**
 * Hook para gestión de rutas del usuario
 * CRUD completo con el backend
 * 
 * @author Senior Engineer
 * @module useRoutes
 */

'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { TokenManager } from '@/lib/auth/token-manager'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-f3cae.up.railway.app'

// Types
export interface RouteStop {
  id?: string
  business_id: string
  order: number
  duration: number // minutos
  notes?: string
  // Datos del negocio (read-only)
  business?: {
    id: string
    name: string
    category: string
    cover_image: string
    latitude: number
    longitude: number
    rating: number
  }
}

export interface Route {
  id: string
  name: string
  description: string
  stops: RouteStop[]
  stops_count: number
  total_distance: number
  estimated_duration: number
  is_public: boolean
  views: number
  likes: number
  shares: number
  created_at: string
  updated_at: string
  user?: {
    id: string
    email: string
    name: string
  }
  preview_businesses?: Array<{
    id: string
    name: string
    cover_image: string
  }>
}

export interface CreateRouteData {
  name: string
  description?: string
  is_public?: boolean
  stops: Array<{
    business_id: string
    order: number
    duration: number
    notes?: string
  }>
}

interface UseRoutesReturn {
  routes: Route[]
  loading: boolean
  error: Error | null
  // CRUD
  fetchRoutes: () => Promise<void>
  getRoute: (id: string) => Promise<Route | null>
  createRoute: (data: CreateRouteData) => Promise<Route | null>
  updateRoute: (id: string, data: Partial<CreateRouteData>) => Promise<Route | null>
  deleteRoute: (id: string) => Promise<boolean>
  // Actions
  likeRoute: (id: string) => Promise<boolean>
  unlikeRoute: (id: string) => Promise<boolean>
}

export function useRoutes(): UseRoutesReturn {
  const { isAuthenticated } = useAuth()
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getAuthHeaders = useCallback(() => {
    const token = TokenManager.getAccessToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }, [])

  /**
   * Obtener todas las rutas del usuario
   */
  const fetchRoutes = useCallback(async () => {
    if (!isAuthenticated) {
      setRoutes([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/routes/`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Error al cargar rutas')
      }

      const data = await response.json()
      setRoutes(data.data?.results || data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'))
      console.error('❌ [useRoutes] Error fetching routes:', err)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, getAuthHeaders])

  /**
   * Obtener detalle de una ruta
   */
  const getRoute = useCallback(async (id: string): Promise<Route | null> => {
    try {
      const response = await fetch(`${API_URL}/api/routes/${id}/`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Ruta no encontrada')
      }

      const data = await response.json()
      return data.data || null
    } catch (err) {
      console.error('❌ [useRoutes] Error getting route:', err)
      return null
    }
  }, [getAuthHeaders])

  /**
   * Crear nueva ruta
   */
  const createRoute = useCallback(async (data: CreateRouteData): Promise<Route | null> => {
    if (!isAuthenticated) {
      console.error('❌ [useRoutes] Must be authenticated to create route')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      console.log('📤 [useRoutes] Creating route:', data)
      
      const response = await fetch(`${API_URL}/api/routes/create/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al crear ruta')
      }

      console.log('✅ [useRoutes] Route created:', result.data)
      
      // Actualizar lista local
      setRoutes(prev => [result.data, ...prev])
      
      return result.data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido')
      setError(error)
      console.error('❌ [useRoutes] Error creating route:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, getAuthHeaders])

  /**
   * Actualizar ruta
   */
  const updateRoute = useCallback(async (id: string, data: Partial<CreateRouteData>): Promise<Route | null> => {
    if (!isAuthenticated) return null

    setLoading(true)
    
    try {
      const response = await fetch(`${API_URL}/api/routes/${id}/update/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al actualizar ruta')
      }

      // Actualizar lista local
      setRoutes(prev => prev.map(r => r.id === id ? result.data : r))
      
      return result.data
    } catch (err) {
      console.error('❌ [useRoutes] Error updating route:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, getAuthHeaders])

  /**
   * Eliminar ruta
   */
  const deleteRoute = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated) return false

    try {
      const response = await fetch(`${API_URL}/api/routes/${id}/delete/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Error al eliminar ruta')
      }

      // Actualizar lista local
      setRoutes(prev => prev.filter(r => r.id !== id))
      
      return true
    } catch (err) {
      console.error('❌ [useRoutes] Error deleting route:', err)
      return false
    }
  }, [isAuthenticated, getAuthHeaders])

  /**
   * Dar like a una ruta
   */
  const likeRoute = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated) return false

    try {
      const response = await fetch(`${API_URL}/api/routes/${id}/like/`, {
        method: 'POST',
        headers: getAuthHeaders()
      })

      return response.ok
    } catch (err) {
      console.error('❌ [useRoutes] Error liking route:', err)
      return false
    }
  }, [isAuthenticated, getAuthHeaders])

  /**
   * Quitar like de una ruta
   */
  const unlikeRoute = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated) return false

    try {
      const response = await fetch(`${API_URL}/api/routes/${id}/unlike/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      return response.ok
    } catch (err) {
      console.error('❌ [useRoutes] Error unliking route:', err)
      return false
    }
  }, [isAuthenticated, getAuthHeaders])

  return {
    routes,
    loading,
    error,
    fetchRoutes,
    getRoute,
    createRoute,
    updateRoute,
    deleteRoute,
    likeRoute,
    unlikeRoute
  }
}
