"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { addFavorite, removeFavorite } from '@/lib/api/interactions-service'

const FAVORITES_KEY = 'rutago_favorites'

/**
 * useFavorites Hook - Fixed version
 * Uses localStorage as primary storage, syncs to backend on toggle
 */
export function useFavorites() {
  const { isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const initializedRef = useRef(false)

  // Load favorites from localStorage only (avoid 404 on non-existent endpoint)
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setFavorites(new Set(parsed))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage when favorites change
  useEffect(() => {
    if (isLoaded && favorites.size >= 0) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)))
    }
  }, [favorites, isLoaded])

  const toggleFavorite = useCallback(async (businessId: string) => {
    const wasFavorite = favorites.has(businessId)
    
    // Update local state
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(businessId)) {
        newFavorites.delete(businessId)
      } else {
        newFavorites.add(businessId)
      }
      return newFavorites
    })

    // Sync with backend if authenticated (fire and forget)
    if (isAuthenticated) {
      setSyncing(true)
      try {
        if (wasFavorite) {
          await removeFavorite(businessId)
        } else {
          await addFavorite(businessId)
        }
      } catch (error) {
        // Don't revert - localStorage is source of truth
        console.warn('Backend sync failed:', error)
      } finally {
        setSyncing(false)
      }
    }
  }, [favorites, isAuthenticated])

  const isFavorite = useCallback((businessId: string) => favorites.has(businessId), [favorites])

  return {
    favorites: Array.from(favorites),
    isFavorite,
    toggleFavorite,
    favoritesCount: favorites.size,
    syncing,
    isLoaded,
  }
}
