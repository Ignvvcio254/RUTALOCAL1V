"use client"

import { useState, useCallback } from "react"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { BusinessCatalog } from "./business-catalog"
import { RouteTimeline } from "./route-timeline"
import { MapPreview } from "./map-preview"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRoutes, type CreateRouteData } from "@/hooks/use-routes"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Business } from "@/lib/filters/filter-utils"
import { MapPin, Route, List } from "lucide-react"

export interface RouteItem {
  id: string
  businessId: string
  name: string
  category: string
  image: string
  duration: "15min" | "30min" | "1hr" | "2hrs"
  rating: number
  distance: number
  lat: number
  lng: number
}

const durationToMinutes = (duration: RouteItem["duration"]): number => {
  const map: Record<string, number> = {
    "15min": 15,
    "30min": 30,
    "1hr": 60,
    "2hrs": 120
  }
  return map[duration] || 60
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

export function RouteBuilderContainer() {
  const [routeItems, setRouteItems] = useState<RouteItem[]>([])
  const [routeTitle, setRouteTitle] = useState("Mi Nueva Ruta")
  const [routeDescription, setRouteDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const isMobile = useIsMobile()
  
  const { createRoute, loading: routeLoading } = useRoutes()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Agregar negocio a la ruta (desde drag o click en mobile)
  const addBusinessToRoute = useCallback((business: Business & { lat?: number; lng?: number }) => {
    if (routeItems.length >= 15) {
      toast({
        title: "Límite alcanzado",
        description: "Máximo 15 lugares por ruta",
        variant: "destructive"
      })
      return
    }

    // Verificar que no esté duplicado
    if (routeItems.some(item => item.businessId === business.id)) {
      toast({
        title: "Ya agregado",
        description: "Este lugar ya está en tu ruta",
        variant: "destructive"
      })
      return
    }

    const newItem: RouteItem = {
      id: `item-${Date.now()}`,
      businessId: business.id,
      name: business.name,
      category: business.subcategory || business.category,
      image: business.image,
      duration: "1hr",
      rating: business.rating,
      distance: business.distance,
      lat: business.lat || business.coordinates?.[0] || -33.4372,
      lng: business.lng || business.coordinates?.[1] || -70.6506,
    }

    setRouteItems(prev => [...prev, newItem])
    
    toast({
      title: "Lugar agregado",
      description: `${business.name} añadido a tu ruta`,
    })
  }, [routeItems, toast])

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event
    if (!over) return

    const draggedData = active.data.current as {
      type: string
      business: Business & { lat?: number; lng?: number }
    }
    
    if (draggedData?.type === "business" && over.id === "drop-zone") {
      addBusinessToRoute(draggedData.business)
    }
  }

  const handleReorder = (items: RouteItem[]) => {
    setRouteItems(items)
  }

  const handleRemoveItem = (itemId: string) => {
    setRouteItems(routeItems.filter((item) => item.id !== itemId))
  }

  const handleUpdateDuration = (itemId: string, duration: RouteItem["duration"]) => {
    setRouteItems(routeItems.map((item) => (item.id === itemId ? { ...item, duration } : item)))
  }

  const calculateRouteDuration = () => {
    let total = 0
    const durationMap = { "15min": 0.25, "30min": 0.5, "1hr": 1, "2hrs": 2 }

    routeItems.forEach((item, index) => {
      total += durationMap[item.duration]
      if (index < routeItems.length - 1) {
        const nextItem = routeItems[index + 1]
        const distance = calculateDistance(item.lat, item.lng, nextItem.lat, nextItem.lng)
        total += Number.parseFloat(distance) / 1.4 / 60
      }
    })

    return total.toFixed(1)
  }

  const calculateTotalDistance = () => {
    let total = 0
    routeItems.forEach((item, index) => {
      if (index < routeItems.length - 1) {
        const nextItem = routeItems[index + 1]
        const distance = calculateDistance(item.lat, item.lng, nextItem.lat, nextItem.lng)
        total += Number.parseFloat(distance)
      }
    })
    return total.toFixed(1)
  }

  // Guardar ruta en el backend
  const handleSaveRoute = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar rutas",
        variant: "destructive"
      })
      return
    }

    if (routeItems.length < 2) {
      toast({
        title: "Mínimo 2 lugares",
        description: "Agrega al menos 2 lugares para guardar tu ruta",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const routeData: CreateRouteData = {
        name: routeTitle,
        description: routeDescription,
        is_public: false,
        stops: routeItems.map((item, index) => ({
          business_id: item.businessId,
          order: index + 1,
          duration: durationToMinutes(item.duration),
          notes: ""
        }))
      }

      console.log('📤 Saving route:', routeData)
      const savedRoute = await createRoute(routeData)

      if (savedRoute) {
        toast({
          title: "¡Ruta guardada!",
          description: `"${routeTitle}" se ha guardado en tu perfil`,
        })
        
        // Limpiar formulario
        setRouteItems([])
        setRouteTitle("Mi Nueva Ruta")
        setRouteDescription("")
      } else {
        throw new Error("No se pudo guardar la ruta")
      }
    } catch (error) {
      console.error('❌ Error saving route:', error)
      toast({
        title: "Error al guardar",
        description: error instanceof Error ? error.message : "Intenta de nuevo más tarde",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Vista Mobile con tabs optimizados
  if (isMobile) {
    return (
      <div className="h-screen bg-white flex flex-col">
        <Tabs defaultValue="places" className="flex-1 flex flex-col">
          <TabsList className="w-full rounded-none border-b bg-white grid grid-cols-3 h-14">
            <TabsTrigger value="places" className="flex flex-col items-center gap-1 text-xs py-2 data-[state=active]:bg-indigo-50">
              <MapPin size={18} />
              <span>Lugares</span>
            </TabsTrigger>
            <TabsTrigger value="route" className="flex flex-col items-center gap-1 text-xs py-2 data-[state=active]:bg-indigo-50 relative">
              <List size={18} />
              <span>Mi Ruta</span>
              {routeItems.length > 0 && (
                <span className="absolute top-1 right-4 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {routeItems.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="map" className="flex flex-col items-center gap-1 text-xs py-2 data-[state=active]:bg-indigo-50">
              <Route size={18} />
              <span>Mapa</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="places" className="flex-1 overflow-hidden m-0">
            <BusinessCatalog 
              onAddBusiness={addBusinessToRoute}
              isMobile={true}
            />
          </TabsContent>

          <TabsContent value="route" className="flex-1 overflow-auto m-0">
            <DndContext onDragEnd={handleDragEnd}>
              <RouteTimeline
                items={routeItems}
                onReorder={handleReorder}
                onRemoveItem={handleRemoveItem}
                onUpdateDuration={handleUpdateDuration}
                title={routeTitle}
                description={routeDescription}
                onTitleChange={setRouteTitle}
                onDescriptionChange={setRouteDescription}
                totalDuration={calculateRouteDuration()}
                totalDistance={calculateTotalDistance()}
                onSave={handleSaveRoute}
                isSaving={isSaving || routeLoading}
                isAuthenticated={isAuthenticated}
              />
            </DndContext>
          </TabsContent>

          <TabsContent value="map" className="flex-1 overflow-hidden m-0">
            <MapPreview items={routeItems} title={routeTitle} />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Vista Desktop
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen overflow-hidden">
        {/* Left Panel - Business Catalog */}
        <div className="w-[25%] border-r border-gray-200 overflow-y-auto">
          <BusinessCatalog />
        </div>

        {/* Center Panel - Route Timeline */}
        <div className="w-[50%] border-r border-gray-200 overflow-y-auto">
          <RouteTimeline
            items={routeItems}
            onReorder={handleReorder}
            onRemoveItem={handleRemoveItem}
            onUpdateDuration={handleUpdateDuration}
            title={routeTitle}
            description={routeDescription}
            onTitleChange={setRouteTitle}
            onDescriptionChange={setRouteDescription}
            totalDuration={calculateRouteDuration()}
            totalDistance={calculateTotalDistance()}
            onSave={handleSaveRoute}
            isSaving={isSaving || routeLoading}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* Right Panel - Map Preview */}
        <div className="w-[25%] overflow-hidden">
          <MapPreview items={routeItems} title={routeTitle} />
        </div>
      </div>
    </DndContext>
  )
}
