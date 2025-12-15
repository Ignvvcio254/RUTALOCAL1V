/**
 * Category Mapper
 * Maps backend category slugs to frontend main categories
 * 
 * @author Senior Engineer
 * @pattern Strategy Pattern + Factory Pattern
 */

import type { MainCategoryId } from './filter-config'

/**
 * Mapping configuration from backend slugs to frontend categories
 * Following Open/Closed Principle - easy to extend without modifying core logic
 */
const CATEGORY_MAPPING: Record<string, MainCategoryId> = {
  // Hospedaje
  'hotel': 'hospedaje',
  'hostal': 'hospedaje',
  'hotel-boutique': 'hospedaje',
  'cabana': 'hospedaje',
  'apart-hotel': 'hospedaje',
  'lodge': 'hospedaje',
  
  // Gastronomía
  'cafe': 'gastronomia',
  'restaurante': 'gastronomia',
  'bar': 'gastronomia',
  'bar-pub': 'gastronomia',
  'pub': 'gastronomia',
  'panaderia': 'gastronomia',
  'pasteleria': 'gastronomia',
  'comida-rapida': 'gastronomia',
  'food-truck': 'gastronomia',
  
  // Turismo
  'galeria': 'turismo',
  'museo': 'turismo',
  'tour': 'turismo',
  'mirador': 'turismo',
  'parque': 'turismo',
  'libreria': 'turismo', // Considered cultural tourism
  'centro-cultural': 'turismo',
  'teatro': 'turismo',
  'cine': 'turismo',
}

/**
 * Maps a backend category slug to a frontend MainCategoryId
 * 
 * @param slug - Backend category slug
 * @returns MainCategoryId - Frontend main category
 * 
 * @example
 * mapCategorySlugToMain('cafe') // 'gastronomia'
 * mapCategorySlugToMain('hotel') // 'hospedaje'
 */
export function mapCategorySlugToMain(slug: string | undefined | null): MainCategoryId {
  if (!slug) return 'all'
  
  const normalized = slug.toLowerCase().trim()
  return CATEGORY_MAPPING[normalized] || 'all'
}

/**
 * Type guard to check if a value is a valid MainCategoryId
 */
export function isMainCategoryId(value: any): value is MainCategoryId {
  return ['all', 'hospedaje', 'gastronomia', 'turismo'].includes(value)
}

/**
 * Gets all backend slugs that belong to a main category
 * Useful for reverse lookup
 */
export function getSlugsForMainCategory(mainCategory: MainCategoryId): string[] {
  if (mainCategory === 'all') {
    return Object.keys(CATEGORY_MAPPING)
  }
  
  return Object.entries(CATEGORY_MAPPING)
    .filter(([_, category]) => category === mainCategory)
    .map(([slug]) => slug)
}

/**
 * Validates and normalizes a category slug
 */
export function normalizeCategorySlug(slug: string): string {
  return slug.toLowerCase().trim().replace(/\s+/g, '-')
}

// Export for testing
export { CATEGORY_MAPPING }
