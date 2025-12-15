"use client"

import { useState, useMemo } from 'react'
import { useFilters } from '@/contexts/filter-context'
import { useAllBusinesses } from '@/hooks/use-businesses'
import { filterAndSortBusinesses } from '@/lib/filters/filter-utils'
import { NegocioCard } from './negocio-card'
import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'

export function BusinessFeed() {
  const { filters } = useFilters()
  const [visibleCount, setVisibleCount] = useState(9)

  // Obtener negocios de la API real
  const { businesses: apiBusinesses, loading, error, refetch } = useAllBusinesses()

  // Filtrar y ordenar negocios
  const filteredBusinesses = useMemo(() => {
    if (apiBusinesses.length === 0) {
      return []
    }
    return filterAndSortBusinesses(apiBusinesses, filters)
  }, [apiBusinesses, filters])

  const visibleBusinesses = filteredBusinesses.slice(0, visibleCount)
  const hasMore = visibleCount < filteredBusinesses.length

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 9, filteredBusinesses.length))
  }

  // Estado de carga
  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cargando negocios...
            </h3>
            <p className="text-gray-600">
              Obteniendo los mejores locales de RutaLocal
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Estado de error
  if (error) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error al cargar negocios
            </h3>
            <p className="text-gray-600 max-w-md mb-6">
              No se pudieron cargar los negocios. Por favor, intenta nuevamente.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Destacados en RutaLocal
              </h2>
            </div>
            <p className="text-gray-600">
              {filteredBusinesses.length} resultado
              {filteredBusinesses.length !== 1 ? 's' : ''} encontrado
              {filteredBusinesses.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Grid de Negocios */}
        {filteredBusinesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600 max-w-md">
              Intenta ajustar tus filtros o buscar algo diferente
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleBusinesses.map((business) => (
                <NegocioCard
                  key={business.id}
                  id={business.id}
                  name={business.name}
                  category={business.subcategory.toUpperCase() as any}
                  rating={business.rating}
                  reviews={business.reviews}
                  distance={`${business.distance >= 1000 ? `${(business.distance / 1000).toFixed(1)}km` : `${business.distance}m`} de ti`}
                  description={business.description}
                  priceRange={business.priceRange}
                  isOpen={business.isOpen}
                  image={business.image}
                  hasOffer={business.hasOffer}
                  isVerified={business.isVerified}
                />
              ))}
            </div>

            {/* Botón Cargar Más */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-white border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                >
                  Cargar más resultados
                  <span className="ml-2 text-sm text-gray-500">
                    ({filteredBusinesses.length - visibleCount} restantes)
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
