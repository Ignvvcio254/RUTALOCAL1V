"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAllBusinesses } from "@/hooks/use-businesses"
import { MapPin, Star, GripVertical, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Business } from "@/lib/filters/filter-utils"

interface DraggableBusinessCardProps {
  business: Business
  onAddClick?: (business: Business) => void
  isMobile?: boolean
}

function DraggableBusinessCard({ business, onAddClick, isMobile }: DraggableBusinessCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: business.id,
    data: {
      type: "business",
      business: {
        ...business,
        lat: business.coordinates?.[0] || -33.4372,
        lng: business.coordinates?.[1] || -70.6506,
      },
    },
  })

  const categoryColors: Record<string, string> = {
    "café": "bg-orange-100 text-orange-700",
    "cafetería": "bg-orange-100 text-orange-700",
    "gastronomía": "bg-red-100 text-red-700",
    "restaurante": "bg-red-100 text-red-700",
    "arte": "bg-purple-100 text-purple-700",
    "tour": "bg-blue-100 text-blue-700",
    "turismo": "bg-blue-100 text-blue-700",
    "hostal": "bg-green-100 text-green-700",
    "hospedaje": "bg-green-100 text-green-700",
    "hotel": "bg-green-100 text-green-700",
  }

  const getCategoryColor = (category: string) => {
    const lowerCategory = category.toLowerCase()
    return categoryColors[lowerCategory] || "bg-gray-100 text-gray-700"
  }

  // En mobile mostramos botón de agregar en vez de drag
  if (isMobile) {
    return (
      <div className="group flex gap-3 p-3 border border-gray-200 rounded-lg bg-white">
        <img
          src={business.image || "/placeholder.svg"}
          alt={business.name}
          className="w-16 h-16 rounded object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h4 className="text-sm font-semibold text-gray-900 truncate flex-1">{business.name}</h4>
            <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getCategoryColor(business.subcategory || business.category)}`}>
              {business.subcategory || business.category}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-gray-700">{business.rating}</span>
            </div>
            {business.coordinates && (
              <div className="flex items-center gap-0.5 text-gray-600">
                <MapPin size={12} />
                <span className="text-xs">Con ubicación</span>
              </div>
            )}
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="flex-shrink-0 h-8 w-8 p-0"
          onClick={() => onAddClick?.(business)}
        >
          <Plus size={16} />
        </Button>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`group flex gap-3 p-3 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? "opacity-50 scale-95" : "hover:shadow-md hover:border-indigo-300"
      }`}
    >
      <GripVertical size={16} className="text-gray-400 flex-shrink-0 mt-1" />

      <img
        src={business.image || "/placeholder.svg"}
        alt={business.name}
        className="w-16 h-16 rounded object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h4 className="text-sm font-semibold text-gray-900 truncate flex-1">{business.name}</h4>
          <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getCategoryColor(business.subcategory || business.category)}`}>
            {business.subcategory || business.category}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-0.5">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-700">{business.rating}</span>
          </div>
          {business.coordinates && (
            <div className="flex items-center gap-0.5 text-gray-600">
              <MapPin size={12} />
              <span className="text-xs">📍</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{business.description}</p>
      </div>
    </div>
  )
}

interface BusinessCatalogProps {
  onAddBusiness?: (business: Business) => void
  isMobile?: boolean
}

export function BusinessCatalog({ onAddBusiness, isMobile }: BusinessCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")

  // Usar API real en vez de mock data
  const { businesses, loading, error } = useAllBusinesses()

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (business.subcategory || business.category).toLowerCase().includes(searchQuery.toLowerCase())
    
    const businessCategory = (business.subcategory || business.category).toLowerCase()
    const matchesCategory = selectedCategory === "todos" || 
      businessCategory.includes(selectedCategory) ||
      (selectedCategory === "café" && businessCategory.includes("cafe")) ||
      (selectedCategory === "hospedaje" && (businessCategory.includes("hotel") || businessCategory.includes("hostal")))

    return matchesSearch && matchesCategory
  })

  // Solo mostrar negocios con coordenadas válidas
  const businessesWithLocation = filteredBusinesses.filter(b => 
    b.coordinates && b.coordinates[0] && b.coordinates[1]
  )

  const categories = [
    { id: "todos", label: "Todos" },
    { id: "café", label: "☕ Cafés" },
    { id: "gastronomía", label: "🍽️ Gastro" },
    { id: "turismo", label: "🗺️ Tours" },
    { id: "hospedaje", label: "🏠 Hostales" },
  ]

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 space-y-3">
        <h2 className="text-lg font-bold text-gray-900">
          Agregar lugares
          {businessesWithLocation.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({businessesWithLocation.length} disponibles)
            </span>
          )}
        </h2>

        <Input
          placeholder="Buscar negocios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-sm"
        />

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full grid grid-cols-5 h-auto">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs py-2">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {!isMobile && (
          <p className="text-xs text-gray-500 bg-indigo-50 p-2 rounded">
            💡 Arrastra los lugares hacia tu ruta
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
            <p className="text-sm text-gray-500">Cargando negocios...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-500">Error al cargar negocios</p>
            <p className="text-xs text-gray-500 mt-1">{error.message}</p>
          </div>
        ) : businessesWithLocation.length > 0 ? (
          businessesWithLocation.map((business) => (
            <DraggableBusinessCard 
              key={business.id} 
              business={business}
              onAddClick={onAddBusiness}
              isMobile={isMobile}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <MapPin size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No se encontraron negocios</p>
            <p className="text-xs text-gray-400 mt-1">
              {filteredBusinesses.length > 0 
                ? "Algunos negocios no tienen ubicación registrada"
                : "Intenta con otra búsqueda"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
