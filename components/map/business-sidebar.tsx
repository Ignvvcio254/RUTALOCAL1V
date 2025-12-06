'use client'

import { Star, MapPin, Clock, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { type MapBusiness } from '@/lib/mapbox-data'

interface BusinessSidebarProps {
  businesses: MapBusiness[]
  selectedBusinessId?: string
  onBusinessSelect: (business: MapBusiness) => void
}

export function BusinessSidebar({
  businesses,
  selectedBusinessId,
  onBusinessSelect,
}: BusinessSidebarProps) {
  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{businesses.length}</span> lugares encontrados
          </p>
          <select className="text-sm bg-transparent border-0 text-gray-600 font-medium cursor-pointer focus:ring-0">
            <option>Más cercanos</option>
            <option>Mejor valorados</option>
            <option>Populares</option>
          </select>
        </div>
      </div>

      {/* Business list */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {businesses.map((business) => (
            <div
              key={business.id}
              onClick={() => onBusinessSelect(business)}
              className={cn(
                "flex gap-3 p-3 cursor-pointer transition-all",
                selectedBusinessId === business.id
                  ? "bg-indigo-50 border-l-4 border-indigo-500"
                  : "hover:bg-gray-50"
              )}
            >
              {/* Image */}
              <div className="relative flex-shrink-0">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                {business.verified && (
                  <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[9px] px-1 py-0">
                    ✓
                  </Badge>
                )}
                <button
                  className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    // TODO: Add to favorites
                  }}
                >
                  <Heart className="w-3 h-3 text-gray-600" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 truncate">
                  {business.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-2.5 w-2.5 ${
                          i < Math.floor(business.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">{business.rating}</span>
                  <span className="text-xs text-gray-400">({business.reviewCount})</span>
                </div>

                {/* Category & Price */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <span>{business.category}</span>
                  <span>•</span>
                  <span>{'$'.repeat(business.priceRange)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-2.5 w-2.5" />
                    {business.distance}km
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-2.5 w-2.5 text-gray-400" />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      business.isOpen ? "text-green-600" : "text-red-500"
                    )}
                  >
                    {business.isOpen
                      ? `Abierto • Cierra ${business.openHours.close}`
                      : "Cerrado"}
                  </span>
                </div>

                {/* Features */}
                {business.features.length > 0 && (
                  <div className="flex gap-1 mt-1.5 overflow-hidden">
                    {business.features.slice(0, 2).map((feature) => (
                      <span
                        key={feature}
                        className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
