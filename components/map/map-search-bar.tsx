'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MAP_CATEGORIES } from '@/lib/mapbox-data'

export interface SearchFilters {
  query: string
  categories: string[]
  rating: number
  distance: string
  priceRange: string[]
  openNow: boolean
  features: string[]
}

interface MapSearchBarProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

const FEATURES = ['WiFi', 'Terraza', 'Pet-friendly', 'Estacionamiento', 'Accesible']
const DISTANCES = ['500m', '1km', '2km', '5km', 'Todos']
const PRICE_RANGES = ['$', '$$', '$$$']
const RATINGS = [
  { label: 'Todos', value: 0 },
  { label: '3+ estrellas', value: 3 },
  { label: '4+ estrellas', value: 4 },
  { label: '4.5+ estrellas', value: 4.5 },
]

export function MapSearchBar({ filters, onFiltersChange }: MapSearchBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    updateFilters({ categories: newCategories })
  }

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature]
    updateFilters({ features: newFeatures })
  }

  const togglePriceRange = (price: string) => {
    const newPrices = filters.priceRange.includes(price)
      ? filters.priceRange.filter(p => p !== price)
      : [...filters.priceRange, price]
    updateFilters({ priceRange: newPrices })
  }

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      categories: [],
      rating: 0,
      distance: 'Todos',
      priceRange: [],
      openNow: false,
      features: [],
    })
  }

  const activeFiltersCount = [
    ...filters.categories,
    ...filters.features,
    ...filters.priceRange,
    filters.rating > 0 ? 1 : 0,
    filters.distance !== 'Todos' ? 1 : 0,
    filters.openNow ? 1 : 0,
  ].filter(Boolean).length

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-20">
      <div className="bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center gap-2 px-4 py-2.5 border border-gray-100">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar negocios locales..."
          value={filters.query}
          onChange={(e) => updateFilters({ query: e.target.value })}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm bg-transparent"
        />

        {filters.query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateFilters({ query: '' })}
            className="rounded-full h-7 w-7"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="rounded-full gap-2 relative h-8 px-3 hover:bg-gray-100">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="text-sm">Filtros</span>
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center bg-indigo-500 text-[10px]">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros de Búsqueda</SheetTitle>
              <SheetDescription>
                Refina tu búsqueda de negocios locales
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(MAP_CATEGORIES).map(([category, data]) => (
                    <Badge
                      key={category}
                      variant={filters.categories.includes(category) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/90"
                      onClick={() => toggleCategory(category)}
                    >
                      <span className="mr-1">{data.icon}</span>
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-semibold mb-3">Calificación</h3>
                <RadioGroup
                  value={filters.rating.toString()}
                  onValueChange={(value) => updateFilters({ rating: parseFloat(value) })}
                >
                  {RATINGS.map((rating) => (
                    <div key={rating.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={rating.value.toString()} id={`rating-${rating.value}`} />
                      <Label htmlFor={`rating-${rating.value}`}>{rating.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Distance */}
              <div>
                <h3 className="font-semibold mb-3">Distancia</h3>
                <RadioGroup
                  value={filters.distance}
                  onValueChange={(value) => updateFilters({ distance: value })}
                >
                  {DISTANCES.map((distance) => (
                    <div key={distance} className="flex items-center space-x-2">
                      <RadioGroupItem value={distance} id={`distance-${distance}`} />
                      <Label htmlFor={`distance-${distance}`}>{distance}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Rango de Precio</h3>
                <div className="flex gap-2">
                  {PRICE_RANGES.map((price) => (
                    <Badge
                      key={price}
                      variant={filters.priceRange.includes(price) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/90"
                      onClick={() => togglePriceRange(price)}
                    >
                      {price}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-3">Características</h3>
                <div className="space-y-2">
                  {FEATURES.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature}`}
                        checked={filters.features.includes(feature)}
                        onCheckedChange={() => toggleFeature(feature)}
                      />
                      <Label htmlFor={`feature-${feature}`}>{feature}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open Now */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="open-now"
                  checked={filters.openNow}
                  onCheckedChange={(checked) => updateFilters({ openNow: checked as boolean })}
                />
                <Label htmlFor="open-now" className="font-semibold">Abierto ahora</Label>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Limpiar todos los filtros
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
