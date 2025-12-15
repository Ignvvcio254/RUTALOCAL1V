"use client"

import { useState, useEffect } from 'react'

const FAVORITES_KEY = 'rutalocal_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
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

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)))
      } catch (error) {
        console.error('Error saving favorites:', error)
      }
    }
  }, [favorites, isLoaded])

  const toggleFavorite = (businessId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(businessId)) {
        newFavorites.delete(businessId)
      } else {
        newFavorites.add(businessId)
      }
      return newFavorites
    })
  }

  const isFavorite = (businessId: string) => favorites.has(businessId)

  const addFavorite = (businessId: string) => {
    setFavorites((prev) => new Set(prev).add(businessId))
  }

  const removeFavorite = (businessId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      newFavorites.delete(businessId)
      return newFavorites
    })
  }

  const clearFavorites = () => {
    setFavorites(new Set())
  }

  return {
    favorites: Array.from(favorites),
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    favoritesCount: favorites.size,
  }
}
