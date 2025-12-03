"use client"

import { X, Clock, MapPin, Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_BUSINESSES } from "@/lib/mock-data"

interface BusinessInfoPopupProps {
  businessId: string
  onClose: () => void
}

export function BusinessInfoPopup({ businessId, onClose }: BusinessInfoPopupProps) {
  const business = MOCK_BUSINESSES.find((b) => b.id === businessId)

  if (!business) return null

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      café: "bg-orange-100 text-orange-700",
      arte: "bg-purple-100 text-purple-700",
      tour: "bg-blue-100 text-blue-700",
      hostal: "bg-green-100 text-green-700",
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  return (
    <Card className="absolute bottom-6 left-6 right-6 max-w-sm bg-white shadow-xl z-50">
      <div className="relative">
        <img
          src={business.image || "/placeholder.svg"}
          alt={business.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg">{business.name}</h3>
            <Badge className={getCategoryColor(business.category)}>{business.category.toUpperCase()}</Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(business.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm font-medium">{business.rating.toFixed(1)}</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{business.distance}km de distancia</span>
          </div>
          <div className={`flex items-center gap-2 font-medium ${business.isOpen ? "text-green-600" : "text-red-600"}`}>
            <Clock className="w-4 h-4" />
            <span>{business.isOpen ? `Abierto • Cierra a las ${business.closesAt}` : "Cerrado"}</span>
          </div>
          {business.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{business.phone}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">Ver detalles</Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Agregar a ruta
          </Button>
        </div>
      </div>
    </Card>
  )
}
