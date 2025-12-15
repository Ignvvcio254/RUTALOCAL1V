"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { addFavorite, removeFavorite, getUserFavorites } from '@/lib/api/interactions-service'

const FAVORITES_KEY = 'rutalocal_favorites'

/**
 * useFavorites Hook
 * 
 * Manages favorites with:
 * - LocalStorage for guests (offline support)
 * - Backend sync for authenticated users
 * 
 * @author Senior Engineer
 * @pattern Custom Hook + Hybrid Storage
 */
export function useFavorites() {
  const { user, isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (isAuthenticated && user) {
          // Authenticated: fetch from backend
          console.log('❤️ [useFavorites] Loading from backend...')
          const backendFavorites = await getUserFavorites()
          setFavorites(new Set(backendFavorites))
          console.log(`✅ [useFavorites] Loaded ${backendFavorites.length} favorites from backend`)
        } else {
          // Guest: load from localStorage
          const stored = localStorage.getItem(FAVORITES_KEY)
          if (stored) {
            const parsed = JSON.parse(stored)
            setFavorites(new Set(parsed))
            console.log(`✅ [useFavorites] Loaded ${parsed.length} favorites from localStorage`)
          }
        }
      } catch (error) {
        console.error('❌ [useFavorites] Error loading favorites:', error)
        // Fallback to localStorage
        const stored = localStorage.getItem(FAVORITES_KEY)
        if (stored) {
          setFavorites(new Set(JSON.parse(stored)))
        }
      } finally {
        setIsLoaded(true)
      }
    }

    loadFavorites()
  }, [isAuthenticated, user])

  // Save to localStorage as backup
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)))
    }
  }, [favorites, isLoaded])

  /**
   * Toggle favorite with backend sync
   */
  const toggleFavorite = useCallback(async (businessId: string) => {
    const wasFavorite = favorites.has(businessId)
    
    // Optimistic update
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(businessId)) {
        newFavorites.delete(businessId)
      } else {
        newFavorites.add(businessId)
      }
      return newFavorites
    })

    // Sync with backend if authenticated
    if (isAuthenticated) {
      setSyncing(true)
      try {
        if (wasFavorite) {
          await removeFavorite(businessId)
          console.log(`💔 [useFavorites] Removed from backend: ${businessId}`)
        } else {
          await addFavorite(businessId)
          console.log(`❤️ [useFavorites] Added to backend: ${businessId}`)
        }
      } catch (error) {
        console.error('❌ [useFavorites] Sync error:', error)
        // Revert optimistic update on error
        setFavorites((prev) => {
          const reverted = new Set(prev)
          if (wasFavorite) {
            reverted.add(businessId)
          } else {
            reverted.delete(businessId)
          }
          return reverted
        })
      } finally {
        setSyncing(false)
      }
    }
  }, [favorites, isAuthenticated])

  const isFavorite = useCallback((businessId: string) => favorites.has(businessId), [favorites])

  const addFavoriteLocal = useCallback((businessId: string) => {
    setFavorites((prev) => new Set(prev).add(businessId))
  }, [])

  const removeFavoriteLocal = useCallback((businessId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      newFavorites.delete(businessId)
      return newFavorites
    })
  }, [])

  const clearFavorites = useCallback(() => {
    setFavorites(new Set())
  }, [])

  return {
    favorites: Array.from(favorites),
    isFavorite,
    toggleFavorite,
    addFavorite: addFavoriteLocal,
    removeFavorite: removeFavoriteLocal,
    clearFavorites,
    favoritesCount: favorites.size,
    syncing,
    isLoaded,
  }
}
