"use client"

import { useState, useEffect } from "react"
import { X, MapPin, Star, Phone, Clock, Share2, Heart, Navigation, DollarSign, Wifi, PawPrint, Utensils, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useFavorites } from "@/hooks/use-favorites"
import { useGeolocation } from "@/hooks/use-geolocation"
import { trackBusinessView } from "@/lib/api/interactions-service"
import { ReviewSection } from "@/components/reviews/review-section"
import dynamic from "next/dynamic"

// Import BusinessMap dynamically to avoid SSR issues with Mapbox
const BusinessMap = dynamic(
  () => import("@/components/business-map").then((mod) => mod.BusinessMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
)

export interface BusinessDetail {
  id: string
  name: string
  category: string
  rating: number
  reviews: number
  distance: string
  description: string
  priceRange: number
  isOpen: boolean
  image: string
  phone?: string
  address?: string
  openHours?: {
    open: string
    close: string
  }
  features?: string[]
  lat?: number
  lng?: number
  gallery?: string[]
  aboutText?: string
}

interface BusinessDetailModalProps {
  business: BusinessDetail | null
  isOpen: boolean
  onClose: () => void
}

const featureIcons: Record<string, React.ReactNode> = {
  "WiFi": <Wifi className="w-4 h-4" />,
  "Pet-friendly": <PawPrint className="w-4 h-4" />,
  "Terraza": <Utensils className="w-4 h-4" />,
}

export function BusinessDetailModal({ business, isOpen, onClose }: BusinessDetailModalProps) {
  const { isFavorite, toggleFavorite, syncing } = useFavorites()
  const { toast } = useToast()
  const { getFormattedDistanceTo, hasLocation, loading: locationLoading } = useGeolocation()
  const [liveDistance, setLiveDistance] = useState<string | null>(null)
  
  if (!isOpen || !business) return null
  
  const isFavorited = isFavorite(business.id)

  // Track view and calculate distance when modal opens
  useEffect(() => {
    if (isOpen && business) {
      // Track view
      trackBusinessView(business.id)
      
      // Calculate live distance
      if (hasLocation && business.lat && business.lng) {
        const distance = getFormattedDistanceTo(business.lat, business.lng)
        setLiveDistance(distance)
      }
    }
  }, [isOpen, business, hasLocation, getFormattedDistanceTo])

  const handleToggleFavorite = async () => {
    await toggleFavorite(business.id)
    toast({
      title: isFavorited ? "Eliminado de favoritos" : "Agregado a favoritos",
      description: isFavorited 
        ? `${business.name} ha sido eliminado de tus favoritos.`
        : `${business.name} ha sido agregado a tus favoritos.`,
    })
  }

  const handleOpenInMap = () => {
    if (business.lat && business.lng) {
      window.open(`/map-interactive?lat=${business.lat}&lng=${business.lng}&zoom=16`, '_blank')
    }
  }

  const handleGetDirections = () => {
    if (business.lat && business.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`, '_blank')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: business.description,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copiado",
        description: "El enlace ha sido copiado al portapapeles.",
      })
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
        <div 
          className="bg-white w-full md:max-w-4xl md:max-h-[90vh] rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full md:slide-in-from-bottom-8 duration-500 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Content Container with Scroll */}
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Image Gallery Header */}
            <div className="relative h-64 md:h-80 bg-gray-200">
              <img
                src={business.image || "/placeholder.svg"}
                alt={business.name}
                className="w-full h-full object-cover"
              />
              
              {/* Favorite & Share buttons */}
              <div className="absolute top-4 left-4 flex gap-2">
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                  title={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      isFavorited ? "fill-red-500 text-red-500 scale-110" : "text-gray-700 hover:text-red-500"
                    }`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                  title="Compartir"
                >
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Category Badge */}
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-indigo-600 text-white px-3 py-1">
                  {business.category}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {business.name}
                  </h1>
                  
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-lg">{business.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-gray-600">({business.reviews} reseñas)</span>
                    </div>

                    {/* Price Range */}
                    <div className="flex items-center gap-1 text-gray-700">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">{"💰".repeat(business.priceRange)}</span>
                    </div>

                    {/* Open/Closed */}
                    {business.isOpen ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Abierto ahora
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Cerrado
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={handleGetDirections}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Cómo llegar
                  </Button>
                  <Button
                    onClick={handleOpenInMap}
                    variant="outline"
                    className="flex-1"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver en mapa
                  </Button>
                  {business.phone && (
                    <Button
                      onClick={() => window.open(`tel:${business.phone}`, '_self')}
                      variant="outline"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Llamar
                    </Button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="reviews">Reseñas</TabsTrigger>
                  <TabsTrigger value="location">Ubicación</TabsTrigger>
                </TabsList>

                {/* Info Tab */}
                <TabsContent value="info" className="space-y-6 mt-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Acerca de</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {business.aboutText || business.description}
                    </p>
                  </div>

                  {/* Features */}
                  {business.features && business.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Servicios</h3>
                      <div className="flex flex-wrap gap-2">
                        {business.features.map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="px-3 py-2 text-sm"
                          >
                            {featureIcons[feature] || null}
                            <span className="ml-2">{feature}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hours */}
                  {business.openHours && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Horario</h3>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span>
                          {business.openHours.open} - {business.openHours.close}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contacto</h3>
                    <div className="space-y-2">
                      {business.address && (
                        <div className="flex items-start gap-3 text-gray-700">
                          <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span>{business.address}</span>
                        </div>
                      )}
                      {business.phone && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <Phone className="w-5 h-5 text-gray-500" />
                          <a 
                            href={`tel:${business.phone}`}
                            className="hover:text-indigo-600 transition-colors"
                          >
                            {business.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-gray-700">
                        <Navigation className="w-5 h-5 text-gray-500" />
                        <span className={liveDistance ? "text-indigo-600 font-medium" : ""}>
                          {liveDistance || business.distance || "Calculando..."}
                          {liveDistance && <span className="text-xs text-gray-500 ml-1">(en tiempo real)</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="mt-6">
                  <ReviewSection 
                    businessId={business.id} 
                    businessName={business.name} 
                  />
                </TabsContent>

                {/* Location Tab */}
                <TabsContent value="location" className="space-y-4 mt-6">
                  {/* Map Container */}
                  <div className="bg-gray-100 rounded-xl overflow-hidden h-64 md:h-80 relative">
                    {business.lat && business.lng ? (
                      <BusinessMap
                        lat={business.lat}
                        lng={business.lng}
                        businessName={business.name}
                        address={business.address || ""}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">Ubicación no disponible</p>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  {business.address && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Dirección</p>
                          <p className="text-gray-700">{business.address}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleGetDirections}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      size="lg"
                    >
                      <Navigation className="w-5 h-5 mr-2" />
                      Cómo llegar
                    </Button>
                    <Button
                      onClick={handleOpenInMap}
                      variant="outline"
                      className="flex-1"
                      size="lg"
                    >
                      <MapPin className="w-5 h-5 mr-2" />
                      Abrir en Mapa Interactivo
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
