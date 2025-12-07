import type { FilterState } from '@/contexts/filter-context'
import type { MainCategoryId } from './filter-config'

/**
 * Utilidades para filtrado de negocios
 */

// Tipo de negocio (extendido para match con filtros)
export interface Business {
  id: string
  name: string
  category: MainCategoryId
  subcategory: string
  rating: number
  reviews: number
  distance: number // en metros
  priceRange: number // 1-4 ($, $$, $$$, $$$$)
  isOpen: boolean
  hasOffer: boolean
  isVerified: boolean
  isAccessible: boolean
  attributes: string[]
  experienceTags: string[]
  coordinates: [number, number]
  image: string
  description: string
}

/**
 * Filtra negocios basándose en el estado de filtros
 */
export function filterBusinesses(
  businesses: Business[],
  filters: FilterState
): Business[] {
  let filtered = [...businesses]

  // Filtro por categoría principal
  if (filters.mainCategory !== 'all') {
    filtered = filtered.filter((b) => b.category === filters.mainCategory)
  }

  // Filtro por experiencias
  if (filters.experiences.length > 0) {
    filtered = filtered.filter((b) =>
      filters.experiences.some((exp) => b.experienceTags.includes(exp))
    )
  }

  // Filtros de atributos
  if (filters.attributes.length > 0) {
    filtered = filtered.filter((b) => {
      return filters.attributes.every((attr) => {
        switch (attr) {
          case 'accessible':
            return b.isAccessible
          case 'top-rated':
            return b.rating >= 4.0
          case 'open-now':
            return b.isOpen
          case 'offers':
            return b.hasOffer
          case 'quick':
            return b.distance <= 1800 // 30min caminando ~1.8km
          case 'verified':
            return b.isVerified
          default:
            return b.attributes.includes(attr)
        }
      })
    })
  }

  // Filtro por búsqueda
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.subcategory.toLowerCase().includes(query)
    )
  }

  // Filtro por rango de precio
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) {
    // Convertir priceRange (1-4) a estimación de precio
    const minPrice = filters.priceRange[0]
    const maxPrice = filters.priceRange[1]

    filtered = filtered.filter((b) => {
      const businessPrice = b.priceRange * 25000 // Estimación: $ = 25k, $$ = 50k, etc.
      return businessPrice >= minPrice && businessPrice <= maxPrice
    })
  }

  return filtered
}

/**
 * Ordena negocios según criterio
 */
export function sortBusinesses(
  businesses: Business[],
  sortBy: FilterState['sortBy'],
  userLocation?: [number, number]
): Business[] {
  const sorted = [...businesses]

  switch (sortBy) {
    case 'distance':
      return sorted.sort((a, b) => a.distance - b.distance)

    case 'rating':
      return sorted.sort((a, b) => {
        // Primero por rating, luego por número de reviews
        if (b.rating === a.rating) {
          return b.reviews - a.reviews
        }
        return b.rating - a.rating
      })

    case 'price':
      return sorted.sort((a, b) => a.priceRange - b.priceRange)

    case 'relevance':
    default:
      // Relevancia: combina rating, reviews y distancia
      return sorted.sort((a, b) => {
        const scoreA = calculateRelevanceScore(a)
        const scoreB = calculateRelevanceScore(b)
        return scoreB - scoreA
      })
  }
}

/**
 * Calcula score de relevancia (0-100)
 */
function calculateRelevanceScore(business: Business): number {
  const ratingScore = (business.rating / 5) * 40 // Max 40 puntos
  const reviewScore = Math.min((business.reviews / 1000) * 30, 30) // Max 30 puntos
  const distanceScore = Math.max(30 - (business.distance / 100), 0) // Max 30 puntos (más cerca = más puntos)
  const verifiedBonus = business.isVerified ? 10 : 0
  const offerBonus = business.hasOffer ? 5 : 0

  return ratingScore + reviewScore + distanceScore + verifiedBonus + offerBonus
}

/**
 * Filtra y ordena negocios
 */
export function filterAndSortBusinesses(
  businesses: Business[],
  filters: FilterState,
  userLocation?: [number, number]
): Business[] {
  const filtered = filterBusinesses(businesses, filters)
  const sorted = sortBusinesses(filtered, filters.sortBy, userLocation)
  return sorted
}

/**
 * Calcula distancia entre dos coordenadas (Haversine)
 */
export function calculateDistance(
  coords1: [number, number],
  coords2: [number, number]
): number {
  const [lat1, lon1] = coords1
  const [lat2, lon2] = coords2

  const R = 6371e3 // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Retorna distancia en metros
}

/**
 * Formatea distancia para mostrar
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

/**
 * Formatea rango de precio
 */
export function formatPriceRange(priceLevel: number): string {
  return '$'.repeat(Math.max(1, Math.min(4, priceLevel)))
}

/**
 * Obtiene conteo de resultados por filtro
 */
export function getFilterCount(
  businesses: Business[],
  filterType: 'experience' | 'attribute',
  filterId: string
): number {
  return businesses.filter((b) => {
    if (filterType === 'experience') {
      return b.experienceTags.includes(filterId)
    }
    // attribute
    switch (filterId) {
      case 'accessible':
        return b.isAccessible
      case 'top-rated':
        return b.rating >= 4.0
      case 'open-now':
        return b.isOpen
      case 'offers':
        return b.hasOffer
      case 'quick':
        return b.distance <= 1800
      case 'verified':
        return b.isVerified
      default:
        return b.attributes.includes(filterId)
    }
  }).length
}
