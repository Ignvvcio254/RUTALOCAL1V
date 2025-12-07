'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { MapSearchBar, type SearchFilters } from '@/components/map/map-search-bar'
import { BusinessCarousel } from '@/components/map/business-carousel'
import { MAP_BUSINESSES, type MapBusiness } from '@/lib/mapbox-data'
import { BottomNav } from '@/components/bottom-nav'

// Import Mapbox dynamically to avoid SSR issues
const MapboxMap = dynamic(
  () => import('@/components/map/mapbox-map').then(mod => mod.MapboxMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
)

export default function InteractiveMapPage() {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>()
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    rating: 0,
    distance: 'Todos',
    priceRange: [],
    openNow: false,
    features: [],
  })

  // Filter businesses based on search criteria
  const filteredBusinesses = useMemo(() => {
    let result = MAP_BUSINESSES

    // Filter by query
    if (filters.query) {
      const query = filters.query.toLowerCase()
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.category.toLowerCase().includes(query) ||
          b.address.toLowerCase().includes(query)
      )
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter((b) => filters.categories.includes(b.category))
    }

    // Filter by rating
    if (filters.rating > 0) {
      result = result.filter((b) => b.rating >= filters.rating)
    }

    // Filter by distance
    if (filters.distance !== 'Todos') {
      const maxDistance = parseFloat(filters.distance)
      result = result.filter((b) => {
        return b.distance <= maxDistance
      })
    }

    // Filter by price range ($ = 1, $$ = 2, $$$ = 3)
    if (filters.priceRange.length > 0) {
      const priceValues = filters.priceRange.map(p => p.length) // $ = 1, $$ = 2, $$$ = 3
      result = result.filter((b) => priceValues.includes(b.priceRange))
    }

    // Filter by open now
    if (filters.openNow) {
      result = result.filter((b) => b.isOpen)
    }

    // Filter by features
    if (filters.features.length > 0) {
      result = result.filter((b) =>
        filters.features.every((feature) => b.features.includes(feature))
      )
    }

    // Sort: verified first, then by rating
    return result.sort((a, b) => {
      if (a.verified && !b.verified) return -1
      if (!a.verified && b.verified) return 1
      return b.rating - a.rating
    })
  }, [filters])

  const handleBusinessSelect = (business: MapBusiness) => {
    setSelectedBusinessId(business.id)
  }

  return (
    <div className="relative w-full h-screen pb-20 lg:pb-0">
      {/* Search Bar */}
      <MapSearchBar filters={filters} onFiltersChange={setFilters} />

      {/* Map */}
      <MapboxMap
        selectedBusinessId={selectedBusinessId}
        onBusinessSelect={handleBusinessSelect}
        filteredBusinesses={filteredBusinesses}
      />

      {/* Results Carousel */}
      <BusinessCarousel
        businesses={filteredBusinesses}
        selectedBusinessId={selectedBusinessId}
        onBusinessSelect={handleBusinessSelect}
      />

      {/* Bottom Navigation (solo mobile) */}
      <BottomNav />
    </div>
  )
}
