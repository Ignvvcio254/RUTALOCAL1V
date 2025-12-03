"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOCK_BUSINESSES } from "@/lib/mock-data"
import { MapPin, Star, GripVertical } from "lucide-react"

interface DraggableBusinessCardProps {
  business: (typeof MOCK_BUSINESSES)[0]
}

function DraggableBusinessCard({ business }: DraggableBusinessCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: business.id,
    data: {
      type: "business",
      business,
    },
  })

  const categoryColors = {
    café: "bg-orange-100 text-orange-700",
    arte: "bg-purple-100 text-purple-700",
    tour: "bg-blue-100 text-blue-700",
    hostal: "bg-green-100 text-green-700",
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`group flex gap-3 p-3 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? "opacity-50 scale-95" : "hover:shadow-md"
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
          <span
            className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
              categoryColors[business.category as keyof typeof categoryColors]
            }`}
          >
            {business.category}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-0.5">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-700">{business.rating}</span>
          </div>
          <div className="flex items-center gap-0.5 text-gray-600">
            <MapPin size={12} />
            <span className="text-xs">{business.distance}km</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BusinessCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")

  const filteredBusinesses = MOCK_BUSINESSES.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "todos" || business.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: "todos", label: "Todos" },
    { id: "café", label: "☕ Cafés" },
    { id: "arte", label: "🎨 Arte" },
    { id: "tour", label: "🗺️ Tours" },
    { id: "hostal", label: "🏠 Hostales" },
  ]

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Agregar lugares</h2>

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
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => <DraggableBusinessCard key={business.id} business={business} />)
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No se encontraron negocios</p>
          </div>
        )}
      </div>
    </div>
  )
}
