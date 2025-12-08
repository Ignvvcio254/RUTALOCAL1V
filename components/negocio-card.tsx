"use client"

import { Heart, MapPin, Star, Plus, Map, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface NegocioCardProps {
  id: string
  name: string
  category: "CAFÉ" | "ARTE" | "TOUR" | "LIBRERÍA" | "HOSTAL" | "RESTAURANTE" | "BAR" | "GALERÍA" | "PANADERÍA" | "MERCADO" | "HOTEL BOUTIQUE" | "HOSPEDAJE" | "TURISMO" | string
  rating: number
  reviews: number
  distance: string
  description: string
  priceRange: number
  isOpen: boolean
  image: string
  hasOffer?: boolean
  isVerified?: boolean
  onClick?: () => void
}

const categoryColors: Record<string, { badge: string; bg: string }> = {
  CAFÉ: { badge: "bg-orange-500", bg: "/cozy-coffee-shop.png" },
  ARTE: { badge: "bg-purple-500", bg: "/art-studio-workshop.jpg" },
  TOUR: { badge: "bg-blue-500", bg: "/guided-city-tour.jpg" },
  LIBRERÍA: { badge: "bg-indigo-500", bg: "/placeholder.svg" },
  HOSTAL: { badge: "bg-emerald-500", bg: "/placeholder.svg" },
  RESTAURANTE: { badge: "bg-red-500", bg: "/placeholder.svg" },
  BAR: { badge: "bg-amber-600", bg: "/placeholder.svg" },
  GALERÍA: { badge: "bg-pink-500", bg: "/placeholder.svg" },
  PANADERÍA: { badge: "bg-yellow-600", bg: "/placeholder.svg" },
  MERCADO: { badge: "bg-green-600", bg: "/placeholder.svg" },
}

export function NegocioCard({
  id,
  name,
  category,
  rating,
  reviews,
  distance,
  description,
  priceRange,
  isOpen,
  image,
  hasOffer,
  isVerified,
  onClick,
}: NegocioCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddedToRoute, setIsAddedToRoute] = useState(false)
  const { toast } = useToast()
  const colors = categoryColors[category] || { badge: "bg-gray-500", bg: "/placeholder.svg" }

  const handleAddToRoute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAddedToRoute(true)
    toast({
      title: "Agregado a tu ruta",
      description: `${name} ha sido agregado a tu ruta.`,
    })
    // TODO: Implementar lógica real de agregar a ruta
  }

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Redirigir al mapa con este negocio centrado
    window.location.href = `/map-interactive?business=${id}`
  }

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:translate-y-[-4px] border border-gray-100"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-200">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay con botones de acción (visible en hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <button
              onClick={handleAddToRoute}
              disabled={isAddedToRoute}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isAddedToRoute
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              {isAddedToRoute ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>En Ruta</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Agregar</span>
                </>
              )}
            </button>
            <button
              onClick={handleViewOnMap}
              className="px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all"
              title="Ver en mapa"
            >
              <Map className="w-4 h-4 text-gray-900" />
            </button>
          </div>
        </div>

        {/* Category Badge */}
        <div className={`absolute top-3 left-3 ${colors.badge} rounded-lg px-2.5 py-1 text-xs font-semibold text-white shadow-md`}>
          {category}
        </div>

        {/* Badges superiores derecha */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Heart Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsFavorited(!isFavorited)
            }}
            className="rounded-full bg-white/95 backdrop-blur-sm p-2 transition-all hover:bg-white shadow-md"
          >
            <Heart
              size={16}
              className={`transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>

          {/* Verificado Badge */}
          {isVerified && (
            <div className="rounded-full bg-blue-500 p-1.5 shadow-md" title="Verificado">
              <CheckCircle2 size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* Oferta Badge */}
        {hasOffer && (
          <div className="absolute bottom-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
            🎁 Oferta
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{name}</h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-600">({reviews} reseñas)</span>
        </div>

        {/* Distance */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={14} />
          <span>{distance}</span>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-gray-600">{description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-gray-700">{"💰".repeat(priceRange)}</span>
          {isOpen && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
              Abierto ahora
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
