/**
 * MapBusiness Adapter
 * 
 * Transforms API business data to the format expected by MapboxMap component.
 * Implements Adapter Pattern for clean data transformation.
 * 
 * @author Senior Engineer
 * @pattern Adapter Pattern
 * @principle Single Responsibility - Only transforms data
 */

import type { PublicBusiness } from '@/lib/api/business-service'
import type { MapBusiness } from '@/lib/mapbox-data'

/**
 * Category configuration for map markers
 * Maps category slugs to visual properties
 */
const MAP_CATEGORY_CONFIG: Record<string, { color: string; icon: string }> = {
  // Gastronomía
  'cafe': { color: '#92400E', icon: '☕' },
  'restaurante': { color: '#F97316', icon: '🍽️' },
  'bar': { color: '#DC2626', icon: '🍺' },
  'bar-pub': { color: '#DC2626', icon: '🍺' },
  'panaderia': { color: '#FCD34D', icon: '🥖' },
  
  // Hospedaje
  'hotel': { color: '#10B981', icon: '🏨' },
  'hostal': { color: '#84CC16', icon: '🛏️' },
  'hotel-boutique': { color: '#10B981', icon: '✨' },
  'cabana': { color: '#84CC16', icon: '🏕️' },
  
  // Turismo
  'galeria': { color: '#EC4899', icon: '🖼️' },
  'libreria': { color: '#3B82F6', icon: '📚' },
  'museo': { color: '#A855F7', icon: '🏛️' },
  'tour': { color: '#6366F1', icon: '🎒' },
  
  // Default
  'default': { color: '#6B7280', icon: '📍' },
}

/**
 * Gets category visual config for map markers
 */
export function getCategoryConfig(slug: string | undefined): { color: string; icon: string } {
  if (!slug) return MAP_CATEGORY_CONFIG['default']
  const normalized = slug.toLowerCase().trim()
  return MAP_CATEGORY_CONFIG[normalized] || MAP_CATEGORY_CONFIG['default']
}

/**
 * Transforms a PublicBusiness (from API) to MapBusiness (for Mapbox)
 * 
 * @param business - Business data from backend API
 * @returns MapBusiness - Formatted for map display
 */
export function transformToMapBusiness(business: PublicBusiness): MapBusiness {
  const distance = business.distance || 0
  
  return {
    id: business.id,
    name: business.name,
    category: business.category?.name || 'General',
    rating: typeof business.rating === 'string' 
      ? parseFloat(business.rating) 
      : (business.rating || 0),
    distance: distance < 1 ? distance : Math.round(distance * 10) / 10,
    image: business.cover_image || '/placeholder.svg',
    isOpen: business.is_open !== false,
    closesAt: '22:00',
    phone: business.phone || '',
    lat: business.location?.lat || 0,
    lng: business.location?.lng || 0,
    priceRange: business.price_range || 2,
    verified: business.verified || false,
    features: business.features || [],
    openHours: {
      open: '09:00',
      close: '22:00',
    },
    address: business.address || 'Santiago, Chile',
    reviewCount: business.review_count || 0,
  }
}

/**
 * Transforms multiple businesses from API format to Map format
 */
export function transformToMapBusinesses(businesses: PublicBusiness[]): MapBusiness[] {
  return businesses
    .filter(b => b.location?.lat && b.location?.lng)
    .map(transformToMapBusiness)
}

/**
 * Validates if a business has valid map coordinates
 */
export function hasValidCoordinates(business: PublicBusiness): boolean {
  return Boolean(
    business.location?.lat &&
    business.location?.lng &&
    business.location.lat !== 0 &&
    business.location.lng !== 0
  )
}

/**
 * Extended MAP_CATEGORIES for compatibility
 */
export const MAP_CATEGORIES_EXTENDED = {
  'Restaurante': { color: '#F97316', icon: '🍽️', verified: '#FFD700' },
  'Café': { color: '#92400E', icon: '☕', verified: '#FFD700' },
  'Bar': { color: '#DC2626', icon: '🍺', verified: '#FFD700' },
  'Bar/Pub': { color: '#DC2626', icon: '🍺', verified: '#FFD700' },
  'Panadería': { color: '#FCD34D', icon: '🥖', verified: '#FFD700' },
  'Librería': { color: '#3B82F6', icon: '📚', verified: '#FFD700' },
  'Galería': { color: '#EC4899', icon: '🖼️', verified: '#FFD700' },
  'Hotel': { color: '#10B981', icon: '🏨', verified: '#FFD700' },
  'Hostal': { color: '#84CC16', icon: '🛏️', verified: '#FFD700' },
  'Tour': { color: '#6366F1', icon: '🎒', verified: '#FFD700' },
  'Mercado': { color: '#84CC16', icon: '🛒', verified: '#FFD700' },
  'Tienda': { color: '#06B6D4', icon: '🏪', verified: '#FFD700' },
  'General': { color: '#6B7280', icon: '📍', verified: '#FFD700' },
} as const
