'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { MapSearchBar, type SearchFilters } from '@/components/map/map-search-bar'
import { BusinessCarousel } from '@/components/map/business-carousel'
import { useMapBusinesses } from '@/hooks/use-map-businesses'
import { BottomNav } from '@/components/bottom-nav'
import type { MapBusiness } from '@/lib/mapbox-data'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

  // Fetch businesses from API instead of static data
  const { businesses: apiBusinesses, loading, error, refetch } = useMapBusinesses()

  // Filter businesses based on search criteria
  const filteredBusinesses = useMemo(() => {
    let result = apiBusinesses

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
      result = result.filter((b) => b.distance <= maxDistance)
    }

    // Filter by price range
    if (filters.priceRange.length > 0) {
      const priceValues = filters.priceRange.map(p => p.length)
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
  }, [apiBusinesses, filters])

  const handleBusinessSelect = (business: MapBusiness) => {
    setSelectedBusinessId(business.id)
  }

  // Loading state
  if (loading && apiBusinesses.length === 0) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Cargando mapa...
          </h3>
          <p className="text-gray-600">
            Obteniendo negocios de la API
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && apiBusinesses.length === 0) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar negocios
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message}
          </p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    )
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
      
      {/* Debug info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-20 left-4 bg-black/70 text-white text-xs p-2 rounded z-50">
          Total: {apiBusinesses.length} | Filtrados: {filteredBusinesses.length}
        </div>
      )}
    </div>
  )
}
