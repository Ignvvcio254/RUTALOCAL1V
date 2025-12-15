"use client"

import { useState, useEffect } from "react"
import { Search, X, TrendingUp, Clock, MapPin, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useBusinessSearch } from "@/hooks/use-businesses"
import { NegocioCard } from "./negocio-card"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Obtener resultados de búsqueda desde la API real con debouncing
  const { businesses: searchResults, loading: searchLoading } = useBusinessSearch(searchQuery, 300)

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Guardar búsqueda reciente
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recent-searches', JSON.stringify(updated))
  }

  const trendingSearches = [
    "Cafés con WiFi",
    "Tours guiados",
    "Gastronomía vegana",
    "Hospedaje económico",
    "Arte y cultura",
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    saveRecentSearch(query)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recent-searches')
  }

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 z-50 mx-auto max-w-2xl p-4 pt-20"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
              {/* Search Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        handleSearch(searchQuery)
                      }
                    }}
                    placeholder="Buscar negocios, categorías, lugares..."
                    className="flex-1 outline-none text-lg placeholder-gray-400"
                    autoFocus
                  />
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Search Content */}
              <div className="flex-1 overflow-y-auto">
                {!searchQuery.trim() ? (
                  <div className="p-6 space-y-6">
                    {/* Búsquedas Recientes */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <h3 className="font-semibold text-gray-900">Recientes</h3>
                          </div>
                          <button
                            onClick={clearRecentSearches}
                            className="text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            Borrar todo
                          </button>
                        </div>
                        <div className="space-y-2">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => setSearchQuery(search)}
                              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                            >
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{search}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Búsquedas Trending */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">Tendencias</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((trend, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchQuery(trend)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
                          >
                            {trend}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sugerencias por categoría */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">Explorar por categoría</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { emoji: '🏠', label: 'Hospedaje', query: 'hospedaje' },
                          { emoji: '🍽️', label: 'Gastronomía', query: 'gastronomía' },
                          { emoji: '🎒', label: 'Turismo', query: 'turismo' },
                          { emoji: '☕', label: 'Cafés', query: 'café' },
                        ].map((cat, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchQuery(cat.query)}
                            className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                          >
                            <span className="text-2xl">{cat.emoji}</span>
                            <span className="font-medium text-gray-700">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    {searchLoading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                        <p className="text-sm text-gray-600">Buscando negocios...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 mb-4">
                          {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{searchQuery}"
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                          {searchResults.map((business) => (
                            <div key={business.id} onClick={onClose}>
                              <NegocioCard
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
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No se encontraron resultados
                        </h3>
                        <p className="text-gray-600">
                          Intenta con otras palabras clave
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
