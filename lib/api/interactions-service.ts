/**
 * Interactions Service
 * Handles user interactions: favorites, reviews, visits
 */

import { env } from '../env'

const API_URL = env.apiEndpoint

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('ruta_local_access_token') || sessionStorage.getItem('ruta_local_access_token')
    : null

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

// ==================== FAVORITES ====================

export async function addFavorite(businessId: string) {
  const response = await fetch(`${API_URL}/businesses/${businessId}/favorite/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  return response.json()
}

export async function removeFavorite(businessId: string) {
  const response = await fetch(`${API_URL}/businesses/${businessId}/unfavorite/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  return response.json()
}

// ==================== REVIEWS ====================

export interface Review {
  id: string
  user: { id: string; name: string; avatar?: string }
  rating: number
  title?: string
  content: string
  created_at: string
  helpful_count: number
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
  }
}

export interface CreateReviewData {
  rating: number
  title?: string
  comment: string  // Backend uses 'comment' not 'content'
}

/**
 * Get reviews for a business (PUBLIC - no auth required)
 */
export async function getBusinessReviews(businessId: string, page: number = 1): Promise<ReviewsResponse> {
  try {
    // NO auth headers for public GET
    const response = await fetch(
      `${API_URL}/reviews/businesses/${businessId}/reviews/?page=${page}`,
      { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    if (!response.ok) {
      return {
        success: false,
        data: { results: [], stats: { average_rating: 0, total_reviews: 0, rating_distribution: {} } }
      }
    }

    return await response.json()
  } catch {
    return {
      success: false,
      data: { results: [], stats: { average_rating: 0, total_reviews: 0, rating_distribution: {} } }
    }
  }
}

/**
 * Create a new review (requires auth)
 */
export async function createReview(businessId: string, reviewData: CreateReviewData) {
  const response = await fetch(`${API_URL}/reviews/businesses/${businessId}/reviews/create/`, {
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
export async function markReviewHelpful(reviewId: string) {
  const response = await fetch(`${API_URL}/reviews/reviews/${reviewId}/helpful/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  return response.json()
}

// ==================== VISITS (not views) ====================

/**
 * Track a business visit
 * Backend endpoint is /visit/ not /view/
 */
export async function trackBusinessView(businessId: string): Promise<void> {
  try {
    await fetch(`${API_URL}/businesses/${businessId}/visit/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
  } catch {
    // Silent fail - visit tracking is not critical
  }
}

// ==================== DISTANCE ====================

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)}m` : `${(meters / 1000).toFixed(1)}km`
}
