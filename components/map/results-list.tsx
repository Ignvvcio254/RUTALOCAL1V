"use client"

import { MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Business {
  id: string
  name: string
  category: string
  rating: number
  distance: number
  image: string
  isOpen: boolean
  closesAt: string
}

interface ResultsListProps {
  results: Business[]
  selectedBusiness: string | null
  onSelectBusiness: (id: string | null) => void
}

export function ResultsList({ results, selectedBusiness, onSelectBusiness }: ResultsListProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      café: "bg-orange-100 text-orange-700",
      arte: "bg-purple-100 text-purple-700",
      tour: "bg-blue-100 text-blue-700",
      hostal: "bg-green-100 text-green-700",
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      café: "☕",
      arte: "🎨",
      tour: "🗺️",
      hostal: "🏠",
    }
    return icons[category] || "📍"
  }

  return (
    <div className="space-y-3 pr-4">
      {results.map((business) => (
        <div
          key={business.id}
          onClick={() => onSelectBusiness(business.id)}
          className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
            selectedBusiness === business.id
              ? "bg-indigo-50 border-indigo-300 shadow-md"
              : "bg-background border-border hover:bg-muted"
          }`}
        >
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <img
              src={business.image || "/placeholder.svg"}
              alt={business.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-sm truncate">{business.name}</h3>
                <Badge className={`text-xs mt-1 ${getCategoryColor(business.category)}`}>
                  {getCategoryIcon(business.category)} {business.category.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(business.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span>{business.rating.toFixed(1)}</span>
              <span className="mx-1">•</span>
              <MapPin className="w-3 h-3" />
              <span>{business.distance}km</span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs font-medium ${business.isOpen ? "text-green-600" : "text-red-600"}`}>
                {business.isOpen ? `Abierto • Cierra a las ${business.closesAt}` : "Cerrado"}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectBusiness(business.id)
                }}
              >
                Ver
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
