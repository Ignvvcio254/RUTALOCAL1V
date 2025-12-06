'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Star, MapPin, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type MapBusiness } from '@/lib/mapbox-data'

interface BusinessCarouselProps {
  businesses: MapBusiness[]
  selectedBusinessId?: string
  onBusinessSelect: (business: MapBusiness) => void
}

export function BusinessCarousel({
  businesses,
  selectedBusinessId,
  onBusinessSelect,
}: BusinessCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (businesses.length === 0) {
    return null
  }

  return (
    <div className="md:hidden absolute bottom-2 left-0 right-0 z-10 px-2">
      <div className="relative bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-2">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-semibold text-xs text-gray-700">
            {businesses.length} {businesses.length === 1 ? 'lugar' : 'lugares'}
          </h3>
          <div className="flex gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('left')}
              className="h-6 w-6 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('right')}
              className="h-6 w-6 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {businesses.map((business) => (
            <div
              key={business.id}
              className={`flex-shrink-0 w-[180px] cursor-pointer transition-all ${
                selectedBusinessId === business.id
                  ? 'ring-2 ring-indigo-500 rounded-lg'
                  : ''
              }`}
              onClick={() => onBusinessSelect(business)}
            >
              <div className={`rounded-lg overflow-hidden ${selectedBusinessId === business.id ? 'bg-indigo-50' : 'bg-white'}`}>
                {/* Image */}
                <div className="relative w-full h-16 bg-gray-200">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                  {business.verified && (
                    <Badge className="absolute top-1 right-1 bg-yellow-500 text-white text-[8px] px-1 py-0">
                      ✓
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-2 space-y-0.5">
                  <h4 className="font-semibold text-xs line-clamp-1">{business.name}</h4>

                  {/* Rating & Price */}
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <div className="flex items-center gap-0.5">
                      <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-600">{business.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{'$'.repeat(business.priceRange)}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{business.distance}km</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-0.5 text-[10px]">
                    <Clock className="h-2 w-2" />
                    <span className={business.isOpen ? 'text-green-600' : 'text-red-500'}>
                      {business.isOpen ? 'Abierto' : 'Cerrado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
