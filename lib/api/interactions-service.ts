/**
 * Interactions Service
 * 
 * Handles user interactions with businesses:
 * - Favorites (synced with backend)
 * - Reviews (create, list)
 * - Views tracking
 * 
 * @author Senior Engineer
 * @pattern Service Pattern
 * @principle Single Responsibility
 */

import { env } from '../env'

const API_URL = env.apiEndpoint

/**
 * Gets auth headers with token
 */
function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('ruta_local_access_token') || sessionStorage.getItem('ruta_local_access_token')
    : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

// ==================== FAVORITES ====================

export interface FavoriteResponse {
  success: boolean
  message: string
  favorites_count?: number
}

/**
 * Add business to favorites (syncs with backend)
 */
export async function addFavorite(businessId: string): Promise<FavoriteResponse> {
  const response = await fetch(`${API_URL}/businesses/${businessId}/favorite/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Error al agregar a favoritos')
  }

  return data
}

/**
 * Remove business from favorites
 */
export async function removeFavorite(businessId: string): Promise<FavoriteResponse> {
  const response = await fetch(`${API_URL}/businesses/${businessId}/unfavorite/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Error al quitar de favoritos')
  }

  return data
}

/**
 * Get user's favorite businesses
 */
export async function getUserFavorites(): Promise<string[]> {
  const response = await fetch(`${API_URL}/users/me/favorites/`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    // Return empty array if not authenticated or error
    return []
  }

  const data = await response.json()
  return data.data?.map((fav: any) => fav.business_id) || []
}

// ==================== REVIEWS ====================

export interface Review {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  rating: number
  title?: string
  content: string
  created_at: string
  helpful_count: number
  photos?: string[]
}

export interface ReviewStats {
  average_rating: number
  total_reviews: number
  rating_distribution: Record<string, number>
}

export interface ReviewsResponse {
  success: boolean
  data: {
    results: Review[]
    stats: ReviewStats
    pagination?: {
      page: number
      per_page: number
      total: number
      pages: number
    }
  }
}

export interface CreateReviewData {
  rating: number
  title?: string
  content: string
  photos?: string[]
}

/**
 * Get reviews for a business
 */
export async function getBusinessReviews(
  businessId: string, 
  page: number = 1,
  rating?: number
): Promise<ReviewsResponse> {
  const params = new URLSearchParams({ page: String(page) })
  if (rating) params.append('rating', String(rating))

  const response = await fetch(
    `${API_URL}/reviews/business/${businessId}/?${params}`,
    { headers: getAuthHeaders() }
  )

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener reseñas')
  }

  return data
}

/**
 * Create a new review
 */
export async function createReview(
  businessId: string,
  reviewData: CreateReviewData
): Promise<{ success: boolean; data: Review; message: string }> {
  const response = await fetch(`${API_URL}/reviews/business/${businessId}/create/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reviewData),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || data.errors?.content?.[0] || 'Error al crear reseña')
  }

  return data
}

/**
 * Mark a review as helpful
 */
export async function markReviewHelpful(reviewId: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_URL}/reviews/${reviewId}/helpful/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })

  const data = await response.json()
  return data
}

// ==================== VIEWS TRACKING ====================

/**
 * Track a business view
 */
export async function trackBusinessView(businessId: string): Promise<void> {
  try {
    await fetch(`${API_URL}/businesses/${businessId}/view/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
  } catch (error) {
    // Silently fail - view tracking is not critical
    console.warn('Failed to track view:', error)
  }
}

// ==================== DISTANCE CALCULATION ====================

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}
