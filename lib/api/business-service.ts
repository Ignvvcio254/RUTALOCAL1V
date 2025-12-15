/**
 * Servicio centralizado para operaciones con negocios públicos
 * Proporciona acceso a la API de negocios del backend
 *
 * @author Claude Sonnet 4.5
 * @module BusinessService
 */

import { env } from '../env'
import { showError } from '../errors/error-handler'
import { mapCategorySlugToMain } from '../filters/category-mapper'

const API_URL = env.apiEndpoint

/**
 * Interfaz para negocios públicos (estructura del backend)
 */
export interface PublicBusiness {
  id: string
  name: string
  slug: string
  short_description: string
  description: string
  category: {
    id: string
    name: string
    slug: string
    icon: string
    color: string
  }
  subcategory?: string
  location: {
    lat: number
    lng: number
  }
  address: string
  neighborhood: string
  comuna?: string
  rating: string | number
  review_count: number
  price_range: number
  distance?: number
  cover_image: string
  images?: string[]
  features?: string[]
  is_open?: boolean
  closes_at?: string
  verified: boolean
  phone?: string
  email?: string
  website?: string
  instagram?: string
  status?: string
}

/**
 * Parámetros de filtro para búsqueda de negocios
 */
export interface BusinessFilters {
  category?: string
  neighborhood?: string
  rating_min?: number
  price_range?: number
  features?: string[]
  search?: string
  lat?: number
  lng?: number
  page?: number
  per_page?: number
}

/**
 * Respuesta paginada del backend
 */
export interface PaginatedResponse<T> {
  success: boolean
  data: {
    results: T[]
    pagination?: {
      page: number
      per_page: number
      total: number
      pages: number
    }
  }
}

/**
 * Obtiene todos los negocios públicos con filtros opcionales
 */
export async function getPublicBusinesses(
  filters?: BusinessFilters
): Promise<PublicBusiness[]> {
  try {
    // Construir query params
    const params = new URLSearchParams()

    if (filters?.category) params.append('category', filters.category)
    if (filters?.neighborhood) params.append('neighborhood', filters.neighborhood)
    if (filters?.rating_min) params.append('rating_min', filters.rating_min.toString())
    if (filters?.price_range) params.append('price_range', filters.price_range.toString())
    if (filters?.features?.length) params.append('features', filters.features.join(','))
    if (filters?.search) params.append('search', filters.search)
    if (filters?.lat) params.append('lat', filters.lat.toString())
    if (filters?.lng) params.append('lng', filters.lng.toString())
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.per_page) params.append('per_page', filters.per_page.toString())

    const queryString = params.toString()
    const url = `${API_URL}/businesses/${queryString ? `?${queryString}` : ''}`

    console.log('📡 Fetching businesses from:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Siempre obtener datos frescos
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data: PaginatedResponse<PublicBusiness> = await response.json()

    console.log('✅ Businesses fetched:', data.data?.results?.length || 0)

    // Si la respuesta es paginada
    if (data.success && data.data?.results) {
      return data.data.results
    }

    // Si la respuesta es un array directo
    if (Array.isArray(data)) {
      return data as unknown as PublicBusiness[]
    }

    // Si es un objeto con data
    if ((data as any).data && Array.isArray((data as any).data)) {
      return (data as any).data
    }

    console.warn('⚠️ Unexpected response format:', data)
    return []

  } catch (error) {
    console.error('❌ Error fetching businesses:', error)
    // No mostrar error al usuario si es solo carga de datos
    // El componente puede mostrar estado vacío
    return []
  }
}

/**
 * Busca negocios por texto
 */
export async function searchBusinesses(query: string): Promise<PublicBusiness[]> {
  if (!query || query.trim().length === 0) {
    return []
  }

  return getPublicBusinesses({
    search: query.trim(),
  })
}

/**
 * Obtiene un negocio por su slug
 */
export async function getBusinessBySlug(slug: string): Promise<PublicBusiness | null> {
  try {
    const response = await fetch(`${API_URL}/businesses/${slug}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.success && data.data) {
      return data.data
    }

    return data

  } catch (error) {
    console.error('❌ Error fetching business by slug:', error)
    showError(error, 'Error al Cargar Negocio')
    return null
  }
}

/**
 * Obtiene negocios destacados (con is_featured=true o mejor rating)
 */
export async function getFeaturedBusinesses(limit: number = 10): Promise<PublicBusiness[]> {
  const allBusinesses = await getPublicBusinesses({
    per_page: limit,
  })

  // Ordenar por rating descendente
  return allBusinesses.sort((a, b) => {
    const ratingA = typeof a.rating === 'string' ? parseFloat(a.rating) : a.rating
    const ratingB = typeof b.rating === 'string' ? parseFloat(b.rating) : b.rating
    return (ratingB || 0) - (ratingA || 0)
  })
}

/**
 * Obtiene negocios por categoría
 */
export async function getBusinessesByCategory(
  categorySlug: string
): Promise<PublicBusiness[]> {
  return getPublicBusinesses({
    category: categorySlug,
  })
}

/**
 * Obtiene negocios cercanos a una ubicación
 */
export async function getNearbyBusinesses(
  lat: number,
  lng: number,
  radiusKm?: number
): Promise<PublicBusiness[]> {
  return getPublicBusinesses({
    lat,
    lng,
  })
}

/**
 * Convierte PublicBusiness a formato legacy (para compatibilidad con componentes antiguos)
 * Aplica mapeo inteligente de categorías backend → frontend
 */
export function convertToLegacyFormat(business: PublicBusiness): any {
  const rating = typeof business.rating === 'string'
    ? parseFloat(business.rating)
    : business.rating

  // Map backend category slug to frontend main category
  const mainCategory = mapCategorySlugToMain(business.category?.slug)

  return {
    id: business.id,
    name: business.name,
    category: mainCategory, // Now correctly mapped to 'hospedaje' | 'gastronomia' | 'turismo'
    subcategory: business.subcategory || business.category?.name || 'General',
    rating: rating || 0,
    reviews: business.review_count || 0,
    distance: business.distance || 0,
    priceRange: business.price_range || 2,
    isOpen: business.is_open !== false,
    hasOffer: false,
    isVerified: business.verified || false,
    isAccessible: business.features?.includes('Accesible') || false,
    attributes: business.features || [],
    experienceTags: [],
    coordinates: [business.location.lat, business.location.lng] as [number, number],
    image: business.cover_image,
    description: business.short_description || business.description || '',
  }
}

/**
 * Hook para usar negocios públicos con React
 */
export function usePublicBusinesses() {
  return {
    getPublicBusinesses,
    searchBusinesses,
    getBusinessBySlug,
    getFeaturedBusinesses,
    getBusinessesByCategory,
    getNearbyBusinesses,
  }
}
