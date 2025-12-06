"use client"

import { Heart, MapPin, Star } from "lucide-react"
import { useState } from "react"

interface NegocioCardProps {
  id: string
  name: string
  category: "CAFÉ" | "ARTE" | "TOUR" | "LIBRERÍA" | "HOSTAL" | "RESTAURANTE" | "BAR" | "GALERÍA" | "PANADERÍA" | "MERCADO"
  rating: number
  reviews: number
  distance: string
  description: string
  priceRange: number
  isOpen: boolean
  image: string
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
  name,
  category,
  rating,
  reviews,
  distance,
  description,
  priceRange,
  isOpen,
  image,
}: NegocioCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const colors = categoryColors[category] || { badge: "bg-gray-500", bg: "/placeholder.svg" }

  return (
    <div className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-8px]">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-200">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Category Badge */}
        <div className={`absolute top-3 left-3 ${colors.badge} rounded-md px-2 py-1 text-xs font-semibold text-white`}>
          {category}
        </div>

        {/* Heart Icon */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsFavorited(!isFavorited)
          }}
          className="absolute top-3 right-3 rounded-full bg-white/90 p-2 transition-all hover:bg-white"
        >
          <Heart
            size={18}
            className={`transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </button>
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
