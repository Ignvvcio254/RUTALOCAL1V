"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { MainCategoryId } from '@/lib/filters/filter-config'

/**
 * Filter Context
 * Maneja el estado global de filtros para la página de inicio
 */

// Estado de filtros
export interface FilterState {
  mainCategory: MainCategoryId
  experiences: string[]
  attributes: string[]
  searchQuery: string
  location: string
  priceRange: [number, number]
  sortBy: 'relevance' | 'distance' | 'rating' | 'price'
}

// Tipo del contexto
interface FilterContextType {
  filters: FilterState
  setMainCategory: (category: MainCategoryId) => void
  toggleExperience: (id: string) => void
  toggleAttribute: (id: string) => void
  setSearchQuery: (query: string) => void
  setLocation: (location: string) => void
  setPriceRange: (range: [number, number]) => void
  setSortBy: (sortBy: FilterState['sortBy']) => void
  resetFilters: () => void
  hasActiveFilters: boolean
}

// Estado inicial
const initialState: FilterState = {
  mainCategory: 'all',
  experiences: [],
  attributes: [],
  searchQuery: '',
  location: '',
  priceRange: [0, 100000],
  sortBy: 'relevance',
}

// Crear contexto
const FilterContext = createContext<FilterContextType | undefined>(undefined)

// Provider Props
interface FilterProviderProps {
  children: ReactNode
}

// Provider Component
export function FilterProvider({ children }: FilterProviderProps) {
  const [filters, setFilters] = useState<FilterState>(initialState)

  // Cambiar categoría principal (resetea experiences)
  const setMainCategory = useCallback((category: MainCategoryId) => {
    setFilters((prev) => ({
      ...prev,
      mainCategory: category,
      experiences: [], // Reset experiences al cambiar categoría
    }))
  }, [])

  // Toggle filtro de experiencia
  const toggleExperience = useCallback((id: string) => {
    setFilters((prev) => ({
      ...prev,
      experiences: prev.experiences.includes(id)
        ? prev.experiences.filter((exp) => exp !== id)
        : [...prev.experiences, id],
    }))
  }, [])

  // Toggle filtro de atributo
  const toggleAttribute = useCallback((id: string) => {
    setFilters((prev) => ({
      ...prev,
      attributes: prev.attributes.includes(id)
        ? prev.attributes.filter((attr) => attr !== id)
        : [...prev.attributes, id],
    }))
  }, [])

  // Establecer query de búsqueda
  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }))
  }, [])

  // Establecer ubicación
  const setLocation = useCallback((location: string) => {
    setFilters((prev) => ({ ...prev, location }))
  }, [])

  // Establecer rango de precios
  const setPriceRange = useCallback((range: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: range }))
  }, [])

  // Establecer orden
  const setSortBy = useCallback((sortBy: FilterState['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }, [])

  // Resetear todos los filtros
  const resetFilters = useCallback(() => {
    setFilters(initialState)
  }, [])

  // Verificar si hay filtros activos
  const hasActiveFilters =
    filters.mainCategory !== 'all' ||
    filters.experiences.length > 0 ||
    filters.attributes.length > 0 ||
    filters.searchQuery !== '' ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 100000

  const value: FilterContextType = {
    filters,
    setMainCategory,
    toggleExperience,
    toggleAttribute,
    setSearchQuery,
    setLocation,
    setPriceRange,
    setSortBy,
    resetFilters,
    hasActiveFilters,
  }

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

// Hook para usar el contexto
export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider')
  }
  return context
}
