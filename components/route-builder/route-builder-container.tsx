"use client"

import { useState } from "react"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { BusinessCatalog } from "./business-catalog"
import { RouteTimeline } from "./route-timeline"
import { MapPreview } from "./map-preview"
import { useIsMobile } from "@/hooks/use-mobile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Business } from "@/lib/mock-data"

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

const calculateTravelTime = (distance: string) => {
  const walkingSpeed = 1.4
  const minutes = Math.round((Number.parseFloat(distance) / walkingSpeed) * 60)
  return `${minutes} min walk`
}

export function RouteBuilderContainer() {
  const [routeItems, setRouteItems] = useState<RouteItem[]>([])
  const [routeTitle, setRouteTitle] = useState("Mi Nueva Ruta")
  const [routeDescription, setRouteDescription] = useState("")
  const isMobile = useIsMobile()

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event
    if (!over) return

    const draggedData = active.data.current as {
      type: string
      business: Business
    }
    if (draggedData?.type === "business" && over.id === "drop-zone") {
      const newItem: RouteItem = {
        id: `item-${Date.now()}`,
        businessId: draggedData.business.id,
        name: draggedData.business.name,
        category: draggedData.business.category,
        image: draggedData.business.image,
        duration: "1hr",
        rating: draggedData.business.rating,
        distance: draggedData.business.distance,
        lat: draggedData.business.lat,
        lng: draggedData.business.lng,
      }

      if (routeItems.length < 15) {
        setRouteItems([...routeItems, newItem])
      }
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

  if (isMobile) {
    return (
      <div className="h-screen bg-white">
        <Tabs defaultValue="places" className="h-full flex flex-col">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="places" className="flex-1">
              Lugares
            </TabsTrigger>
            <TabsTrigger value="route" className="flex-1">
              Mi Ruta
            </TabsTrigger>
            <TabsTrigger value="map" className="flex-1">
              Mapa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="places" className="flex-1 overflow-auto">
            <DndContext onDragEnd={handleDragEnd}>
              <BusinessCatalog />
            </DndContext>
          </TabsContent>

          <TabsContent value="route" className="flex-1 overflow-auto p-4">
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
              />
            </DndContext>
          </TabsContent>

          <TabsContent value="map" className="flex-1 overflow-auto">
            <MapPreview items={routeItems} title={routeTitle} />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

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
