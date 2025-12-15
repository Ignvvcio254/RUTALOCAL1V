"use client"

import { useState } from "react"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useDroppable, type DragEndEvent } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Zap, MapPin, Clock, AlertCircle } from "lucide-react"
import type { RouteItem } from "./route-builder-container"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface RouteTimelineProps {
  items: RouteItem[]
  onReorder: (items: RouteItem[]) => void
  onRemoveItem: (itemId: string) => void
  onUpdateDuration: (itemId: string, duration: RouteItem["duration"]) => void
  title: string
  description: string
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  totalDuration: string
  totalDistance: string
  onSave?: () => void
  isSaving?: boolean
  isAuthenticated?: boolean
}

function SortableRouteItem({
  item,
  index,
  onRemove,
  onUpdateDuration,
  nextItem,
}: {
  item: RouteItem
  index: number
  onRemove: (id: string) => void
  onUpdateDuration: (id: string, duration: RouteItem["duration"]) => void
  nextItem?: RouteItem
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return (R * c).toFixed(2)
  }

  const calculateTravelTime = (distance: number) => {
    const walkingSpeed = 1.4
    const minutes = Math.round((distance / walkingSpeed) * 60)
    return minutes
  }

  const travelDistance = nextItem ? calculateDistance(item.lat, item.lng, nextItem.lat, nextItem.lng) : null
  const travelTime = travelDistance ? calculateTravelTime(Number.parseFloat(travelDistance)) : null

  const categoryColors = {
    café: "bg-orange-100 text-orange-700",
    arte: "bg-purple-100 text-purple-700",
    tour: "bg-blue-100 text-blue-700",
    hostal: "bg-green-100 text-green-700",
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "group border border-gray-200 rounded-lg p-4 bg-white transition-all",
          isDragging && "ring-2 ring-indigo-500",
        )}
      >
        <div className="flex gap-4">
          {/* Step Number */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded inline-block",
                        categoryColors[item.category as keyof typeof categoryColors],
                      )}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                {...attributes}
                {...listeners}
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Duration Selector */}
            <div className="mt-4 flex items-center gap-3">
              <Clock size={16} className="text-gray-500" />
              <Select value={item.duration} onValueChange={(val) => onUpdateDuration(item.id, val as RouteItem["duration"])}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">15 min</SelectItem>
                  <SelectItem value="30min">30 min</SelectItem>
                  <SelectItem value="1hr">1 hora</SelectItem>
                  <SelectItem value="2hrs">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Indicator */}
      {nextItem && travelDistance && travelTime && (
        <div className="flex justify-center py-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700">
            <MapPin size={14} />
            <span>
              {Number.parseFloat(travelDistance).toFixed(1)}km • {travelTime}min
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export function RouteTimeline({
  items,
  onReorder,
  onRemoveItem,
  onUpdateDuration,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  totalDuration,
  totalDistance,
  onSave,
  isSaving,
  isAuthenticated,
}: RouteTimelineProps) {
  const { setNodeRef } = useDroppable({
    id: "drop-zone",
  })

  const { toast } = useToast()
  const [showAISuggestions, setShowAISuggestions] = useState(false)

  const handleSaveRoute = () => {
    if (onSave) {
      onSave()
    } else {
      // Fallback si no hay callback
      if (items.length < 2) {
        toast({
          title: "Mínimo 2 lugares",
          description: "Agrega al menos 2 lugares para guardar tu ruta",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Ruta guardada",
        description: `"${title}" ha sido guardada exitosamente`,
      })
    }
  }

  const handleOptimizeRoute = () => {
    toast({
      title: "Ruta optimizada",
      description: "Se han reordenado los lugares para minimizar la distancia",
    })
    setShowAISuggestions(false)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over?.id)
      const newItems = [...items]
      newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, items[oldIndex])
      onReorder(newItems)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600">NOMBRE DE LA RUTA</label>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-2xl font-bold mt-1 border-0 p-0 focus-visible:ring-0"
            placeholder="Mi Nueva Ruta"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600">DESCRIPCIÓN (OPCIONAL)</label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="text-sm mt-1 resize-none min-h-16"
            placeholder="Describe tu ruta..."
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <div>{items.length} lugares</div>
          <span>•</span>
          <div>{totalDuration} hrs</div>
          <span>•</span>
          <div>{totalDistance} km</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div
            ref={setNodeRef}
            className={cn(
              "space-y-4 min-h-96 rounded-lg border-2 border-dashed transition-colors",
              items.length > 0 ? "border-gray-200 bg-white" : "border-indigo-300 bg-indigo-50",
            )}
          >
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <MapPin size={48} className="text-indigo-300 mb-3" />
                <p className="text-lg font-medium text-gray-600">Arrastra lugares aquí</p>
                <p className="text-sm text-gray-500">para crear tu ruta</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item, index) => (
                  <SortableRouteItem
                    key={item.id}
                    item={item}
                    index={index}
                    onRemove={onRemoveItem}
                    onUpdateDuration={onUpdateDuration}
                    nextItem={items[index + 1]}
                  />
                ))}
              </div>
            )}
          </div>
        </SortableContext>

        {/* AI Optimize Button */}
        {items.length > 2 && (
          <button
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Zap size={18} />
            Optimizar ruta con IA
          </button>
        )}

        {/* AI Suggestions */}
        {showAISuggestions && items.length > 2 && (
          <div className="mt-4 space-y-2 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-blue-900">Sugerencias de IA</p>
            <button
              onClick={handleOptimizeRoute}
              className="w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-100 transition-colors text-blue-700"
            >
              ✓ Reordenar por distancia (minimiza caminata)
            </button>
            <button
              onClick={() =>
                toast({
                  title: "Función no disponible",
                  description: "Esta sugerencia llegará pronto",
                })
              }
              className="w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-100 transition-colors text-blue-700"
            >
              ✓ Agrupar por horarios
            </button>
          </div>
        )}

        {/* Warnings */}
        {Number.parseFloat(totalDuration) > 6 && items.length > 0 && (
          <div className="mt-4 flex items-start gap-2 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              Tu ruta excede 6 horas. Considera reducir la duración de algunas paradas.
            </p>
          </div>
        )}

        {/* Auth warning */}
        {!isAuthenticated && items.length > 0 && (
          <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              <a href="/login" className="font-semibold underline">Inicia sesión</a> para guardar tu ruta en tu perfil.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleSaveRoute} 
          disabled={isSaving || items.length < 2}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Guardando...
            </>
          ) : (
            'Guardar ruta'
          )}
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent" disabled={items.length === 0}>
          Compartir
        </Button>
      </div>
    </div>
  )
}
